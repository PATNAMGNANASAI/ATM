package com.example.ATMMonitoringSystem.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users") // Ensure this matches your actual table name
public class User {
    
    @Id
    @Column(name = "email") // Use the actual column name in your database
    private String userId; // We'll keep this property name for code compatibility
    
    @Column(name = "name")
    private String name;
    
    @Column(name = "password")
    private String password;
    
    @Column(name = "role")
    private String role;
    
    // Default constructor
    public User() {}
    
    // Getters and setters
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
}
