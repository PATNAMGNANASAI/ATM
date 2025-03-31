package com.example.ATMMonitoringSystem.model;

import java.io.Serializable;
import java.util.Objects;

public class LocationId implements Serializable {
    private String atmcode;
    private String location;

    public LocationId() {}

    public LocationId(String atmcode, String location) {
        this.atmcode = atmcode;
        this.location = location;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LocationId that = (LocationId) o;
        return Objects.equals(atmcode, that.atmcode) && 
               Objects.equals(location, that.location);
    }

    @Override
    public int hashCode() {
        return Objects.hash(atmcode, location);
    }
}
