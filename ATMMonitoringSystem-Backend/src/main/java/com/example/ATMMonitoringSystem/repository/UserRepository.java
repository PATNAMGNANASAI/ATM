package com.example.ATMMonitoringSystem.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.ATMMonitoringSystem.model.User;

@Repository
public interface UserRepository extends CrudRepository<User, String> {
    User findByUserId(String userId);
    boolean existsByUserId(String userId);
}
