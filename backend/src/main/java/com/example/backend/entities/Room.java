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

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false, referencedColumnName = "id")
    private User creator;

    @OneToMany(mappedBy = "room")
    private List<Participant> participants;
}
