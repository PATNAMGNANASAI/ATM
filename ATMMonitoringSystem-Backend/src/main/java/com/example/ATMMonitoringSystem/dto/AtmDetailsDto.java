package com.example.ATMMonitoringSystem.dto;

import java.sql.Timestamp;

public class AtmDetailsDto {
    private String atmcode;
    private String location;
    private Float temperature;
    private Float tempKelvin;
    private Double totalAmount;
    private Integer cashCount100rs;
    private Integer cashCount200rs;
    private Integer cashCount500rs;
    private String tempStatus;
    private String tempMessage;
    private String cashStatus;
    private String cashMessage;
    private Timestamp tempTimestamp;
    private Timestamp cashTimestamp;

    // Constructor for easy conversion from Object[]
    public AtmDetailsDto(Object[] data) {
        this.atmcode = (String) data[0];
        this.location = (String) data[1];
        this.temperature = data[2] != null ? ((Number) data[2]).floatValue() : null;
        this.tempKelvin = data[3] != null ? ((Number) data[3]).floatValue() : null;
        this.totalAmount = data[4] != null ? ((Number) data[4]).doubleValue() : null;
        this.cashCount100rs = data[5] != null ? ((Number) data[5]).intValue() : null;
        this.cashCount200rs = data[6] != null ? ((Number) data[6]).intValue() : null;
        this.cashCount500rs = data[7] != null ? ((Number) data[7]).intValue() : null;
        this.tempStatus = (String) data[8];
        this.tempMessage = (String) data[9];
        this.cashStatus = (String) data[10];
        this.cashMessage = (String) data[11];
        this.tempTimestamp = (Timestamp) data[12];
        this.cashTimestamp = (Timestamp) data[13];
    }

    // Getters and setters
    public String getAtmcode() { return atmcode; }
    public void setAtmcode(String atmcode) { this.atmcode = atmcode; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Float getTemperature() { return temperature; }
    public void setTemperature(Float temperature) { this.temperature = temperature; }
    public Float getTempKelvin() { return tempKelvin; }
    public void setTempKelvin(Float tempKelvin) { this.tempKelvin = tempKelvin; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public Integer getCashCount100rs() { return cashCount100rs; }
    public void setCashCount100rs(Integer cashCount100rs) { this.cashCount100rs = cashCount100rs; }
    public Integer getCashCount200rs() { return cashCount200rs; }
    public void setCashCount200rs(Integer cashCount200rs) { this.cashCount200rs = cashCount200rs; }
    public Integer getCashCount500rs() { return cashCount500rs; }
    public void setCashCount500rs(Integer cashCount500rs) { this.cashCount500rs = cashCount500rs; }
    public String getTempStatus() { return tempStatus; }
    public void setTempStatus(String tempStatus) { this.tempStatus = tempStatus; }
    public String getTempMessage() { return tempMessage; }
    public void setTempMessage(String tempMessage) { this.tempMessage = tempMessage; }
    public String getCashStatus() { return cashStatus; }
    public void setCashStatus(String cashStatus) { this.cashStatus = cashStatus; }
    public String getCashMessage() { return cashMessage; }
    public void setCashMessage(String cashMessage) { this.cashMessage = cashMessage; }
    public Timestamp getTempTimestamp() { return tempTimestamp; }
    public void setTempTimestamp(Timestamp tempTimestamp) { this.tempTimestamp = tempTimestamp; }
    public Timestamp getCashTimestamp() { return cashTimestamp; }
    public void setCashTimestamp(Timestamp cashTimestamp) { this.cashTimestamp = cashTimestamp; }
}