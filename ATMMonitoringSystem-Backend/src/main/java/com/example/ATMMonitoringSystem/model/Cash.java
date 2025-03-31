package com.example.ATMMonitoringSystem.model;

import jakarta.persistence.*;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "cash")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Cash {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "atmid")
    private Integer atmid;

    @Column(name = "timestamp")
    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;

    @Column(name = "cash_count_100rs")
    private Integer cashCount100rs;

    @Column(name = "cash_count_200rs")
    private Integer cashCount200rs;

    @Column(name = "cash_count_500rs")
    private Integer cashCount500rs;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "atm_status")
    private String atmStatus;

    @Column(name = "message")
    private String message;

    @Column(name = "atmcode")
    private String atmcode;

    @Column(name = "location")
    private String location;

    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "atmcode", referencedColumnName = "atmcode", insertable = false, updatable = false),
        @JoinColumn(name = "location", referencedColumnName = "location", insertable = false, updatable = false)
    })
    private Location locationRef;

    // Default constructor
    public Cash() {}

    // Getters and Setters
    public Integer getAtmid() {
        return atmid;
    }

    public void setAtmid(Integer atmid) {
        this.atmid = atmid;
    }

    public String getAtmcode() {
        return atmcode;
    }

    public void setAtmcode(String atmcode) {
        this.atmcode = atmcode;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public Integer getCashCount100rs() {
        return cashCount100rs;
    }

    public void setCashCount100rs(Integer cashCount100rs) {
        this.cashCount100rs = cashCount100rs;
    }

    public Integer getCashCount200rs() {
        return cashCount200rs;
    }

    public void setCashCount200rs(Integer cashCount200rs) {
        this.cashCount200rs = cashCount200rs;
    }

    public Integer getCashCount500rs() {
        return cashCount500rs;
    }

    public void setCashCount500rs(Integer cashCount500rs) {
        this.cashCount500rs = cashCount500rs;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getAtmStatus() {
        return atmStatus;
    }

    public void setAtmStatus(String atmStatus) {
        this.atmStatus = atmStatus;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void calculateTotalAmount() {
        this.totalAmount = (this.cashCount100rs * 100.0) + 
                          (this.cashCount200rs * 200.0) + 
                          (this.cashCount500rs * 500.0);
    }

    @Override
    public String toString() {
        return "Cash{" +
                "atmid=" + atmid +
                ", atmcode='" + atmcode + '\'' +
                ", location='" + location + '\'' +
                ", timestamp=" + timestamp +
                ", cashCount100rs=" + cashCount100rs +
                ", cashCount200rs=" + cashCount200rs +
                ", cashCount500rs=" + cashCount500rs +
                ", totalAmount=" + totalAmount +
                ", atmStatus='" + atmStatus + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}