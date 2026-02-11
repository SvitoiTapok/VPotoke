package com.example.backend.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class ChatMessage {
    private UUID id;
    private UUID roomId;
    private String text;
    private LocalDateTime creationDate;
    private UUID userId;
}
