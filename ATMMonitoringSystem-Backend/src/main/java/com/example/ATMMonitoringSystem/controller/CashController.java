package com.example.ATMMonitoringSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.ATMMonitoringSystem.model.Cash;
import com.example.ATMMonitoringSystem.service.CashService;

@RestController
@RequestMapping("/api/cash")
public class CashController {

    @Autowired
    private CashService cashService;

    @PostMapping
    public ResponseEntity<Cash> createCash(@RequestBody Cash cash) {
        Cash savedCash = cashService.saveCash(cash);
        return ResponseEntity.ok(savedCash);
    }

    @GetMapping("/{atmcode}")
    public ResponseEntity<Cash> getCash(@PathVariable String atmcode) {
        Cash cash = cashService.getCashByAtmCode(atmcode);
        if (cash != null) {
            return ResponseEntity.ok(cash);
        }
        return ResponseEntity.notFound().build();
    }
}
