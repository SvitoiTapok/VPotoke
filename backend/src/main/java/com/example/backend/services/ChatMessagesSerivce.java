package com.example.backend.services;

import com.example.backend.DTO.ChatMessageInputDTO;
import com.example.backend.DTO.ChatMessageOutputDTO;
import com.example.backend.entities.ChatMessage;
import com.example.backend.entities.Participant;
import com.example.backend.repositories.MessageRepository;
import com.example.backend.repositories.ParticipantRepository;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class ChatMessagesSerivce {
    private final MessageRepository messageRepository;
    private final ParticipantRepository participantRepository;
    public ChatMessagesSerivce(MessageRepository messageRepository, ParticipantRepository participantRepository) {
        this.messageRepository = messageRepository;
        this.participantRepository = participantRepository;
    }
    public ChatMessageOutputDTO save(ChatMessageInputDTO input){
        ChatMessage ch = messageRepository.save(input.getUserId(), input.getText(), input.getRoomId());
        Participant owner = participantRepository.findById(ch.getUserId()).orElse(null);
        System.out.println(owner);
        System.out.println(input);
        if (owner == null){throw new NoSuchElementException();}
        return new ChatMessageOutputDTO(ch.getRoomId(), ch.getText(), owner.getNickname(), ch.getCreationDate());
    }
}
