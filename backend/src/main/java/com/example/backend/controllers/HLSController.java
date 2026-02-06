package com.example.backend.controllers;

import com.example.backend.s3api.YandexService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hls")
public class HLSController {

    private final YandexService s3;

    public HLSController(YandexService yandexService) {
        this.s3 = yandexService;
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<byte[]> getHlsFile(@PathVariable String filename) {

        byte[] data = s3.getFile("hls/" + filename);

        MediaType type = filename.endsWith(".m3u8")
                ? MediaType.valueOf("application/vnd.apple.mpegurl")
                : MediaType.valueOf("video/MP2T");

        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-cache")
                .contentType(type)
                .body(data);
    }
}

