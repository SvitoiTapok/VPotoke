package com.example.backend.repository;

import com.example.backend.entity.RoomParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoomParticipantRepository extends JpaRepository<RoomParticipant, String> {
    List<RoomParticipant> findByRoomId(String roomId);
    void deleteByRoomId(String roomId);
}