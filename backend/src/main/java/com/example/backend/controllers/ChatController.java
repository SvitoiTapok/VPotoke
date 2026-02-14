package com.example.backend.controllers;

import com.example.backend.DTO.ChatMessageInputDTO;
import com.example.backend.DTO.ChatMessageOutputDTO;
import com.example.backend.entities.ChatMessage;
import com.example.backend.repositories.ParticipantRepository;
import com.example.backend.services.RoomSerivce;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    private final RoomSerivce roomSerivce;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send/{roomId}")
    public void sendMessage(
            @DestinationVariable UUID roomId,
            @Payload ChatMessageInputDTO msg
    ) {
        ChatMessageOutputDTO mes = roomSerivce.saveMessage(msg);
        log.info("Message sent to room {}: {}", roomId, mes);
        messagingTemplate.convertAndSend(
                "/topic/room/" + roomId + "/chat",
                mes
        );
    }
}
