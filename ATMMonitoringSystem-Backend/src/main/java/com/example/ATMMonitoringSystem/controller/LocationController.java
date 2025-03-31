package com.example.ATMMonitoringSystem.controller;

import com.example.ATMMonitoringSystem.service.LocationService;
import com.example.ATMMonitoringSystem.service.AtmService;
import com.example.ATMMonitoringSystem.dto.AtmDetailsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {
    @Autowired
    private LocationService locationService;

    @Autowired
    private AtmService atmService;

    @GetMapping
    public List<String> getDistinctLocations() {
        return locationService.getDistinctLocations();
    }

    @GetMapping("/atm-details")
    public List<AtmDetailsDto> getAtmDetails() {
        return atmService.getAllAtmDetails();
    }
}