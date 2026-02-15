package com.example.backend.controllers;

import com.example.backend.dto.PlayerPosInputDTO;
import com.example.backend.dto.PlayerPosOutputDTO;
import com.example.backend.s3api.YandexService;
import com.example.backend.services.RoomSerivce;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/player/api")
@Slf4j
@RequiredArgsConstructor
public class HLSController {

    private final YandexService s3;
    private final RoomSerivce roomSerivce;
    private final SimpMessagingTemplate messagingTemplate;
    @GetMapping("/stream/{filename:.+}")
    public ResponseEntity<byte[]> getHlsFile(@PathVariable String filename) {

        byte[] data = s3.getFile("hls_test2/" + filename);
        //log.info("HLS File: {}", filename);
        MediaType type = filename.endsWith(".m3u8")
                ? MediaType.valueOf("application/vnd.apple.mpegurl")
                : MediaType.valueOf("video/MP2T");

        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-cache")
                .contentType(type)
                .body(data);
    }
    @MessageMapping("/player.send/{roomId}")
    public void sendPlayerPos(
            @DestinationVariable UUID roomId,
            @Payload PlayerPosInputDTO pos
    ) {
        roomSerivce.registerPlayerPos(pos.getAuthorId(), pos.getRoomId(), pos.getTiming());
        List<PlayerPosOutputDTO> ans = roomSerivce.getActualPlayerPos(pos.getRoomId(), pos.getAuthorId());
        //log.info("Sending PlayerPos: {}", ans.size());
        messagingTemplate.convertAndSend(
                "/topic/room/" + roomId + "/player",
                ans
        );
        messagingTemplate.convertAndSend(
                "/topic/room/" + roomId + "/participants",
                roomSerivce.getAllParticipants(roomId)
        );
    }
}

