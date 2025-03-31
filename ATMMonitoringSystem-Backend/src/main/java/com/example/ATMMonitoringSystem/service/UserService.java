package com.example.ATMMonitoringSystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.ATMMonitoringSystem.model.User;
import com.example.ATMMonitoringSystem.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Authenticates a user by email and password
     * 
     * @param email the user's email used for authentication
     * @param password the user's password
     * @return User object if authentication successful, null otherwise
     */
    public User authenticateUser(String email, String password) {
        User user = userRepository.findByUserId(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }
    
    /**
     * Creates a new user account
     * 
     * @param user the user object to create
     * @return the created user
     */
    public User createUser(User user) {
        // Check if user already exists
        User existingUser = userRepository.findByUserId(user.getUserId());
        if (existingUser != null) {
            throw new RuntimeException("User with this email already exists");
        }
        
        // Encode the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return userRepository.save(user);
    }
}
