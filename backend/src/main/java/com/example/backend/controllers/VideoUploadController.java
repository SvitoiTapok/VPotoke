package com.example.backend.controllers;

import com.example.backend.dto.VideoUploadResponse;
import com.example.backend.entities.Video;
import com.example.backend.repositories.VideoRepository;
import com.example.backend.services.VideoConversionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/video")
@Slf4j
public class VideoUploadController {

    private final VideoConversionService conversionService;
    private final VideoRepository videoRepository;

    public VideoUploadController(VideoConversionService conversionService,
                                 VideoRepository videoRepository) {
        this.conversionService = conversionService;
        this.videoRepository = videoRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<VideoUploadResponse> uploadVideo(@RequestParam("file") MultipartFile file) {
        Path tempFile = null;

        try {
            // Проверка размера файла
            long maxSize = 5L * 1024 * 1024 * 1024; // 5GB
            if (file.getSize() > maxSize) {
                return ResponseEntity.badRequest()
                        .body(new VideoUploadResponse("File too large. Max 5GB", null, null, false, 0));
            }

            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new VideoUploadResponse("File is empty", null, null, false, 0));
            }

            log.info("Receiving file: {}, size: {} bytes, content type: {}",
                    file.getOriginalFilename(), file.getSize(), file.getContentType());

            // Создаем временную директорию если её нет
            Path tempDir = Paths.get("/tmp/vpotoke");
            if (!Files.exists(tempDir)) {
                Files.createDirectories(tempDir);
            }

            // Сохраняем с уникальным именем
            String uniqueFileName = System.currentTimeMillis() + "_" +
                    file.getOriginalFilename().replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
            tempFile = tempDir.resolve(uniqueFileName);

            // Копируем с буферизацией для больших файлов
            try (InputStream inputStream = file.getInputStream()) {
                long copied = Files.copy(inputStream, tempFile, StandardCopyOption.REPLACE_EXISTING);
                log.info("Saved {} bytes to temporary file: {}", copied, tempFile);
            }

            // Запускаем асинхронную конвертацию
            CompletableFuture<String> future = conversionService.convertToHLSAndUpload(
                    tempFile,
                    file.getOriginalFilename()
            );

            // Увеличиваем таймаут для больших файлов (15 минут)
            String hlsPath = future.get(15, TimeUnit.MINUTES);

            // Сохраняем в БД
            Video video = new Video();
            video.setOriginalFileName(file.getOriginalFilename());
            video.setFileSize(file.getSize());
            video.setHlsPath(hlsPath);
            video.setPlaylistUrl(hlsPath);

            video = videoRepository.save(video);

            log.info("Video uploaded successfully. ID: {}, HLS: {}", video.getId(), hlsPath);

            return ResponseEntity.ok(new VideoUploadResponse(
                    "Video uploaded and converted successfully",
                    video.getId(),
                    hlsPath,
                    true,
                    0
            ));

        } catch (Exception e) {
            log.error("Upload failed", e);
            return ResponseEntity.internalServerError()
                    .body(new VideoUploadResponse("Upload failed: " + e.getMessage(),
                            null, null, false, 0));
        }
    }

    // Альтернативный метод для потоковой загрузки (если нужно)
    @PostMapping("/upload/stream")
    public ResponseEntity<VideoUploadResponse> uploadVideoStreaming(@RequestParam("file") MultipartFile file) {
        // То же самое, но с дополнительными проверками
        return uploadVideo(file);
    }
}