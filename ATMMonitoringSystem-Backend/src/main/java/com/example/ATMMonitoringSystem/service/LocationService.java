package com.example.ATMMonitoringSystem.service;

//import com.example.ATMMonitoringSystem.model.Location;
import com.example.ATMMonitoringSystem.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {
    @Autowired
    private LocationRepository locationRepository;

    public List<String> getDistinctLocations() {
        return locationRepository.findDistinctLocations();
    }
}
