package com.example.ATMMonitoringSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.ATMMonitoringSystem.model.Temperature;
import com.example.ATMMonitoringSystem.service.TemperatureService;

@RestController
@RequestMapping("/api/temperature")
public class TemperatureController {

    @Autowired
    private TemperatureService temperatureService;

    @PostMapping
    public ResponseEntity<Temperature> createTemperature(@RequestBody Temperature temperature) {
        if (temperature.getTempCelsius() == null) {
            return ResponseEntity.badRequest().build();
        }
        Temperature savedTemp = temperatureService.saveTemperature(temperature);
        return ResponseEntity.ok(savedTemp);
    }
    
    @GetMapping("/{atmcode}")
    public ResponseEntity<Temperature> getTemperature(@PathVariable String atmcode) {
        Temperature temp = temperatureService.getTemperatureByAtmCode(atmcode);
        if (temp != null) {
            return ResponseEntity.ok(temp);
        }
        return ResponseEntity.notFound().build();
    }
}
