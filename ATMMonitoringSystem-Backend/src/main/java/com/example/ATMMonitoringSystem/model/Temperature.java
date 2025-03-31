package com.example.ATMMonitoringSystem.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "temp")
public class Temperature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "atmid")
    private Integer atmid;

    @Column(name = "timestamp")
    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;

    @Column(name = "temp_celsius")
    private Float tempCelsius;

    @Column(name = "temp_kelvin")
    private Float tempKelvin;

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
       // @JoinColumn(name = "location", referencedColumnName = "location", insertable = false, updatable = false)
    })
    private Location locationRef;

    // Default constructor
    public Temperature() {}

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

    public Float getTempCelsius() {
        return tempCelsius;
    }

    public void setTempCelsius(Float tempCelsius) {
        this.tempCelsius = tempCelsius;
    }

    public Float getTempKelvin() {
        return tempKelvin;
    }

    public void setTempKelvin(Float tempKelvin) {
        this.tempKelvin = tempKelvin;
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

    public Location getLocationRef() {
        return locationRef;
    }

    public void setLocationRef(Location locationRef) {
        this.locationRef = locationRef;
    }

    public void calculateKelvin() {
        if (this.tempCelsius != null) {
            this.tempKelvin = this.tempCelsius + 273.15f;
        }
    }
}