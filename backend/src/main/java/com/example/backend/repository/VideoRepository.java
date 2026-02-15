package com.example.backend.repository;

import com.example.backend.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface VideoRepository extends JpaRepository<Video, String> {
    List<Video> findByExpiresAtBefore(LocalDateTime now);
    List<Video> findByUploadedAtAfter(LocalDateTime cutoff);
}