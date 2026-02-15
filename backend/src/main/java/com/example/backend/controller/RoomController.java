package com.example.backend.controller;

import com.example.backend.dto.CreateRoomRequest;
import com.example.backend.dto.RoomResponse;
import com.example.backend.dto.VideoInfo;
import com.example.backend.service.RoomService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Slf4j
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRoom(@RequestBody CreateRoomRequest request, HttpSession session) {
        // Добавим отладку
        log.info("Session ID: {}", session.getId());
        log.info("Session attributes: {}", session.getAttributeNames());

        String userId = (String) session.getAttribute("userId");
        log.info("User ID from session: {}", userId);

        if (userId == null) {
            // Проверим, может быть userId в другом месте
            log.warn("No userId in session. Available attributes:");
            java.util.Enumeration<String> attributeNames = session.getAttributeNames();
            while (attributeNames.hasMoreElements()) {
                String attr = attributeNames.nextElement();
                log.warn("Attribute: {} = {}", attr, session.getAttribute(attr));
            }
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        try {
            RoomResponse room = roomService.createRoom(userId, request);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            log.error("Error creating room", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-videos")
    public ResponseEntity<?> getMyVideos(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        List<VideoInfo> videos = roomService.getUserVideos(userId);
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoom(@PathVariable String roomId) {
        try {
            RoomResponse room = roomService.getRoom(roomId);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/invite/{inviteLink}")
    public ResponseEntity<?> getRoomByInvite(@PathVariable String inviteLink) {
        try {
            RoomResponse room = roomService.getRoomByInviteLink(inviteLink);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{roomId}/join")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId,
                                      @RequestBody(required = false) Map<String, String> request,
                                      HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        String nickname = request != null ? request.get("nickname") : null;

        try {
            roomService.joinRoom(roomId, userId, nickname);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{roomId}/leave")
    public ResponseEntity<?> leaveRoom(@PathVariable String roomId, HttpSession session) {
        String userId = (String) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        try {
            log.info("User {} leaving room {}", userId, roomId);
            // Здесь должна быть логика удаления участника из комнаты
            // participantRepository.deleteByRoomIdAndUserId(roomId, userId);

            return ResponseEntity.ok(Map.of("success", true, "message", "Left room successfully"));
        } catch (Exception e) {
            log.error("Error leaving room", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}