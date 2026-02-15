package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Getter
@Setter
@ToString
public class ChatMessageInputDTO {
    private UUID roomId;
    private String text;
    private UUID userId;
}
