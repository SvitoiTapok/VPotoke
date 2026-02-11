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

    @ManyToOne
    @JoinColumn(name="room_id", nullable = false)
    private Room room;
}
