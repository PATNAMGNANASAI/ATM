package com.example.ATMMonitoringSystem.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PreDestroy;
import com.example.ATMMonitoringSystem.model.Temperature;
import com.example.ATMMonitoringSystem.repository.TemperatureRepository;
import com.example.ATMMonitoringSystem.model.Cash;
import com.microsoft.azure.sdk.iot.device.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.text.SimpleDateFormat;
import java.util.TimeZone;
import java.util.Map;

@Service
public class IoTHubService {
    private static final Logger logger = LoggerFactory.getLogger(IoTHubService.class);
    

    @Autowired
    private TemperatureRepository repository;
    
    @Value("${azure.iot.hub.connection-string-cash}")
    private String connectionStringCash;
    
    @Value("${azure.iot.hub.connection-string-temp}")
    private String connectionStringTemp;
    private DeviceClient client;
    private final ObjectMapper objectMapper;
    private volatile boolean isInitialized = false;
    private static final int MAX_RETRIES = 3;

    public IoTHubService() {
        this.objectMapper = new ObjectMapper();
        // Configure date format
        objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"));
        objectMapper.setTimeZone(TimeZone.getTimeZone("UTC"));
    }

    private synchronized void initializeClient(String type) {
        String connectionString = type.equals("temperature") ? 
            connectionStringTemp : connectionStringCash;
            
        try {
            logger.info("Initializing IoT Hub client for {} device...", type);
            client = new DeviceClient(connectionString, IotHubClientProtocol.MQTT);
            client.setOperationTimeout(30);
            client.open(false);
            isInitialized = true;
            logger.info("IoT Hub client initialized successfully for {} device", type);
        } catch (Exception e) {
            logger.error("Failed to initialize IoT Hub client: {}", e.getMessage(), e);
            throw new RuntimeException("IoT Hub initialization failed: " + e.getMessage(), e);
        }
    }

    private void ensureClientConnected(String type) throws Exception {
        if (client == null || !isInitialized) {
            initializeClient(type);
        }
    }

    public void sendTemperatureMessage(Temperature data) throws Exception {
        logger.debug("Sending temperature data: atmcode={}, tempCelsius={}", 
            data.getAtmcode(), data.getTempCelsius());
            
        if (data.getTempCelsius() == null) {
            throw new IllegalArgumentException("Temperature in Celsius is required");
        }
        
        Message msg = createMessage(data, "temperature");
        sendMessage(msg, "temperature");
    }

    public int sendCashMessage(Cash data) throws Exception {
        try {
            logger.debug("Preparing to send cash message: {}", 
                objectMapper.writeValueAsString(data));
            Message msg = createMessage(data, "cash");
            return sendMessage(msg, "cash");
        } catch (Exception e) {
            logger.error("Error preparing cash message: {}", e.getMessage());
            throw e;
        }
    }

    @SuppressWarnings("unchecked")
    private Message createMessage(Object data, String messageType) throws Exception {
        try {
            Map<String, Object> dataMap = objectMapper.convertValue(data, Map.class);
            
            // Remove null values and unnecessary fields
            dataMap.remove("atmid");
            dataMap.remove("locationRef");
            
            // Add or update required fields
            dataMap.put("type", messageType);
            dataMap.put("timestamp", new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
                .format(new Date()));

            if ("temperature".equals(messageType)) {
                Float celsius = Float.valueOf(dataMap.get("tempCelsius").toString());
                dataMap.put("tempKelvin", celsius + 273.15f);
                dataMap.put("atmStatus", celsius > 35.0 ? "HIGH TEMPERATURE" : "NORMAL");
                dataMap.put("message", celsius > 35.0 ? "High temperature alert!" : "Temperature normal");
            }

            // Remove any remaining null values
            dataMap.values().removeIf(value -> value == null);

            String jsonMessage = objectMapper.writeValueAsString(dataMap);
            logger.debug("Prepared message: {}", jsonMessage);
            
            Message msg = new Message(jsonMessage.getBytes(StandardCharsets.UTF_8));
            msg.setContentType("application/json");
            msg.setContentEncoding("UTF-8");
            msg.setProperty("type",messageType);
            return msg;
        } catch (Exception e) {
            logger.error("Error creating message: {}", e.getMessage());
            throw e;
        }
    }

    int sendMessageWithRetry(Message msg, int retryCount,String type) throws Exception {
        try {
            ensureClientConnected(type);
            client.sendEvent(msg);
            logger.info("Message sent successfully");
            return 1;
        } catch (Exception e) {
            logger.error("Error sending message: {}", e.getMessage());
            if (retryCount < MAX_RETRIES) {
                logger.info("Retrying... Attempt {} of {}", retryCount + 1, MAX_RETRIES);
                Thread.sleep(1000 * (retryCount + 1)); // Exponential backoff
                sendMessageWithRetry(msg, retryCount + 1,type);
                return 1;
            } else {
                return 0;
            }
            
        }
    }

    int sendMessage(Message msg,String type) throws Exception {
        return sendMessageWithRetry(msg, 0, type);
    }

    @PreDestroy
    public void cleanup() {
        try {
            if (client != null && isInitialized) {
                client.close();
                isInitialized = false;
        logger.info("IoT Hub client closed successfully");
    }
} catch (Exception e) {
            logger.error("Error closing IoT Hub connection: {}", e.getMessage(), e);
        }
    }


    @Transactional(readOnly = true)
    public List<Temperature> getAllData() {
        try {
            return repository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving temperature data", e);
        }
    }
}