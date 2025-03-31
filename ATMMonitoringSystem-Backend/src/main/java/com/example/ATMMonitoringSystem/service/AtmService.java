package com.example.ATMMonitoringSystem.service;

import com.example.ATMMonitoringSystem.dto.AtmDetailsDto;
import com.example.ATMMonitoringSystem.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AtmService {
    @Autowired
    private LocationRepository locationRepository;

    public List<AtmDetailsDto> getAllAtmDetails() {
        return locationRepository.findAtmDetails()
                .stream()
                .map(AtmDetailsDto::new)
                .collect(Collectors.toList());
    }
}
