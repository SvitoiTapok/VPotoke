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
@Table(name = "app_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(columnDefinition = "VARCHAR(255)")
    private String login;
    @Column(columnDefinition = "VARCHAR(255)")
    private String password;

    @Column(unique = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime registrationDate;


    @OneToMany(mappedBy = "creator")
    private List<Room> rooms;
}
