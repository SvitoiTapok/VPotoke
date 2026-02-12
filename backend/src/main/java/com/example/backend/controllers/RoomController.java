package com.example.backend.controllers;

import com.example.backend.DTO.PlayerPosInputDTO;
import com.example.backend.services.RoomSerivce;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/room/api")
public class RoomController {

    private final RoomSerivce roomSerivce;
    public RoomController(RoomSerivce roomSerivce) {
        this.roomSerivce = roomSerivce;
    }

    @GetMapping("/newParticipant")
    public ResponseEntity<UUID> newParticipant(@RequestParam UUID roomId, @RequestParam String sessionId) {
        try {
            UUID id = roomSerivce.newParticipant(roomId, sessionId);
            return ResponseEntity.ok().body(id);
        }catch (NoSuchElementException e){
            return ResponseEntity.notFound().build();
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }

//        Participant newParticipant = new Participant();
//        Room room =
//        newParticipant.setRoom(roomId);
//
//        byte[] data = s3.getFile("hls_test2/" + filename);
//        log.info("HLS File: {}", filename);
//        MediaType type = filename.endsWith(".m3u8")
//                ? MediaType.valueOf("application/vnd.apple.mpegurl")
//                : MediaType.valueOf("video/MP2T");
//
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CACHE_CONTROL, "no-cache")
//                .contentType(type)
//                .body(data);
    }
    @GetMapping("/newParticipantWithName")
    public ResponseEntity<UUID> newParticipantWithName(@RequestParam UUID roomId, @RequestParam String name, @RequestParam String sessionId) {
        try {
            UUID id = roomSerivce.newParticipantWithName(roomId, name, sessionId);
            return ResponseEntity.ok().body(id);
        }catch (NoSuchElementException e){
            return ResponseEntity.notFound().build();
        }catch (Exception e){
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
}
