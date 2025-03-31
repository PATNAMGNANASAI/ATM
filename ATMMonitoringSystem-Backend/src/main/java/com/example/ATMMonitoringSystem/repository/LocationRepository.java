package com.example.ATMMonitoringSystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.example.ATMMonitoringSystem.model.Location;
import com.example.ATMMonitoringSystem.model.LocationId;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, LocationId> {

    @Query("SELECT DISTINCT l.location FROM Location l ORDER BY l.location")
    List<String> findDistinctLocations();

    @Query(value = 
        "WITH LatestTemp AS ( " +
        "    SELECT t.atmcode, t.temp_celsius, t.temp_kelvin, t.atm_status as temp_status, t.message as temp_message, t.timestamp as temp_timestamp " +
        "    FROM temp t " +
        "    INNER JOIN ( " +
        "        SELECT atmcode, MAX(timestamp) as max_timestamp " +
        "        FROM temp " +
        "        GROUP BY atmcode " +
        "    ) tm ON t.atmcode = tm.atmcode AND t.timestamp = tm.max_timestamp " +
        "), " +
        "LatestCash AS ( " +
        "    SELECT c.atmcode, c.total_amount, c.cash_count_100rs, c.cash_count_200rs, c.cash_count_500rs, c.atm_status as cash_status, c.message as cash_message, c.timestamp as cash_timestamp " +
        "    FROM cash c " +
        "    INNER JOIN ( " +
        "        SELECT atmcode, MAX(timestamp) as max_timestamp " +
        "        FROM cash " +
        "        GROUP BY atmcode " +
        "    ) cm ON c.atmcode = cm.atmcode AND c.timestamp = cm.max_timestamp " +
        ") " +
        "SELECT l.atmcode, l.location, " +
        "COALESCE(t.temp_celsius, 0) as temperature, " +
        "COALESCE(t.temp_kelvin, 0) as temp_kelvin, " +
        "COALESCE(c.total_amount, 0) as total_amount, " +
        "COALESCE(c.cash_count_100rs, 0) as cash_count_100rs, " +
        "COALESCE(c.cash_count_200rs, 0) as cash_count_200rs, " +
        "COALESCE(c.cash_count_500rs, 0) as cash_count_500rs, " +
        "COALESCE(t.temp_status, '') as temp_status, " +
        "COALESCE(t.temp_message, '') as temp_message, " +
        "COALESCE(c.cash_status, '') as cash_status, " +
        "COALESCE(c.cash_message, '') as cash_message, " +
        "t.temp_timestamp as temp_timestamp, " +
        "c.cash_timestamp as cash_timestamp " +
        "FROM location l " +
        "LEFT JOIN LatestTemp t ON l.atmcode = t.atmcode " +
        "LEFT JOIN LatestCash c ON l.atmcode = c.atmcode", 
        nativeQuery = true)
    List<Object[]> findAtmDetails();
}

