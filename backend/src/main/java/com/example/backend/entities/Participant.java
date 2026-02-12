package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "participant",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"room_id", "sessionId"})
        }
)
public class Participant {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(columnDefinition = "VARCHAR(255)")
    private String nickname;
    @Column
    private Boolean message_rights;
    @Column
    private Boolean player_rights;
    @Column(nullable = false)
    private String sessionId;

    @ManyToOne
    @JoinColumn(name="room_id", nullable = false)
    private Room room;
}
