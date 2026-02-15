package com.example.backend.repositories;

import com.example.backend.entities.Room;
import com.example.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RoomRepository extends JpaRepository<Room, UUID> {
    List<Room> findByCreator(User userId);
    Optional<Room> findByLink(String inviteLink);
}
