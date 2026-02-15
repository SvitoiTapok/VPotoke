package com.example.backend.service;

import com.example.backend.repository.VideoRepository;
import com.example.backend.s3api.YandexService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Slf4j
public class VideoCleanupService {

    private final VideoRepository videoRepository;
    private final YandexService yandexService;

    public VideoCleanupService(VideoRepository videoRepository, YandexService yandexService) {
        this.videoRepository = videoRepository;
        this.yandexService = yandexService;
    }

    // Каждый час проверяем и удаляем старые видео (FR-03: храним 6 часов)
    @Scheduled(fixedRate = 3600000)
    public void cleanupExpiredVideos() {
        var expiredVideos = videoRepository.findByExpiresAtBefore(LocalDateTime.now());

        for (var video : expiredVideos) {
            try {
                // TODO: удалить файлы из S3
                // yandexService.deleteFolder(video.getHlsPath());
                videoRepository.delete(video);
                log.info("Deleted expired video: {}", video.getId());
            } catch (Exception e) {
                log.error("Failed to delete expired video: {}", video.getId(), e);
            }
        }
    }
}