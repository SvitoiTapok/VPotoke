package com.example.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class ChatMessageOutputDTO {
    private UUID roomId;
    private String text;
    private String author;
    private String created_at;
}
