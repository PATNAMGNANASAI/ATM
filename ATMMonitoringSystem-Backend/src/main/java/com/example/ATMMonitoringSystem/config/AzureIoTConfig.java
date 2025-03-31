package com.example.ATMMonitoringSystem.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "azure.iot")
public class AzureIoTConfig {
    private String deviceId;
    private String connectionString;
    private Hub hub = new Hub();

    public static class Hub {
        private String connectionString;
        public String getConnectionString() { return connectionString; }
        public void setConnectionString(String connectionString) { this.connectionString = connectionString; }
    }

    // Getters and Setters
    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    public String getConnectionString() { return connectionString; }
    public void setConnectionString(String connectionString) { this.connectionString = connectionString; }
    public Hub getHub() { return hub; }
    public void setHub(Hub hub) { this.hub = hub; }
}
