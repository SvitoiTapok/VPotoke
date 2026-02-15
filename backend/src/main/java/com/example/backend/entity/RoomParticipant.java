package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "room_participants")
@Data
@NoArgsConstructor
public class RoomParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;  // может быть null для гостей

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false)
    private boolean canControl = true;  // право управлять плеером

    @Column(nullable = false)
    private boolean canChat = true;  // право писать в чат

    @Column(nullable = false)
    private LocalDateTime joinedAt;

    @PrePersist
    protected void onJoin() {
        joinedAt = LocalDateTime.now();
    }
}