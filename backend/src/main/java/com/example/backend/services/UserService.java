package com.example.backend.services;

import com.example.backend.dto.AuthResponse;
import com.example.backend.entities.User;
import com.example.backend.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Service
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthResponse register(String login, String password) {
        // Проверка на пустые значения
        if (login == null || login.trim().isEmpty()) {
            return new AuthResponse(false, "Login cannot be empty", null, null);
        }
        if (password == null || password.trim().isEmpty()) {
            return new AuthResponse(false, "Password cannot be empty", null, null);
        }

        // Проверка существования пользователя
        if (userRepository.existsByLogin(login)) {
            return new AuthResponse(false, "User with this login already exists", null, null);
        }

        // Создание нового пользователя
        User user = new User();
        user.setLogin(login);
        user.setPassword(hashPassword(password)); // Хешируем пароль

        try {
            user = userRepository.save(user);
            log.info("New user registered: {}", login);
            return new AuthResponse(true, "Registration successful", user.getId(), user.getLogin());
        } catch (Exception e) {
            log.error("Error registering user", e);
            return new AuthResponse(false, "Registration failed: " + e.getMessage(), null, null);
        }
    }

    public AuthResponse login(String login, String password) {
        if (login == null || login.trim().isEmpty()) {
            return new AuthResponse(false, "Login cannot be empty", null, null);
        }
        if (password == null || password.trim().isEmpty()) {
            return new AuthResponse(false, "Password cannot be empty", null, null);
        }

        var userOptional = userRepository.findByLogin(login);

        if (userOptional.isEmpty()) {
            return new AuthResponse(false, "User not found", null, null);
        }

        User user = userOptional.get();

        String hashedInputPassword = hashPassword(password);
        if (!user.getPassword().equals(hashedInputPassword)) {
            return new AuthResponse(false, "Invalid password", null, null);
        }

        log.info("User logged in: {}", login);
        return new AuthResponse(true, "Login successful", user.getId(), user.getLogin());
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
}