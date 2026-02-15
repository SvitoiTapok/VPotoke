package com.example.backend.controllers;

import com.example.backend.dto.*;
import com.example.backend.services.RoomSerivce;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;

@Slf4j
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/room/api")
@RequiredArgsConstructor
public class RoomController {

    private final RoomSerivce roomService;
    private final SimpMessagingTemplate messagingTemplate;


    @GetMapping("/newParticipant")
    public ResponseEntity<UUID> newParticipant(@RequestParam UUID roomId, @RequestParam String sessionId) {
        try {
            UUID id = roomService.newParticipant(roomId, sessionId);
            updateParticipantsReq(roomId);
            return ResponseEntity.ok().body(id);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("newParticipant failed", e);
            return ResponseEntity.badRequest().build();
        }

    }

    @GetMapping("/newParticipantWithName")
    public ResponseEntity<UUID> newParticipantWithName(@RequestParam UUID roomId, @RequestParam String name, @RequestParam String sessionId) {
        try {
            UUID id = roomService.newParticipantWithName(roomId, name, sessionId);
            updateParticipantsReq(roomId);
            return ResponseEntity.ok().body(id);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/addNewPlayerPos")
    public ResponseEntity<?> addNewPlayerPos(@RequestBody PlayerPosInputDTO pl) {
        roomService.registerPlayerPos(pl.getAuthorId(), pl.getRoomId(), pl.getTiming());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getPlayerPos")
    public ResponseEntity<?> getPlayerPos(@RequestParam UUID roomId, @RequestParam UUID authorId) {
        return ResponseEntity.ok(roomService.getActualPlayerPos(roomId, authorId));
    }

    @MessageMapping("/part.upd/{roomId}")
    public void updateParticipants(
            @DestinationVariable UUID roomId
    ) {
        updateParticipantsReq(roomId);
    }

    @GetMapping("/updateName")
    public ResponseEntity<?> updateName(@RequestParam UUID authorId, @RequestParam String name) {
        UUID id = roomService.getParticipant(authorId).getRoom().getId();
        roomService.updateName(authorId, name);
        updateParticipantsReq(id);
//
        return ResponseEntity.ok().build();
    }
    @GetMapping("/OnSyncMode")
    public ResponseEntity<?> onSyncMode(@RequestParam UUID roomId, @RequestParam UUID userId, @RequestParam float pos) {
        log.info("onSyncMode");
        if(roomService.changeMode(roomId, userId, true)){
            sendSync(roomId, true);
            sendPosition(roomId, pos);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
    @GetMapping("/OffSyncMode")
    public ResponseEntity<?> offSyncMode(@RequestParam UUID roomId, @RequestParam UUID userId) {
        log.info("offSyncMode");
        if(roomService.changeMode(roomId, userId, false)){
            sendSync(roomId, false);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @MessageMapping("/player.pause/{roomId}")
    public void handlePause(
            @DestinationVariable UUID roomId
    ) {
        log.info("handlePause by roomId: {}", roomId);
        if(roomService.getSync(roomId)) sendPause(roomId);

    }
    @MessageMapping("/player.play/{roomId}")
    public void handlePlay(
            @DestinationVariable UUID roomId
    ) {
        log.info("handlePlay by roomId: {}", roomId);
        if(roomService.getSync(roomId)) sendPlay(roomId);
    }
    @MessageMapping("/player.pos/{roomId}")
    public void handlePosition(
            @DestinationVariable UUID roomId,
            @Payload float pos
    ) {
        log.info("handlePos by roomId: {}", roomId);
        if(roomService.getSync(roomId)) sendPosition(roomId, pos);
    }
    private void sendPause(UUID roomId) {
        messagingTemplate.convertAndSend(
                "/topic/room/" + roomId + "/pause",
                ""

        );
    }
    private void sendPlay(UUID roomId) {
        messagingTemplate.convertAndSend(
                "/topic/room/" + roomId + "/play",
                ""

        );
    }
    private void sendPosition(UUID roomId, float pos) {
        messagingTemplate.convertAndSend(
                "/topic/room/" + roomId + "/position",
                pos

        );
    }
    private void sendSync(UUID roomId, boolean mode) {
        messagingTemplate.convertAndSend(
                "/topic/room/" + roomId + "/sync",
                mode

        );
    }
    private void updateParticipantsReq(UUID roomId){
        messagingTemplate.convertAndSend(
                "/topic/room/" + roomId + "/participants",
                roomService.getAllParticipants(roomId)
        );
    }
    @PostMapping("/create")
    public ResponseEntity<?> createRoom(@RequestBody com.example.backend.dto.CreateRoomRequest request, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            log.warn("No userId in session. Available attributes:");
            java.util.Enumeration<String> attributeNames = session.getAttributeNames();
            while (attributeNames.hasMoreElements()) {
                String attr = attributeNames.nextElement();
                log.warn("Attribute: {} = {}", attr, session.getAttribute(attr));
            }
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        try {
            com.example.backend.dto.RoomResponse room = roomService.createRoom(userId, request);
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

        List<com.example.backend.dto.VideoInfo> videos = roomService.getUserVideos(userId);
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoom(@PathVariable UUID roomId) {
        try {
            com.example.backend.dto.RoomResponse room = roomService.getRoom(roomId);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/invite/{inviteLink}")
    public ResponseEntity<?> getRoomByInvite(@PathVariable String inviteLink) {
        try {
            com.example.backend.dto.RoomResponse room = roomService.getRoomByInviteLink(inviteLink);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/togglePermission")
    public ResponseEntity<?> togglePermission(@RequestParam UUID roomId, @RequestParam UUID userId, @RequestParam UUID adminId, @RequestParam String type) {
        if(roomService.togglePermission(userId, adminId, type)){
            return ResponseEntity.ok().build();
        }
        updateParticipantsReq(roomId);
        return ResponseEntity.badRequest().build();

    }
    @GetMapping("/makeAdmin")
    public ResponseEntity<?> makeAdmin(@RequestParam UUID roomId, @RequestParam UUID userId, @RequestParam UUID adminId) {
        if(roomService.makeAdmin(userId, adminId)){
            return ResponseEntity.ok().build();
        }
        updateParticipantsReq(roomId);
        return ResponseEntity.badRequest().build();

    }

//    @PostMapping("/{roomId}/join")
//    public ResponseEntity<?> joinRoom(@PathVariable String roomId,
//                                      @RequestBody(required = false) Map<String, String> request,
//                                      HttpSession session) {
//        String userId = (String) session.getAttribute("userId");
//        String nickname = request != null ? request.get("nickname") : null;
//
//        try {
//            roomService.joinRoom(roomId, userId, nickname);
//            return ResponseEntity.ok(Map.of("success", true));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }

//    @PostMapping("/{roomId}/leave")
//    public ResponseEntity<?> leaveRoom(@PathVariable String roomId, HttpSession session) {
//        String userId = (String) session.getAttribute("userId");
//
//        if (userId == null) {
//            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
//        }
//
//        try {
//            log.info("User {} leaving room {}", userId, roomId);
//            // Здесь должна быть логика удаления участника из комнаты
//            // participantRepository.deleteByRoomIdAndUserId(roomId, userId);
//
//            return ResponseEntity.ok(Map.of("success", true, "message", "Left room successfully"));
//        } catch (Exception e) {
//            log.error("Error leaving room", e);
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }
    //    @DeleteMapping("/deleteParticipant/{userId}")
//    public ResponseEntity<?> deleteParticipant(@PathVariable UUID userId) {
//        roomSerivce.deleteParticipant(userId);
//        return ResponseEntity.ok().build();
//    }
//    @PostMapping(value = "/leave/{participantId}/{roomId}", consumes = "*/*")
//    public ResponseEntity<Void> leave(@PathVariable UUID participantId, @PathVariable UUID roomId) {
//        log.info("LEAVE {}", participantId);
//        roomSerivce.deleteParticipant(participantId);
//        messagingTemplate.convertAndSend(
//                "/topic/room/" + roomId + "/participants",
//                roomSerivce.getAllParticipants(roomId)
//        );
//        return ResponseEntity.ok().build();
//    }


}
