package com.example.ATMMonitoringSystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.ATMMonitoringSystem.model.Temperature;
import com.example.ATMMonitoringSystem.repository.TemperatureRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;

@Service
public class TemperatureService {
    private static final Logger logger = LoggerFactory.getLogger(TemperatureService.class);

    @Autowired
    private TemperatureRepository temperatureRepository;

    @Transactional
    public Temperature saveTemperature(Temperature temperature) {
        try {
            // Ensure timestamp is set
            if (temperature.getTimestamp() == null) {
                temperature.setTimestamp(new Date());
            }

            // Calculate Kelvin if missing
            if (temperature.getTempKelvin() == null && temperature.getTempCelsius() != null) {
                temperature.setTempKelvin(temperature.getTempCelsius() + 273.15f);
            }

            // Generate status message
            String message = "";
            if (temperature.getTempCelsius() != null) {
                if (temperature.getTempCelsius() > 35.0) {
                    temperature.setAtmStatus("HIGH TEMPERATURE");
                    message = "High temperature alert!";
                } else {
                    temperature.setAtmStatus("NORMAL");
                    message = "Temperature normal";
                }
            }
            temperature.setMessage(message);

            // Save and return
            return temperatureRepository.save(temperature);
        } catch (Exception e) {
            logger.error("Error saving temperature data: {}", e.getMessage());
            throw new RuntimeException("Failed to save temperature data", e);
        }
    }

    public String checkTempErrors(Float tempCelsius, Float tempKelvin) {
        StringBuilder error = new StringBuilder();
        
        if (tempCelsius != null && (tempCelsius < 15.0 || tempCelsius > 30.0)) {
            error.append("Celsius Temperature is out of normal range. ");
        }
        if (tempKelvin != null && (tempKelvin < 288.15 || tempKelvin > 303.15)) {
            error.append("Kelvin Temperature is out of normal range. ");
        }
        
        return error.toString();
    }

    public String generateAtmCode(String location) {
        if (location == null) return "ATM000";
        String cleanLocation = location.trim().toUpperCase();
        if (cleanLocation.isEmpty()) return "ATM000";
        
        int hash = Math.abs(location.hashCode() % 1000);
        return String.format("ATM%03d", hash);
    }

    public Temperature getTemperatureByAtmCode(String atmCode) {
        try {
            return temperatureRepository.findByAtmcode(atmCode);
        } catch (Exception e) {
            logger.error("Error retrieving temperature data for ATM {}: {}", atmCode, e.getMessage());
            throw new RuntimeException("Failed to retrieve temperature data", e);
        }
    }
}
