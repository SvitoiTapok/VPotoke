package com.example.backend.repositories;

import com.example.backend.entities.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ParticipantRepository extends JpaRepository<Participant, UUID> {
    Optional<Participant> findByRoomIdAndSessionId(UUID roomId, String session_Id);
    List<Participant> findByRoomId(UUID roomId);
    Optional<Participant> findBySessionId(String sessionId);

}
