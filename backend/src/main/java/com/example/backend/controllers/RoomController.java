package com.example.backend.controllers;

import com.example.backend.DTO.*;
import com.example.backend.entities.Participant;
import com.example.backend.services.RoomSerivce;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.NotFound;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Slf4j
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/room/api")
@RequiredArgsConstructor
public class RoomController {

    private final RoomSerivce roomSerivce;
    private final SimpMessagingTemplate messagingTemplate;


    @GetMapping("/newParticipant")
    public ResponseEntity<UUID> newParticipant(@RequestParam UUID roomId, @RequestParam String sessionId) {
        try {
            UUID id = roomSerivce.newParticipant(roomId, sessionId);
            messagingTemplate.convertAndSend(
                    "/topic/room/" + roomId + "/participants",
                    roomSerivce.getAllParticipants(roomId)
            );
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
            UUID id = roomSerivce.newParticipantWithName(roomId, name, sessionId);
            messagingTemplate.convertAndSend(
                    "/topic/room/" + roomId + "/participants",
                    roomSerivce.getAllParticipants(roomId)
            );
            return ResponseEntity.ok().body(id);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/addNewPlayerPos")
    public ResponseEntity<?> addNewPlayerPos(@RequestBody PlayerPosInputDTO pl) {
        roomSerivce.registerPlayerPos(pl.getAuthorId(), pl.getRoomId(), pl.getTiming());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getPlayerPos")
    public ResponseEntity<?> getPlayerPos(@RequestParam UUID roomId, @RequestParam UUID authorId) {
        return ResponseEntity.ok(roomSerivce.getActualPlayerPos(roomId, authorId));
    }

    @MessageMapping("/part.upd/{roomId}")
    public void updateParticipants(
            @DestinationVariable UUID roomId
    ) {
        messagingTemplate.convertAndSend(
                "/topic/room/" + roomId + "/participants",
                roomSerivce.getAllParticipants(roomId)
        );
    }

    @GetMapping("/updateName")
    public ResponseEntity<?> updateName(@RequestParam UUID authorId, @RequestParam String name) {
        UUID id = roomSerivce.getParticipant(authorId).getRoom().getId();
        roomSerivce.updateName(authorId, name);
        messagingTemplate.convertAndSend(
                "/topic/room/" + id + "/participants",
                roomSerivce.getAllParticipants(id)
        );
        return ResponseEntity.ok().build();
    }
    @GetMapping("/OnSyncMode")
    public ResponseEntity<?> onSyncMode(@RequestParam UUID roomId, @RequestParam UUID userId, @RequestParam float pos) {
        log.info("onSyncMode");
        if(roomSerivce.changeMode(roomId, userId, true)){
            sendSync(roomId, true);
            sendPosition(roomId, pos);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
    @GetMapping("/OffSyncMode")
    public ResponseEntity<?> offSyncMode(@RequestParam UUID roomId, @RequestParam UUID userId) {
        log.info("offSyncMode");
        if(roomSerivce.changeMode(roomId, userId, false)){
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
        if(roomSerivce.getSync(roomId)) sendPause(roomId);

    }
    @MessageMapping("/player.play/{roomId}")
    public void handlePlay(
            @DestinationVariable UUID roomId
    ) {
        log.info("handlePlay by roomId: {}", roomId);
        if(roomSerivce.getSync(roomId)) sendPlay(roomId);
    }
    @MessageMapping("/player.pos/{roomId}")
    public void handlePosition(
            @DestinationVariable UUID roomId,
            @Payload float pos
    ) {
        log.info("handlePos by roomId: {}", roomId);
        if(roomSerivce.getSync(roomId)) sendPosition(roomId, pos);
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
