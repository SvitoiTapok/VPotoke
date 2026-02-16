package com.example.backend.controllers;

import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.AuthResponse;
import com.example.backend.services.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        log.info("Registration attempt for login: {}", request.getLogin());
        AuthResponse response = userService.register(request.getLogin(), request.getPassword());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request, HttpSession session) {
        log.info("Login attempt for login: {}", request.getLogin());
        AuthResponse response = userService.login(request.getLogin(), request.getPassword());

        if (response.isSuccess()) {
            session.setAttribute("userId", response.getUserId());
            session.setAttribute("userLogin", response.getLogin());
            log.info("User logged in, session ID: {}", session.getId());
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        String userLogin = (String) session.getAttribute("userLogin");

        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        return ResponseEntity.ok(Map.of(
                "userId", userId,
                "login", userLogin
        ));
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("AuthController is working!");
    }
}