package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class AuthResponse {
    private boolean success;
    private String message;
    private UUID userId;
    private String login;
    // Добавляем поле для sessionId, если нужно
}