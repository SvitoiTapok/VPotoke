package com.example.backend.DTO;

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
