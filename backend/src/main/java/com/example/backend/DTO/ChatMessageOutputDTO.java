package com.example.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ChatMessageOutputDTO {
    private long roomId;
    private String text;
    private String author;
    private LocalDateTime created_at;
}
