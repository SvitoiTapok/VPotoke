package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoUploadResponse {
    private String message;
    private String videoId;      // ID видео в БД
    private String hlsUrl;       // URL для HLS плейлиста
    private boolean success;
    private long duration;       // длительность видео в секундах
}