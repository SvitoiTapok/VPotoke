package com.example.backend.services;

import com.example.backend.s3api.YandexService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class VideoConversionService {

    private final YandexService yandexService;

    public VideoConversionService(YandexService yandexService) {
        this.yandexService = yandexService;
    }

    @Async
    public CompletableFuture<String> convertToHLSAndUpload(Path inputPath, String originalFilename) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String videoId = UUID.randomUUID().toString();
                String outputDir = "/tmp/hls_" + videoId;
                Files.createDirectories(Paths.get(outputDir));

                String outputPlaylist = outputDir + "/master.m3u8";

                log.info("Starting FFmpeg conversion for: {}", originalFilename);

                // Команда ffmpeg для конвертации в HLS
                ProcessBuilder pb = new ProcessBuilder(
                        "ffmpeg",
                        "-i", inputPath.toString(),
                        "-profile:v", "baseline",
                        "-level", "3.0",
                        "-start_number", "0",
                        "-hls_time", "10",
                        "-hls_list_size", "0",
                        "-f", "hls",
                        "-hls_segment_filename", outputDir + "/master_%03d.ts",
                        outputPlaylist
                );

                pb.redirectErrorStream(true);
                Process process = pb.start();

                // Логируем вывод ffmpeg
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        log.debug("ffmpeg: {}", line);
                    }
                }

                int exitCode = process.waitFor();
                if (exitCode != 0) {
                    throw new RuntimeException("FFmpeg failed with exit code: " + exitCode);
                }

                log.info("FFmpeg conversion completed for: {}", originalFilename);

                // Загружаем все файлы на S3
                String s3Folder = "videos/" + videoId;

                Files.walk(Paths.get(outputDir))
                        .filter(Files::isRegularFile)
                        .forEach(filePath -> {
                            try {
                                String key = s3Folder + "/" + filePath.getFileName().toString();
                                byte[] data = Files.readAllBytes(filePath);

                                String contentType = filePath.toString().endsWith(".m3u8")
                                        ? "application/vnd.apple.mpegurl"
                                        : "video/MP2T";

                                yandexService.uploadFile(key, data, contentType);
                                log.info("Uploaded to S3: {}", key);
                            } catch (IOException e) {
                                log.error("Failed to upload file: {}", filePath, e);
                                throw new RuntimeException("Failed to upload to S3", e);
                            }
                        });

                // Очищаем временные файлы
                deleteDirectory(Paths.get(outputDir));
                Files.deleteIfExists(inputPath);

                String hlsUrl = "/api/video/stream/" + s3Folder + "/master.m3u8";
                log.info("Video processed successfully. URL: {}", hlsUrl);

                return hlsUrl;

            } catch (Exception e) {
                log.error("Video conversion failed", e);
                throw new RuntimeException("Video conversion failed: " + e.getMessage(), e);
            }
        });
    }

    private void deleteDirectory(Path directory) {
        try {
            if (Files.exists(directory)) {
                Files.walk(directory)
                        .sorted((a, b) -> b.toString().length() - a.toString().length())
                        .forEach(path -> {
                            try {
                                Files.deleteIfExists(path);
                            } catch (IOException e) {
                                log.error("Failed to delete: {}", path, e);
                            }
                        });
            }
        } catch (IOException e) {
            log.error("Failed to delete directory: {}", directory, e);
        }
    }
}