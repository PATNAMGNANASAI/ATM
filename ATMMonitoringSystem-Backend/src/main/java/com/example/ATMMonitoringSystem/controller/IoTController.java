package com.example.ATMMonitoringSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.ATMMonitoringSystem.model.Temperature;
import com.example.ATMMonitoringSystem.model.Cash;
import com.example.ATMMonitoringSystem.service.IoTHubService;
// import com.microsoft.azure.sdk.iot.device.exceptions.IotHubClientException;
// import java.util.List;

@RestController
@RequestMapping("/api/iot")
public class IoTController {
    @Autowired
    private IoTHubService ioTHubService;

    @PostMapping("/temperature/send")
    public ResponseEntity<?> sendTemperatureData(@RequestBody Temperature data) {
        try {
            ioTHubService.sendTemperatureMessage(data);
            return ResponseEntity.ok("Temperature data sent successfully for ATM ID: " + data.getAtmcode());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to send temperature data: " + e.getMessage());
        }
    }

    @PostMapping("/cash/send")
    public ResponseEntity<?> sendCashData(@RequestBody Cash data) {
        try {
            data.calculateTotalAmount(); // Calculate total before sending
            ioTHubService.sendCashMessage(data);
            return ResponseEntity.ok("Cash data sent successfully for ATM ID: " + data.getAtmcode());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to send cash data: " + e.getMessage());
        }
    }
}