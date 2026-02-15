package com.example.backend.dto;

import lombok.Data;

@Data
public class CreateRoomRequest {
    private String name;
    private String description;
    private String videoId;  // ID существующего видео
    // если videoId null, значит нужно загрузить новое видео
}