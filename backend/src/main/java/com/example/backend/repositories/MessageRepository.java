package com.example.backend.repositories;

import com.example.backend.entities.ChatMessage;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import com.github.f4b6a3.uuid.UuidCreator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public class MessageRepository {
    private final JdbcTemplate jdbc;

    public MessageRepository(@Qualifier("clickhouseJdbcTemplate") JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public ChatMessage save(UUID authorId, String text, UUID room_id) {
        UUID id = UuidCreator.getTimeOrderedEpoch();
        LocalDateTime now = LocalDateTime.now();
        jdbc.update(
                "INSERT INTO messages (id, room_id, text, creation_date, author_id) VALUES (?, ?, ?, ?, ?)",
                id, room_id, text, now, authorId
        );
        return new ChatMessage(id, room_id, text, now, authorId);
    }

    public List<ChatMessage> findLast(int limit) {
        return jdbc.query("""
            SELECT id, room_id, text, created_at, author_id
            FROM messages
            ORDER BY created_at DESC
            LIMIT ?
        """, (rs, i) -> new ChatMessage(
                rs.getObject("id", UUID.class),
                rs.getObject("room_id", UUID.class),
                rs.getString("text"),
                rs.getTimestamp("created_at").toLocalDateTime(),
                rs.getObject("author_id", UUID.class)
        ), limit);
    }
}
