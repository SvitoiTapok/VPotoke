package com.example.backend.controllers;

import com.example.backend.DTO.*;
import com.example.backend.entities.Participant;
import com.example.backend.services.RoomSerivce;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
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
