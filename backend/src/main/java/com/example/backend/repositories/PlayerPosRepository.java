package com.example.backend.repositories;

import com.example.backend.entities.PlayerPos;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public class PlayerPosRepository {
    private final JdbcTemplate jdbc;

    public PlayerPosRepository(@Qualifier("clickhouseJdbcTemplate") JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void save(UUID authorId, UUID room_id, long timing) {
        LocalDateTime now = LocalDateTime.now();
        jdbc.update(
                "INSERT INTO player_pos (creation_date, author_id, room_id, timing) VALUES (?, ?, ?, ?)",
                now, authorId, room_id, timing
        );
    }

    public List<PlayerPos> getLastPos(UUID roomID) {
        return jdbc.query("""
            SELECT author_id, argMax(timing, creation_date) AS last_timing
            FROM player_pos
            WHERE room_id=?
            GROUP BY author_id;
        """, (rs, i) -> new PlayerPos(
                rs.getLong("last_timing"),
                rs.getObject("author_id", UUID.class)
        ), roomID);
    }
}
