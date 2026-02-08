package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Participant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
