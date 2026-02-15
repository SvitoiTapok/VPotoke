package com.example.backend.dto;

import com.example.backend.entity.Room;
import lombok.Data;

@Data
public class RoomResponse {
    private String id;
    private String name;
    private String description;
    private String videoId;
    private String videoUrl;
    private String videoName;
    private String moderatorId;
    private String moderatorLogin;
    private String inviteLink;
    private int participantsCount;

    public static RoomResponse fromEntity(Room room) {
        RoomResponse response = new RoomResponse();
        response.setId(room.getId());
        response.setName(room.getName());
        response.setDescription(room.getDescription());
        response.setVideoId(room.getVideo().getId());

        // Формируем правильный URL для видео
        String videoPath = room.getVideo().getPlaylistUrl();
        if (videoPath != null && !videoPath.startsWith("/api")) {
            // Если это путь типа "videos/123/master.m3u8"
            response.setVideoUrl("/api/video/stream/" + videoPath);
        } else {
            response.setVideoUrl(videoPath);
        }

        response.setVideoName(room.getVideo().getOriginalFileName());
        response.setModeratorId(room.getModerator().getId());
        response.setModeratorLogin(room.getModerator().getLogin());
        response.setInviteLink(room.getInviteLink());
        response.setParticipantsCount(room.getParticipants().size());
        return response;
    }
}