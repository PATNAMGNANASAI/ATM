package com.example.ATMMonitoringSystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ATMMonitoringSystem.model.Cash;

public interface CashRepo extends JpaRepository<Cash,Integer> {
    Cash findByAtmcode(String atmcode);
}
