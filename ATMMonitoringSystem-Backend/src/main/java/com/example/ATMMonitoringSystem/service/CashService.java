package com.example.ATMMonitoringSystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.ATMMonitoringSystem.model.Cash;
import com.example.ATMMonitoringSystem.repository.CashRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;

@Service
public class CashService {
    private static final Logger logger = LoggerFactory.getLogger(CashService.class);
    private static final double LOW_CASH_THRESHOLD = 100000.0;
    private static final double CRITICAL_CASH_THRESHOLD = 50000.0;

    @Autowired
    private CashRepo cashRepository;

    public String checkCashErrors(Cash cash) {
        StringBuilder error = new StringBuilder();
        
        if (cash.getTotalAmount() < CRITICAL_CASH_THRESHOLD) {
            error.append("CRITICAL: Cash level extremely low! ");
        } else if (cash.getTotalAmount() < LOW_CASH_THRESHOLD) {
            error.append("WARNING: Cash level below threshold! ");
        }
        
        if (cash.getCashCount100rs() < 100) {
            error.append("Low on ₹100 notes. ");
        }
        if (cash.getCashCount200rs() < 100) {
            error.append("Low on ₹200 notes. ");
        }
        if (cash.getCashCount500rs() < 100) {
            error.append("Low on ₹500 notes. ");
        }
        
        return error.toString();
    }

    @Transactional
    public Cash saveCash(Cash cash) {
        try {
            cash.setTimestamp(new Date());
            cash.calculateTotalAmount();
            
            String message = checkCashErrors(cash);
            if (!message.isEmpty()) {
                cash.setAtmStatus("LOW CASH");
                logger.warn("ATM {}: {}", cash.getAtmcode(), message);
            } else {
                cash.setAtmStatus("NORMAL");
                message = "Cash levels normal";
                logger.info("ATM {}: {}", cash.getAtmcode(), message);
            }
            
            cash.setMessage(message);
            Cash savedCash = cashRepository.save(cash);
            logger.info("Cash data saved for ATM: {} with status: {}", 
                       cash.getAtmcode(), savedCash.getAtmStatus());
            
            return savedCash;
        } catch (Exception e) {
            logger.error("Error saving cash data: {}", e.getMessage());
            throw new RuntimeException("Failed to save cash data", e);
        }
    }
    

    public Cash getCashByAtmCode(String atmcode) {
        try {
            return cashRepository.findByAtmcode(atmcode);
        } catch (Exception e) {
            logger.error("Error retrieving cash data for ATM {}: {}", atmcode, e.getMessage());
            throw new RuntimeException("Failed to retrieve cash data", e);
        }
    }
}
