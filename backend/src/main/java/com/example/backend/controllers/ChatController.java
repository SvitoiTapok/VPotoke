package com.example.backend.controllers;

import com.example.backend.DTO.ChatMessageInputDTO;
import com.example.backend.DTO.ChatMessageOutputDTO;
import com.example.backend.entities.ChatMessage;
import com.example.backend.services.ChatMessagesSerivce;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    private final ChatMessagesSerivce chatMessagesSerivce;
    public ChatController(ChatMessagesSerivce chatMessagesSerivce) {
        this.chatMessagesSerivce = chatMessagesSerivce;
    }
    @MessageMapping("/chat.send")
    @SendTo("/topic/room")
    public ChatMessageOutputDTO send(ChatMessageInputDTO message) {
        return chatMessagesSerivce.save(message);
    }
}
