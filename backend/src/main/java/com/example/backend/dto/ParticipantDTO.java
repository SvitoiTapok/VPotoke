package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ParticipantDTO {
    private String name;
    private String color;
    private String Id;
    private Boolean playerRights;
    private Boolean charRights;
    private Boolean adminRights;
}
