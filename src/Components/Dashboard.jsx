import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

// SVG Icons to match AuthPage style
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="currentColor" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor" />
  </svg>
);

const LocationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor" />
  </svg>
);

const AtmIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 9V10.5H11V15H13V10.5H16V9H8Z" fill="#FFD700" />
    <path d="M18 3H6C4.9 3 4 3.9 4 5V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V5C20 3.9 19.1 3 18 3ZM18 19H6V5H18V19Z" fill="#FFD700" />
    <path d="M8 7H16V8H8V7Z" fill="#FFD700" />
    <path d="M8 16H16V17H8V16Z" fill="#FFD700" />
  </svg>
);

const TemperatureIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 13V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V13C7.79 14.07 7 15.71 7 17.5C7 20.54 9.46 23 12.5 23C15.54 23 18 20.54 18 17.5C18 15.71 17.21 14.07 16 13M13 7H11V5C11 4.45 11.45 4 12 4C12.55 4 13 4.45 13 5V7Z" fill="currentColor" />
  </svg>
);

const CashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.5 15H6.32C6.46 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.48 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.49 11.8 10.9Z" fill="currentColor" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor" />
  </svg>
);

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill="currentColor" />
  </svg>
);

function Dashboard() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showCommandDialog, setShowCommandDialog] = useState(false);
  const [location, setLocation] = useState("");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [expandedAtm, setExpandedAtm] = useState(null);
  const [atmData, setAtmData] = useState({
    allData: {},
    loading: true,
  });
  const [locations, setLocations] = useState([]);
  const [commandType, setCommandType] = useState('');
  const [commandData, setCommandData] = useState({
    atmcode: '',
    location: '',
    type: '',
    tempCelsius: '',
    cashCount100rs: '',
    cashCount200rs: '',
    cashCount500rs: '',
  });
  const [totalCashAmount, setTotalCashAmount] = useState(0);
  const [tempKelvin, setTempKelvin] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role) {
      navigate("/login");
      return;
    }
    setUserRole(role);
    document.body.style.overflow = "hidden"; 
    loadDashboardData();
    return () => {
      document.body.style.overflow = "";
    };
  }, [navigate]);

  useEffect(() => {
    if (commandType === 'cash') {
      const total = 
        (Number(commandData.cashCount100rs) || 0) * 100 +
        (Number(commandData.cashCount200rs) || 0) * 200 +
        (Number(commandData.cashCount500rs) || 0) * 500;
      setTotalCashAmount(total);
    }
  }, [commandData.cashCount100rs, commandData.cashCount200rs, commandData.cashCount500rs, commandType]);

  useEffect(() => {
    if (commandType === 'temperature') {
      const celsius = Number(commandData.tempCelsius) || 0;
      setTempKelvin(celsius + 273.15);
    }
  }, [commandData.tempCelsius, commandType]);

  const loadDashboardData = async () => {
    try {
      const locationData = await fetchLocations();
      if (!locationData) {
        setLocations(generateDummyLocations());
      }
      const atmDetailsData = await fetchAtmDetails();
      if (!atmDetailsData) {
        setAtmData({
          allData: generateDummyAtmData(),
          loading: false
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLocations(generateDummyLocations());
      setAtmData({
        allData: generateDummyAtmData(),
        loading: false
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setAtmData({ ...atmData, loading: true });
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const generateDummyLocations = () => {
    const dummyLocations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"];
    return dummyLocations.map(location => ({
      id: location.toLowerCase(),
      name: location
    }));
  };

  const generateDummyAtmData = () => {
    const locations = ["mumbai", "delhi", "bangalore", "chennai", "hyderabad"];
    const atmData = {};
    
    for (let i = 1; i <= 15; i++) {
      const atmId = `ATM${i.toString().padStart(3, '0')}`;
      const location = locations[Math.floor(Math.random() * locations.length)];
      const temperature = Math.floor(Math.random() * 15) + 20;
      const tempStatus = temperature > 30 ? "HIGH TEMPERATURE" : "NORMAL";
      const tempMessage = temperature > 30 ? "Temperature above threshold" : "Temperature within normal range";
      
      const cashCount100rs = Math.floor(Math.random() * 500) + 100;
      const cashCount200rs = Math.floor(Math.random() * 300) + 50;
      const cashCount500rs = Math.floor(Math.random() * 200) + 20;
      const totalAmount = (cashCount100rs * 100) + (cashCount200rs * 200) + (cashCount500rs * 500);
      const cashStatus = totalAmount < 100000 ? "LOW CASH" : "NORMAL";
      const cashMessage = totalAmount < 100000 ? "Cash below threshold" : "Cash level normal";
      
      const now = new Date();
      const tempTimestamp = new Date(now - Math.floor(Math.random() * 1000000));
      const cashTimestamp = new Date(now - Math.floor(Math.random() * 1000000));
      
      atmData[atmId] = {
        atmcode: atmId,
        location: location,
        currentStatus: {
          temperature: temperature,
          cash: totalAmount
        },
        tempLogs: [
          {
            timestamp: tempTimestamp.toLocaleString(),
            temp_celsius: temperature,
            temp_kelvin: temperature + 273.15,
            atm_status: tempStatus,
            message: tempMessage
          },
          {
            timestamp: new Date(tempTimestamp - 3600000).toLocaleString(),
            temp_celsius: temperature - 2,
            temp_kelvin: (temperature - 2) + 273.15,
            atm_status: "NORMAL",
            message: "Temperature within normal range"
          },
          {
            timestamp: new Date(tempTimestamp - 7200000).toLocaleString(),
            temp_celsius: temperature - 4,
            temp_kelvin: (temperature - 4) + 273.15,
            atm_status: "NORMAL",
            message: "Temperature within normal range"
          }
        ],
        cashLogs: [
          {
            timestamp: cashTimestamp.toLocaleString(),
            cash_count_100rs: cashCount100rs,
            cash_count_200rs: cashCount200rs,
            cash_count_500rs: cashCount500rs,
            total_amount: totalAmount,
            atm_status: cashStatus,
            message: cashMessage
          },
          {
            timestamp: new Date(cashTimestamp - 86400000).toLocaleString(),
            cash_count_100rs: cashCount100rs + 50,
            cash_count_200rs: cashCount200rs + 30,
            cash_count_500rs: cashCount500rs + 10,
            total_amount: totalAmount + (50*100 + 30*200 + 10*500),
            atm_status: "NORMAL",
            message: "Cash level normal"
          }
        ]
      };
    }
    
    return atmData;
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/locations');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // The API returns an array of location names as strings: ["Bangalore", "Chennai", etc.]
      const locationNames = await response.json();
      
      // Transform into the expected format with id and name properties
      const validLocations = locationNames.map(locationName => ({
        id: locationName.toLowerCase(),
        name: locationName
      }));
      
      setLocations(validLocations);
      return validLocations;
    } catch (error) {
      console.error('Error fetching locations:', error);
      return null;
    }
  };

  const fetchAtmDetails = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/locations/atm-details');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // The API returns an array of ATM objects
      const atmList = await response.json();
      
      // Transform into the expected object format with atmcode as keys
      const transformedData = atmList.reduce((acc, atm) => {
        const formatTimestamp = (timestamp) => {
          return timestamp ? new Date(timestamp).toLocaleString() : 'No data';
        };

        // Handle missing or empty data
        const temperature = atm.temperature || 0;
        const tempStatus = atm.tempStatus || 'NO DATA';
        const tempMessage = atm.tempMessage || 'No temperature data';
        const cashStatus = atm.cashStatus || 'NO DATA';
        const cashMessage = atm.cashMessage || 'No cash data';
        
        acc[atm.atmcode] = {
          atmcode: atm.atmcode,
          location: atm.location.toLowerCase(),
          currentStatus: {
            temperature: temperature,
            cash: atm.totalAmount || 0,
          },
          tempLogs: [
            {
              timestamp: formatTimestamp(atm.tempTimestamp),
              temp_celsius: temperature,
              temp_kelvin: atm.tempKelvin || temperature + 273.15,
              atm_status: tempStatus,
              message: tempMessage
            }
          ],
          cashLogs: [
            {
              timestamp: formatTimestamp(atm.cashTimestamp),
              cash_count_100rs: atm.cashCount100rs || 0,
              cash_count_200rs: atm.cashCount200rs || 0,
              cash_count_500rs: atm.cashCount500rs || 0,
              total_amount: atm.totalAmount || 0,
              atm_status: cashStatus,
              message: cashMessage
            }
          ]
        };
        return acc;
      }, {});

      setAtmData({
        allData: transformedData,
        loading: false
      });
      return transformedData;
    } catch (error) {
      console.error('Error fetching ATM details:', error);
      return null;
    }
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleResetPassword = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New password and Confirm password must match!");
      return;
    }
    alert("Password reset successfully!");
    setShowResetDialog(false);
  };

  const getTemperatureStatusClass = (temperature) => {
    if (temperature >= 45) return "status-danger"; // Red for critical high temp
    if (temperature >= 35) return "status-warning"; // Yellow for warning high temp
    if (temperature < 10) return "status-warning"; // Yellow for warning low temp
    if (temperature < 5) return "status-danger"; // Red for critical low temp
    return "status-normal"; // Green for normal temp
  };

  const getCashStatusClass = (cashAmount) => {
    if (cashAmount < 10000) return "status-danger"; // Red for very low cash
    if (cashAmount < 30000) return "status-warning"; // Yellow for low cash
    return "status-normal"; // Green for normal cash levels
  };

  const getStatusClass = (status) => {
    switch(status?.toUpperCase()) {
      case 'HIGH TEMPERATURE':
      case 'CRITICAL TEMPERATURE':
        return "status-danger";
      case 'WARNING TEMPERATURE':
        return "status-warning";
      case 'VERY LOW CASH':
        return "status-danger";
      case 'LOW CASH':
        return "status-warning";
      case 'NORMAL':
        return "status-normal";
      default:
        return "status-nodata";
    }
  };
  
  const getStatusText = (statusType, value) => {
    if (statusType === 'temperature') {
      if (value >= 45) return "CRITICAL";
      if (value >= 35) return "HIGH";
      if (value < 10) return "LOW";
      if (value < 5) return "CRITICAL";
      return "NORMAL";
    } else if (statusType === 'cash') {
      if (value < 10000) return "CRITICAL";
      if (value < 30000) return "LOW";
      return "NORMAL";
    }
    return "NO DATA";
  };

  const getTempClass = (temp) => {
    if (temp <= 0) return "temp-freezing";
    if (temp <= 15) return "temp-cold";
    if (temp <= 25) return "temp-normal";
    if (temp <= 35) return "temp-warm";
    return "temp-hot";
  };

  const getCommandBackground = () => {
    if (commandType === 'temperature') {
      const temp = Number(commandData.tempCelsius) || 25;
      if (temp <= 0) return 'linear-gradient(to right bottom, #e0f7fa, #b2ebf2)';
      if (temp <= 15) return 'linear-gradient(to right bottom, #e3f2fd, #bbdefb)';
      if (temp <= 25) return 'linear-gradient(to right bottom, #e8f5e9, #c8e6c9)';
      if (temp <= 35) return 'linear-gradient(to right bottom, #fff3e0, #ffe0b2)';
      return 'linear-gradient(to right bottom, #ffebee, #ffcdd2)';
    }
    return 'linear-gradient(to right bottom, #fff8e1, #ffecb3)';
  };

  const getFormattedCash = (amount) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const getCashVisualHeight = (count, max = 70) => {
    const height = Math.max(15, Math.min(70, count));
    return `${height}px`;
  };

  const getCashStatusColor = (amount) => {
    if (amount < 10000) return "#ef5350"; // critically low
    if (amount < 30000) return "#ffb74d"; // low
    if (amount < 100000) return "#66bb6a"; // normal
    return "#FFD700"; // high (gold color for higher amounts)
  };

  const handleSendCommand = async () => {
    if (commandType === 'temperature') {
      if (!commandData.tempCelsius) {
        alert("Please enter a temperature value");
        return;
      }
    } else if (commandType === 'cash') {
      if (!commandData.cashCount100rs && !commandData.cashCount200rs && !commandData.cashCount500rs) {
        alert("Please enter at least one cash value");
        return;
      }
    } else {
      alert("Please select a command type");
      return;
    }

    setIsSubmitting(true);
    
    const endpoint = commandType === 'temperature' 
      ? 'http://localhost:8081/api/iot/temperature/send'
      : 'http://localhost:8081/api/iot/cash/send';

    const payload = commandType === 'temperature' 
      ? {
          atmcode: commandData.atmcode,
          type: "temperature",
          location: commandData.location,
          tempCelsius: Number(commandData.tempCelsius)
        }
      : {
          type: "cash",
          cashCount100rs: Number(commandData.cashCount100rs) || 0,
          cashCount200rs: Number(commandData.cashCount200rs) || 0,
          cashCount500rs: Number(commandData.cashCount500rs) || 0,
          atmcode: commandData.atmcode,
          location: commandData.location
        };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Command sent successfully!');
        closeCommandDialog();
        loadDashboardData();
      } else {
        alert('Failed to send command. Using dummy response.');
        closeCommandDialog();
        setAtmData({
          allData: generateDummyAtmData(),
          loading: false
        });
      }
    } catch (error) {
      console.error('Error sending command:', error);
      alert('Error sending command. Using dummy response.');
      closeCommandDialog();
      setAtmData({
        allData: generateDummyAtmData(),
        loading: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeCommandDialog = () => {
    setShowCommandDialog(false);
    setCommandType('');
    setCommandData({
      atmcode: '',
      location: '',
      type: '',
      tempCelsius: '',
      cashCount100rs: '',
      cashCount200rs: '',
      cashCount500rs: '',
    });
    setTotalCashAmount(0);
    setTempKelvin(0);
  };

  const filteredAtms = Object.entries(atmData.allData)
    .filter(([_, data]) => !location || data.location === location)
    .filter(([_, data]) => !showActiveOnly || (data.currentStatus.temperature > 0 && data.currentStatus.cash > 0));

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-branding">
          <AtmIcon />
          <h1 className="header-title">
            {userRole === "admin" ? "Admin Dashboard" : "Technician Dashboard"}
          </h1>
        </div>
        <div className="button-container">
          <button 
            className="dashboard-btn reset-btn" 
            onClick={() => setShowResetDialog(true)}
          >
            <LockIcon />
            Reset Password
          </button>
          <button 
            className="dashboard-btn logout-btn" 
            onClick={() => {
              localStorage.removeItem("userRole");
              navigate('/login');
            }}
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-controls">
          <div className="select-wrapper location-filter">
            <LocationIcon />
            <select 
              className="location-select"
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Filter by location"
            >
              <option value="" className="location-option">All Locations</option>
              {locations.map((loc) => (
                <option 
                  key={loc.id} 
                  value={loc.name.toLowerCase()}
                  className="location-option"
                >
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-active">
            <label className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={() => setShowActiveOnly(!showActiveOnly)}
                className="filter-checkbox"
              />
              <FilterIcon />
              <span>Active ATMs Only</span>
            </label>
          </div>

          <button 
            className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Refresh data"
          >
            <RefreshIcon />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="atm-list">
          {atmData.loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading ATM data...</p>
            </div>
          ) : filteredAtms.length > 0 ? (
            filteredAtms.map(([atmCode, data]) => (
              <div 
                key={atmCode}
                className={`atm-card ${expandedAtm === atmCode ? 'expanded-card' : ''}`}
                onClick={() => setExpandedAtm(expandedAtm === atmCode ? null : atmCode)}
              >
                <div className="atm-header">
                  <h3 className="atm-title">
                    {atmCode} - {data.location.charAt(0).toUpperCase() + data.location.slice(1)}
                  </h3>
                  <div className="status-container">
                    <span className={`status-badge ${getTemperatureStatusClass(data.currentStatus.temperature)}`}>
                      {data.currentStatus.temperature}°C
                      <span className="status-text">
                        {getStatusText('temperature', data.currentStatus.temperature)}
                      </span>
                    </span>
                    <span className={`status-badge ${getCashStatusClass(data.currentStatus.cash)}`}>
                      ₹{data.currentStatus.cash.toLocaleString()}
                      <span className="status-text">
                        {getStatusText('cash', data.currentStatus.cash)}
                      </span>
                    </span>
                    
                    {userRole === "tech" && (
                      <button 
                        className="dashboard-btn command-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCommandData({ ...commandData, atmcode: atmCode, location: data.location });
                          setShowCommandDialog(true);
                        }}
                      >
                        Send Commands
                      </button>
                    )}
                  </div>
                </div>

                {expandedAtm === atmCode && (
                  <div className="logs-section">
                    <h4 className="logs-heading">Temperature Logs</h4>
                    <div className="table-wrapper">
                      <table className="logs-table">
                        <thead>
                          <tr>
                            <th>Time</th>
                            <th>Temperature (°C)</th>
                            <th>Status</th>
                            <th>Message</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.tempLogs.map((log, index) => (
                            <tr key={index} className={getTemperatureStatusClass(log.temp_celsius)}>
                              <td>{log.timestamp}</td>
                              <td>{log.temp_celsius}°C</td>
                              <td>{getStatusText('temperature', log.temp_celsius)}</td>
                              <td>{log.message}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <h4 className="logs-heading">Cash Logs</h4>
                    <div className="table-wrapper">
                      <table className="logs-table">
                        <thead>
                          <tr>
                            <th>Time</th>
                            <th>₹100</th>
                            <th>₹200</th>
                            <th>₹500</th>
                            <th>Total</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.cashLogs.map((log, index) => (
                            <tr key={index} className={getCashStatusClass(log.total_amount)}>
                              <td>{log.timestamp}</td>
                              <td>{log.cash_count_100rs}</td>
                              <td>{log.cash_count_200rs}</td>
                              <td>{log.cash_count_500rs}</td>
                              <td>₹{log.total_amount.toLocaleString()}</td>
                              <td>{getStatusText('cash', log.total_amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <LocationIcon />
              </div>
              <p>No ATMs found for the selected location</p>
            </div>
          )}
        </div>
      </div>

      {showResetDialog && (
        <div className="overlay">
          <div className="dialog reset-password-dialog">
            <h2 className="dialog-title">Reset Password</h2>
            <form className="reset-password-form">
              <div className="input-group password-input-group">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="input-wrapper">
                  <LockIcon />
                  <input
                    id="currentPassword"
                    type="password"
                    name="currentPassword"
                    placeholder="Enter current password"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="input-group password-input-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="input-wrapper">
                  <LockIcon />
                  <input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="input-group password-input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <LockIcon />
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    className="auth-input"
                  />
                </div>
              </div>
            </form>

            <div className="dialog-buttons">
              <button 
                className="dialog-btn cancel-btn" 
                onClick={() => setShowResetDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="dialog-btn submit-btn" 
                onClick={handleResetPassword}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}

      {userRole === "tech" && showCommandDialog && (
        <div className="overlay">
          <div className="dialog simplified-command-dialog">
            <div className="dialog-header">
              <h2 className="dialog-title">Send Command</h2>
              <button 
                className="close-btn" 
                onClick={closeCommandDialog}
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>
            
            <div className="dialog-content">
              <div className="atm-info">
                <span className="atm-id">{commandData.atmcode}</span>
                <span className="location-name">{commandData.location.charAt(0).toUpperCase() + commandData.location.slice(1)}</span>
              </div>
              
              <div className="command-selector">
                <div className="radio-group simplified">
                  <label className={`radio-button ${commandType === 'temperature' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="commandType"
                      value="temperature"
                      onChange={(e) => setCommandType(e.target.value)}
                      checked={commandType === 'temperature'}
                    />
                    <TemperatureIcon /> Temperature
                  </label>
                  
                  <label className={`radio-button ${commandType === 'cash' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="commandType"
                      value="cash"
                      onChange={(e) => setCommandType(e.target.value)}
                      checked={commandType === 'cash'}
                    />
                    <CashIcon /> Cash
                  </label>
                </div>
              </div>
              
              {commandType === 'temperature' && (
                <div className="command-input-section">
                  <label htmlFor="tempCelsius">Set Temperature (°C):</label>
                  <div className="input-container">
                    <input
                      id="tempCelsius"
                      type="number"
                      min="-10"
                      max="50"
                      step="1"
                      placeholder="Enter temperature"
                      value={commandData.tempCelsius}
                      onChange={(e) => setCommandData({...commandData, tempCelsius: e.target.value})}
                      className="command-input"
                    />
                    <span className="unit">°C</span>
                  </div>
                  
                  {commandData.tempCelsius && (
                    <div className="conversion-info">
                      {commandData.tempCelsius}°C = {tempKelvin.toFixed(2)}K
                    </div>
                  )}
                </div>
              )}
              
              {commandType === 'cash' && (
                <div className="command-input-section">
                  <div className="note-input">
                    <label htmlFor="cash100">₹100 Notes:</label>
                    <input
                      id="cash100"
                      type="number"
                      min="0"
                      placeholder="Qty"
                      value={commandData.cashCount100rs}
                      onChange={(e) => setCommandData({...commandData, cashCount100rs: e.target.value})}
                      className="command-input"
                    />
                  </div>
                  
                  <div className="note-input">
                    <label htmlFor="cash200">₹200 Notes:</label>
                    <input
                      id="cash200"
                      type="number"
                      min="0"
                      placeholder="Qty"
                      value={commandData.cashCount200rs}
                      onChange={(e) => setCommandData({...commandData, cashCount200rs: e.target.value})}
                      className="command-input"
                    />
                  </div>
                  
                  <div className="note-input">
                    <label htmlFor="cash500">₹500 Notes:</label>
                    <input
                      id="cash500"
                      type="number"
                      min="0"
                      placeholder="Qty"
                      value={commandData.cashCount500rs}
                      onChange={(e) => setCommandData({...commandData, cashCount500rs: e.target.value})}
                      className="command-input"
                    />
                  </div>
                  
                  {totalCashAmount > 0 && (
                    <div className="total-cash">
                      Total: {getFormattedCash(totalCashAmount)}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="dialog-buttons">
              <button 
                className="dialog-btn cancel-btn" 
                onClick={closeCommandDialog}
              >
                Cancel
              </button>
              <button 
                className="dialog-btn submit-btn" 
                onClick={handleSendCommand}
                disabled={isSubmitting || !commandType || 
                  (commandType === 'temperature' && !commandData.tempCelsius) || 
                  (commandType === 'cash' && totalCashAmount === 0)
                }
              >
                {isSubmitting ? "Sending..." : "Send Command"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
