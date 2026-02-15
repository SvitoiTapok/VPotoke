package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "videos")
@Data
@NoArgsConstructor
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String originalFileName;
    private String hlsPath;      // путь в S3 bucket (папка с HLS)
    private String playlistUrl;  // полный URL до master.m3u8

    private Long fileSize;
    private Integer duration;    // в секундах

    private LocalDateTime uploadedAt;
    private LocalDateTime expiresAt;  // удаляем через 6 часов (FR-03)

    @PrePersist
    public void prePersist() {
        uploadedAt = LocalDateTime.now();
        expiresAt = uploadedAt.plusHours(6);
    }
}