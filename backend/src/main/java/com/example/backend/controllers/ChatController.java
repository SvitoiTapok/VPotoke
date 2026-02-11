package com.example.backend.controllers;

import com.example.backend.DTO.ChatMessageInputDTO;
import com.example.backend.DTO.ChatMessageOutputDTO;
import com.example.backend.services.RoomSerivce;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    private final RoomSerivce roomSerivce;
    public ChatController(RoomSerivce roomSerivce) {
        this.roomSerivce = roomSerivce;
    }
    @MessageMapping("/chat.send")
    @SendTo("/topic/room")
    public ChatMessageOutputDTO send(ChatMessageInputDTO message) {
        return roomSerivce.save(message);
    }
}
