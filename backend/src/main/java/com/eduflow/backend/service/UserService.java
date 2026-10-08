package com.eduflow.backend.service;

import com.eduflow.backend.entity.User;
import com.eduflow.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElse(null);
    }

    public User updateUserById(UUID id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElse(null);

        if(existingUser == null) return null;

        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setRole(updatedUser.getRole());

        return userRepository.save(existingUser);
    }

    public void deleteUserById(UUID id) {
        userRepository.deleteById(id);
    }
}
