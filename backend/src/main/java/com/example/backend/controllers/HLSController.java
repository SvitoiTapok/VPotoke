package com.example.backend.controllers;

import com.example.backend.s3api.YandexService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/player/api")
public class HLSController {

    private static final Logger log = LoggerFactory.getLogger(HLSController.class);
    private final YandexService s3;

    public HLSController(YandexService yandexService) {
        this.s3 = yandexService;
    }

    @GetMapping("/stream/{filename:.+}")
    public ResponseEntity<byte[]> getHlsFile(@PathVariable String filename) {

        byte[] data = s3.getFile("hls_test2/" + filename);
        log.info("HLS File: {}", filename);
        MediaType type = filename.endsWith(".m3u8")
                ? MediaType.valueOf("application/vnd.apple.mpegurl")
                : MediaType.valueOf("video/MP2T");

        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-cache")
                .contentType(type)
                .body(data);
    }
}

