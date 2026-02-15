package com.example.backend.service;

import com.example.backend.dto.CreateRoomRequest;
import com.example.backend.dto.RoomResponse;
import com.example.backend.dto.VideoInfo;
import com.example.backend.entity.*;
import com.example.backend.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomParticipantRepository participantRepository;
    private final VideoRepository videoRepository;
    private final UserRepository userRepository;

    public RoomService(RoomRepository roomRepository,
                       RoomParticipantRepository participantRepository,
                       VideoRepository videoRepository,
                       UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.participantRepository = participantRepository;
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public RoomResponse createRoom(String userId, CreateRoomRequest request) {
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
        room.setModerator(moderator);

        room = roomRepository.save(room);

        // Добавляем модератора как первого участника
        RoomParticipant participant = new RoomParticipant();
        participant.setRoom(room);
        participant.setUser(moderator);
        participant.setNickname(moderator.getLogin());
        participant.setCanControl(true);
        participant.setCanChat(true);
        participantRepository.save(participant);

        log.info("Room created: {} by user: {}", room.getName(), userId);

        return RoomResponse.fromEntity(room);
    }

    public RoomResponse getRoom(String roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return RoomResponse.fromEntity(room);
    }

    public RoomResponse getRoomByInviteLink(String inviteLink) {
        Room room = roomRepository.findByInviteLink(inviteLink)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return RoomResponse.fromEntity(room);
    }

    @Transactional
    public void joinRoom(String roomId, String userId, String nickname) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;

        RoomParticipant participant = new RoomParticipant();
        participant.setRoom(room);
        participant.setUser(user);
        participant.setNickname(nickname != null ? nickname :
                (user != null ? user.getLogin() : "Guest-" + System.currentTimeMillis() % 1000));

        participantRepository.save(participant);
        log.info("User joined room: {}, nickname: {}", roomId, participant.getNickname());
    }

    @Transactional
    public void leaveRoom(String roomId, String userId) {
        // Находим участника по roomId и userId
        // И удаляем его
        log.info("Removing user {} from room {}", userId, roomId);
        // participantRepository.deleteByRoomIdAndUserId(roomId, userId);
    }

    public List<VideoInfo> getUserVideos(String userId) {
        // Временное решение - возвращаем все видео, загруженные за последние 6 часов
        LocalDateTime sixHoursAgo = LocalDateTime.now().minusHours(6);
        return videoRepository.findByUploadedAtAfter(sixHoursAgo)
                .stream()
                .map(VideoInfo::fromEntity)
                .collect(Collectors.toList());
    }


}