package com.example.ATMMonitoringSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import com.example.ATMMonitoringSystem.model.User;
import com.example.ATMMonitoringSystem.service.UserService;
import com.example.ATMMonitoringSystem.dto.LoginRequest;
import com.example.ATMMonitoringSystem.dto.RegisterRequest;
import com.example.ATMMonitoringSystem.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	private UserService userService;
	
	@Autowired
	private UserRepository userRepository;

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
		try {
			// UserService.authenticateUser now handles password comparison with BCrypt
			User user = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
			
			if (user != null) {
				// Return user role in response to match React app expectations
				Map<String, String> response = new HashMap<>();
				response.put("role", user.getRole());
				return ResponseEntity.ok(response);
			} else {
				Map<String, String> errorResponse = new HashMap<>();
				errorResponse.put("message", "Invalid Credentials");
				return ResponseEntity.status(401).body(errorResponse);
			}
		} catch (Exception e) {
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("message", "Login failed: " + e.getMessage());
			return ResponseEntity.status(401).body(errorResponse);
		}
	}
	
	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
		try {
			User newUser = new User();
			if (!registerRequest.getRole().equalsIgnoreCase("admin") && 
				!registerRequest.getRole().equalsIgnoreCase("tech")) {
				throw new IllegalArgumentException("Invalid role. Role must be either 'admin' or 'tech'.");
			}
			newUser.setName(registerRequest.getName());
			newUser.setUserId(registerRequest.getEmail()); // Using email as userId
			newUser.setPassword(registerRequest.getPassword()); // Plain password - will be encoded in UserService
			newUser.setRole(registerRequest.getRole());
			
			
			// UserService.createUser will hash the password before saving
			User createdUser = userService.createUser(newUser);
			
			Map<String, String> response = new HashMap<>();
			response.put("message", "User registered successfully");
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("message", "Registration failed: " + e.getMessage());
			return ResponseEntity.badRequest().body(errorResponse);
		}
	}
	
	@GetMapping("/check-email")
	public ResponseEntity<?> checkEmailExists(@RequestParam String email) {
		boolean exists = userRepository.existsByUserId(email);
		Map<String, Boolean> response = new HashMap<>();
		response.put("exists", exists);
		return ResponseEntity.ok(response);
	}
}
