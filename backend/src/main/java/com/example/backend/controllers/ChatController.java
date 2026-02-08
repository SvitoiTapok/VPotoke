package com.example.backend.controllers;

import com.example.backend.entities.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @MessageMapping("/chat.send")
    @SendTo("/topic/room")
    public ChatMessage send(ChatMessage message) {
        return message;
    }
}
