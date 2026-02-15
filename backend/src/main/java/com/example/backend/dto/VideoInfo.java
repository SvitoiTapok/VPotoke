package com.example.backend.dto;

import com.example.backend.entities.Video;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VideoInfo {
    private String id;
    private String fileName;
    private long fileSize;
    private LocalDateTime uploadedAt;
    private LocalDateTime expiresAt;
    private String hlsUrl;

    public static VideoInfo fromEntity(Video video) {
        VideoInfo info = new VideoInfo();
        info.setId(video.getId());
        info.setFileName(video.getOriginalFileName());
        info.setFileSize(video.getFileSize());
        info.setUploadedAt(video.getUploadedAt());
        info.setExpiresAt(video.getExpiresAt());
        info.setHlsUrl(video.getPlaylistUrl());
        return info;
    }
}