package com.example.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class ChatMessageOutputDTO {
    private UUID roomId;
    private String text;
    private String author;
    private LocalDateTime created_at;
}
