package com.example.backend.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class PlayerPosOutputDTO {
    private String name;
    private long timing;
}
