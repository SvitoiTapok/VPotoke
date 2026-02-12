package com.example.backend.services;

import com.example.backend.DTO.ChatMessageInputDTO;
import com.example.backend.DTO.ChatMessageOutputDTO;
import com.example.backend.DTO.PlayerPosOutputDTO;
import com.example.backend.entities.ChatMessage;
import com.example.backend.entities.Participant;
import com.example.backend.entities.PlayerPos;
import com.example.backend.entities.Room;
import com.example.backend.repositories.MessageRepository;
import com.example.backend.repositories.ParticipantRepository;
import com.example.backend.repositories.PlayerPosRepository;
import com.example.backend.repositories.RoomRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.logging.Logger;

@Service
@Slf4j
public class RoomSerivce {
    private final MessageRepository messageRepository;
    private final ParticipantRepository participantRepository;
    private final RoomRepository roomRepository;
    private final PlayerPosRepository playerPosRepository;

    public RoomSerivce(MessageRepository messageRepository, ParticipantRepository participantRepository, RoomRepository roomRepository, PlayerPosRepository playerPosRepository) {
        this.messageRepository = messageRepository;
        this.participantRepository = participantRepository;
        this.roomRepository = roomRepository;
        this.playerPosRepository = playerPosRepository;
    }


    public ChatMessageOutputDTO saveMessage(ChatMessageInputDTO input){
        ChatMessage ch = messageRepository.save(input.getUserId(), input.getText(), input.getRoomId());
        Participant owner = participantRepository.findById(ch.getUserId()).orElse(null);
        System.out.println(owner);
        System.out.println(input);
        if (owner == null){throw new NoSuchElementException();}
        return new ChatMessageOutputDTO(ch.getRoomId(), ch.getText(), owner.getNickname(), ch.getCreationDate());
    }

    public UUID newParticipant(UUID roomId, String sessionId){
        Optional<Participant> existing = participantRepository.findByRoomIdAndSessionId(roomId, sessionId);
        if (existing.isPresent()){
            return existing.get().getId();
        }
        Participant p = new Participant();
        Room r = roomRepository.findById(roomId).orElseThrow(NoSuchElementException::new);
        p.setRoom(r);
        p.setNickname("Participant " + UUID.randomUUID());
        p.setPlayer_rights(true);
        p.setMessage_rights(true);
        p.setSessionId(sessionId);
        return participantRepository.save(p).getId();
    }

    public UUID newParticipantWithName(UUID roomId, String name, String sessionId){
        Optional<Participant> existing = participantRepository.findByRoomIdAndSessionId(roomId, sessionId);
        if (existing.isPresent()){
            return existing.get().getId();
        }
        Participant p = new Participant();
        Room r = roomRepository.findById(roomId).orElseThrow(NoSuchElementException::new);
        p.setRoom(r);
        p.setNickname(name);
        p.setPlayer_rights(true);
        p.setMessage_rights(true);
        return participantRepository.save(p).getId();
    }

    public void registerPlayerPos(UUID authorId, UUID roomId, long timing){
        playerPosRepository.save(authorId, roomId, timing);
    }
    public List<PlayerPosOutputDTO> getActualPlayerPos(UUID roomId, UUID authorId){
        return playerPosRepository.getLastPos(roomId, authorId).stream().map((PlayerPos p) -> {
            PlayerPosOutputDTO ans = new PlayerPosOutputDTO();
            ans.setTiming(p.getTiming());
            log.info(p.getAuthorId().toString());
            ans.setName(Objects.requireNonNull(participantRepository.findById(p.getAuthorId()).orElse(null)).getNickname());
            return ans;
        }).toList();
    }
}
