package com.example.backend.DTO;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ChatMessageInputDTO {
    private long roomId;
    private String text;
    private long userId;
}
