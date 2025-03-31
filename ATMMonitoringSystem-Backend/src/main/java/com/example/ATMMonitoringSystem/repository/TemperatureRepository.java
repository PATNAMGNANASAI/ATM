package com.example.ATMMonitoringSystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.ATMMonitoringSystem.model.Temperature;

@Repository
public interface TemperatureRepository extends JpaRepository<Temperature, Integer> {
    Temperature findByAtmcode(String atmcode);
}
