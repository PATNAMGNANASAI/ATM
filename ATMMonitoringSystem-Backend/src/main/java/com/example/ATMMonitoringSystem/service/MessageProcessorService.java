package com.example.ATMMonitoringSystem.service;

import com.azure.messaging.servicebus.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.annotation.*;
import com.example.ATMMonitoringSystem.model.Cash;
import com.example.ATMMonitoringSystem.model.Temperature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
@Service
public class MessageProcessorService {
    private static final Logger logger = LoggerFactory.getLogger(MessageProcessorService.class);

    @Value("${azure.servicebus.connection-string}")
    private String connectionString;

    @Value("${azure.servicebus.topic-name}")
    private String topicName;

    @Value("${azure.servicebus.subscription-name}")
    private String subscriptionName;

    @Autowired
    private CashService cashService;

    @Autowired
    private TemperatureService temperatureService;

    public MessageProcessorService() {
    }

    private ServiceBusProcessorClient processorClient;

    @PostConstruct
    public void startProcessing() {
        try {
            logger.info("Starting Service Bus processor...");
            ServiceBusClientBuilder builder = new ServiceBusClientBuilder()
                .connectionString(connectionString);

            processorClient = builder
                .processor()
                .topicName(topicName)
                .subscriptionName(subscriptionName)
                .processMessage(this::processMessage)
                .processError(context -> {
                    logger.error("Error occurred in processor: ", context.getException());
                })
                .buildProcessorClient();

            processorClient.start();
            logger.info("Service Bus processor started successfully");
        } catch (Exception e) {
            logger.error("Failed to start Service Bus processor: ", e);
            throw new RuntimeException("Failed to start message processor", e);
        }
    }

    private void processMessage(ServiceBusReceivedMessageContext context) {
        try {
            String messageBody = context.getMessage().getBody().toString();
            logger.debug("Received Service Bus message: {}", messageBody);
            
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(messageBody);
            
            if (jsonNode.has("type") && "cash".equals(jsonNode.get("type").asText())) {
                processCashMessage(mapper, messageBody, context);
            } else if (jsonNode.has("type") && "temperature".equals(jsonNode.get("type").asText())) {
                processTemperatureMessage(mapper, messageBody, context);
            } else {
                logger.warn("Unknown message type: {}", messageBody);
                context.abandon();
            }
        } catch (Exception e) {
            logger.error("Error processing message: {} - {}", e.getClass().getName(), e.getMessage());
            context.abandon();
        }
    }

    private void processCashMessage(ObjectMapper mapper, String messageBody, ServiceBusReceivedMessageContext context) throws Exception {
        Cash cash = mapper.readValue(messageBody, Cash.class);
        logger.debug("Processing cash message for ATM: {}, Content: {}", 
            cash.getAtmcode(), mapper.writeValueAsString(cash));
            
        if (cash.getAtmcode() == null && cash.getLocation() != null) {
            cash.setAtmcode(generateAtmCode(cash.getLocation()));
        }
        if (cash.getTimestamp() == null) {
            cash.setTimestamp(new Date());
        }
        cashService.saveCash(cash);
        context.complete();
        logger.info("Successfully processed cash data for ATM: {}", cash.getAtmcode());
    }

    private void processTemperatureMessage(ObjectMapper mapper, String messageBody, ServiceBusReceivedMessageContext context) throws Exception {
        Temperature temp = mapper.readValue(messageBody, Temperature.class);
        if (temp.getAtmcode() == null && temp.getLocation() != null) {
            temp.setAtmcode(generateAtmCode(temp.getLocation()));
        }
        if (temp.getTimestamp() == null) {
            temp.setTimestamp(new Date());
        }
        temperatureService.saveTemperature(temp);
        context.complete();
        logger.info("Processed temperature data for ATM: {}", temp.getAtmcode());
    }

    private String generateAtmCode(String location) {
        // Generate ATM code in format ATMxxx where xxx is a number
        int hash = Math.abs(location.hashCode() % 1000);
        return String.format("ATM%03d", hash);
    }

    @PreDestroy
    public void cleanup() {
        if (processorClient != null) {
            processorClient.close();
            logger.info("Service Bus processor closed");
        }
    }
}
