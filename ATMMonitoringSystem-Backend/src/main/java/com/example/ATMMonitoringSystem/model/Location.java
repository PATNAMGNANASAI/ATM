package com.example.ATMMonitoringSystem.model;

import jakarta.persistence.*;

@Entity
@Table(name = "location")
@IdClass(LocationId.class)
public class Location {
    @Id
    @Column(name = "atmcode")
    private String atmcode;

    @Id
    @Column(name = "location")
    private String location;

    // Constructors
    public Location() {}

    // Getters and Setters
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
}
