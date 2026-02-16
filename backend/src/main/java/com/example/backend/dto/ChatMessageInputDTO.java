package com.example.backend.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageInputDTO {
    private UUID roomId;
    private String text;
    private UUID userId;
}
