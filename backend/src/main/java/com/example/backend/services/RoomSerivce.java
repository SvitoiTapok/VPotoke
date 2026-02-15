package com.example.backend.services;

import com.example.backend.DTO.ChatMessageInputDTO;
import com.example.backend.DTO.ChatMessageOutputDTO;
import com.example.backend.DTO.ParticipantDTO;
import com.example.backend.DTO.PlayerPosOutputDTO;
import com.example.backend.entities.*;
import com.example.backend.repositories.*;
import com.example.backend.util.ColorUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomSerivce {
    private final MessageRepository messageRepository;
    private final ParticipantRepository participantRepository;
    private final RoomRepository roomRepository;
    private final PlayerPosRepository playerPosRepository;
    private final UserRepository userRepository;
    private final VideoRepository videoRepository;



    public ChatMessageOutputDTO saveMessage(ChatMessageInputDTO input){
        if (!participantRepository.findById(input.getUserId()).get().getMessage_rights()) {
            return null;
        }
        ChatMessage ch = messageRepository.save(input.getUserId(), input.getText(), input.getRoomId());
        Participant owner = participantRepository.findById(ch.getUserId()).orElse(null);
        if (owner == null){throw new NoSuchElementException();}
        return new ChatMessageOutputDTO(ch.getRoomId(), ch.getText(), owner.getNickname(), ch.getCreationDate().format(DateTimeFormatter.ISO_TIME));
    }

    public UUID newParticipant(UUID roomId, String sessionId){
        Optional<Participant> existing = participantRepository.findByRoomIdAndSessionId(roomId, sessionId);
        if (existing.isPresent()){
            return existing.get().getId();
        }
        Participant p = new Participant();
        Room r = roomRepository.findById(roomId).orElseThrow(NoSuchElementException::new);
        p.setRoom(r);
        p.setAdmin(false);
        p.setNickname("Participant " + UUID.randomUUID());
        p.setColor(ColorUtil.randomNiceColor());
        p.setPlayer_rights(true);
        p.setMessage_rights(true);
        p.setSessionId(sessionId);
        UUID id = participantRepository.save(p).getId();
        playerPosRepository.save(id, roomId, 0);
        return id;
    }

    public UUID newParticipantWithName(UUID roomId, String name, String sessionId){
        Optional<Participant> existing = participantRepository.findByRoomIdAndSessionId(roomId, sessionId);
        if (existing.isPresent()){
            return existing.get().getId();
        }
        Participant p = new Participant();
        p.setAdmin(true);
        Room r = roomRepository.findById(roomId).orElseThrow(NoSuchElementException::new);
        p.setRoom(r);
        p.setNickname(name);
        p.setColor(ColorUtil.randomNiceColor());
        p.setPlayer_rights(true);
        p.setMessage_rights(true);
        return participantRepository.save(p).getId();
    }

    public void registerPlayerPos(UUID authorId, UUID roomId, long timing){
        playerPosRepository.save(authorId, roomId, timing);
    }
    public List<PlayerPosOutputDTO> getActualPlayerPos(UUID roomId, UUID authorId){
        return playerPosRepository.getLastPos(roomId).stream().map((PlayerPos p) -> {
            PlayerPosOutputDTO ans = new PlayerPosOutputDTO();
            ans.setTiming(p.getTiming());
            try {
                Participant author = Objects.requireNonNull(participantRepository.findById(p.getAuthorId()).orElseThrow(NoSuchElementException::new));
                ans.setName(author.getNickname());
                ans.setColor(author.getColor());
            }catch (NoSuchElementException e){
                return null;
            }
            return ans;
        }).filter(Objects::nonNull).toList();
    }
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void deleteParticipant(UUID authorId){

        try {
            participantRepository.deleteById(authorId);
        }catch (Exception ignored) {}

        log.info("Deleted participant {}", authorId);



    }
    public Participant getParticipant(UUID authorId){
        try {
            return participantRepository.findById(authorId).orElseThrow(NoSuchElementException::new);
        }catch (NoSuchElementException e){
            return null;
        }
    }
    public List<ParticipantDTO> getAllParticipants(UUID roomId){
        List<UUID> l = playerPosRepository.getLastPos(roomId).stream().map(PlayerPos::getAuthorId).toList();
        return participantRepository.findByRoomId(roomId).stream().map((participant -> {
            if(!l.contains(participant.getId())){
                log.info("deleting participant {}", participant.getId());
                participantRepository.deleteById(participant.getId());
                return null;
            }
            log.info(participant.getId().toString());
            return new ParticipantDTO(participant.getNickname(), participant.getColor(), participant.getId().toString(), participant.getPlayer_rights(), participant.getMessage_rights(), participant.getAdmin());
        })).filter(Objects::nonNull).toList();
    }
    public void updateName(UUID authorId, String name){
        log.info("updating name {} {}", name, authorId);
        Participant p = participantRepository.findById(authorId).orElseThrow(NoSuchElementException::new);
        p.setNickname(name);
        participantRepository.save(p);
    }
    public boolean changeMode(UUID roomId, UUID authorId, boolean mode){
        Participant p = participantRepository.findById(authorId).orElseThrow(NoSuchElementException::new);
        if(p.getPlayer_rights()){
            Room r = roomRepository.findById(roomId).orElseThrow(NoSuchElementException::new);
            r.setIsSync(mode);
            roomRepository.save(r);
            return true;
        }else {
            return false;
        }
    }
    public boolean getSync(UUID roomId){
        return roomRepository.findById(roomId).orElseThrow(NoSuchElementException::new).getIsSync();
    }
//==================================================================================================================
@Transactional
public com.example.backend.dto.RoomResponse createRoom(String userId, com.example.backend.dto.CreateRoomRequest request) {
    User moderator = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    Video video = videoRepository.findById(request.getVideoId())
            .orElseThrow(() -> new RuntimeException("Video not found"));

    // Проверяем, что видео принадлежит пользователю
    // Временное решение - пропускаем проверку

    Room room = new Room();
    room.setName(request.getName());
    room.setDescription(request.getDescription());
    room.setVideo(video);
    room.setCreator(moderator);

    room = roomRepository.save(room);

//    RoomParticipant participant = new RoomParticipant();
//    participant.setRoom(room);
//    participant.setUser(moderator);
//    participant.setNickname(moderator.getLogin());
//    participant.setCanControl(true);
//    participant.setCanChat(true);
//    participantRepository.save(participant);


    return com.example.backend.dto.RoomResponse.fromEntity(room);
}
    public com.example.backend.dto.RoomResponse getRoom(UUID roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return com.example.backend.dto.RoomResponse.fromEntity(room);
    }

    public com.example.backend.dto.RoomResponse getRoomByInviteLink(String inviteLink) {
        Room room = roomRepository.findByLink(inviteLink)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return com.example.backend.dto.RoomResponse.fromEntity(room);
    }

//    @Transactional
//    public void joinRoom(UUID roomId, String userId, String nickname) {
//        Room room = roomRepository.findById(roomId)
//                .orElseThrow(() -> new RuntimeException("Room not found"));
//
//        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;
//
//        Participant participant = new Participant();
//        participant.setRoom(room);
//        participant.setNickname(nickname != null ? nickname :
//                (user != null ? user.getLogin() : "Guest-" + System.currentTimeMillis() % 1000));
//
//        participantRepository.save(participant);
//        log.info("User joined room: {}, nickname: {}", roomId, participant.getNickname());
//    }

//    @Transactional
//    public void leaveRoom(String roomId, String userId) {
//        // Находим участника по roomId и userId
//        // И удаляем его
//        log.info("Removing user {} from room {}", userId, roomId);
//        // participantRepository.deleteByRoomIdAndUserId(roomId, userId);
//    }

    public List<com.example.backend.dto.VideoInfo> getUserVideos(String userId) {
        // Временное решение - возвращаем все видео, загруженные за последние 6 часов
        LocalDateTime sixHoursAgo = LocalDateTime.now().minusHours(6);
        return videoRepository.findByUploadedAtAfter(sixHoursAgo)
                .stream()
                .map(com.example.backend.dto.VideoInfo::fromEntity)
                .collect(Collectors.toList());
    }


}
