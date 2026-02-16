package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(unique = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime creation_date;

    @Column(columnDefinition = "VARCHAR(255)")
    private String name;
    @Column(columnDefinition = "VARCHAR(3000)")
    private String description;
    @Column(columnDefinition = "VARCHAR(256)")
    private String link;
    @Column
    private Boolean isSync;

    @ManyToOne
    @JoinColumn(name = "video_id", nullable = false)
    private Video video;
    @ManyToOne
    @JoinColumn(name="user_id", nullable = false, referencedColumnName = "id")
    private User creator;
    @PrePersist
    protected void onCreate() {
        // Генерируем уникальную ссылку-приглашение
        link = generateInviteLink();
    }
    @OneToMany(mappedBy = "room",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Participant> participants;
    private String generateInviteLink() {
        return "room-" + java.util.UUID.randomUUID().toString().substring(0, 8);
    }
}
