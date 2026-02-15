package com.example.backend.controllers;

import com.example.backend.dto.VideoUploadResponse;
import com.example.backend.entities.Video;
import com.example.backend.repositories.VideoRepository;
import com.example.backend.services.VideoConversionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

@RestController
@RequestMapping("/api/video")
//@CrossOrigin(origins = "*")
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
            // Проверка размера файла (5GB max)
            if (file.getSize() > 5L * 1024 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(new VideoUploadResponse("File too large. Max 5GB", null, null, false, 0));
            }

            // Проверка на пустой файл
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new VideoUploadResponse("File is empty", null, null, false, 0));
            }

            // Сохраняем временный файл
            String tempFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            tempFile = Paths.get("/tmp", tempFileName);
            Files.copy(file.getInputStream(), tempFile, StandardCopyOption.REPLACE_EXISTING);

            log.info("File uploaded temporarily: {}, size: {} bytes", tempFile, file.getSize());

            // Запускаем асинхронную конвертацию
            CompletableFuture<String> future = conversionService.convertToHLSAndUpload(
                    tempFile,
                    file.getOriginalFilename()
            );

            try {
                // Ждем результат с таймаутом 5 минут
                String hlsPath = future.get(5, TimeUnit.MINUTES);

                // Сохраняем в БД
                Video video = new Video();
                video.setOriginalFileName(file.getOriginalFilename());
                video.setFileSize(file.getSize());
                video.setHlsPath(hlsPath);
                video.setPlaylistUrl(hlsPath); // hlsPath уже содержит полный URL

                video = videoRepository.save(video);

                log.info("Video uploaded successfully. ID: {}, HLS: {}", video.getId(), hlsPath);

                return ResponseEntity.ok(new VideoUploadResponse(
                        "Video uploaded and converted successfully",
                        video.getId(),
                        hlsPath,
                        true,
                        0
                ));

            } catch (TimeoutException e) {
                log.error("Video conversion timeout", e);
                return ResponseEntity.internalServerError()
                        .body(new VideoUploadResponse("Conversion timeout. The file may be too large.", null, null, false, 0));
            } catch (ExecutionException e) {
                log.error("Video conversion failed", e.getCause());
                return ResponseEntity.internalServerError()
                        .body(new VideoUploadResponse("Conversion failed: " + e.getCause().getMessage(), null, null, false, 0));
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return ResponseEntity.internalServerError()
                        .body(new VideoUploadResponse("Conversion was interrupted", null, null, false, 0));
            }

        } catch (IOException e) {
            log.error("Failed to save temporary file", e);
            return ResponseEntity.internalServerError()
                    .body(new VideoUploadResponse("Failed to save file: " + e.getMessage(), null, null, false, 0));
        } catch (Exception e) {
            log.error("Unexpected error during upload", e);
            return ResponseEntity.internalServerError()
                    .body(new VideoUploadResponse("Upload failed: " + e.getMessage(), null, null, false, 0));
        } finally {
            // Не удаляем файл здесь, он будет удален после конвертации
            // Если конвертация не запустилась - удаляем
            if (tempFile != null && Files.exists(tempFile)) {
                try {
                    Files.deleteIfExists(tempFile);
                } catch (IOException e) {
                    log.error("Failed to delete temp file: {}", tempFile, e);
                }
            }
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> getUserVideos() {
        return ResponseEntity.ok(videoRepository.findAll());
    }
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("VideoUploadController is working!");
    }
}