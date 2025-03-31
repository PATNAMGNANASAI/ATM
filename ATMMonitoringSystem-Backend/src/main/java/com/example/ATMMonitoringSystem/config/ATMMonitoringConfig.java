package com.example.ATMMonitoringSystem.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "atm.monitoring")
public class ATMMonitoringConfig {
    private Cash cash = new Cash();
    private Temperature temperature = new Temperature();

    public static class Cash {
        private double minimumThreshold;
        public double getMinimumThreshold() { return minimumThreshold; }
        public void setMinimumThreshold(double minimumThreshold) { this.minimumThreshold = minimumThreshold; }
    }

    public static class Temperature {
        private double maximumThreshold;
        public double getMaximumThreshold() { return maximumThreshold; }
        public void setMaximumThreshold(double maximumThreshold) { this.maximumThreshold = maximumThreshold; }
    }

    // Getters
    public Cash getCash() { return cash; }
    public Temperature getTemperature() { return temperature; }
}
