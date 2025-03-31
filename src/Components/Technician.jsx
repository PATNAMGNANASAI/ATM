import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Technician() {
  const navigate = useNavigate();
  const [showResetDialog, setShowResetDialog] = useState(false);
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
  const [showCommandDialog, setShowCommandDialog] = useState(false);
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

  useEffect(() => {
    fetchLocations();
    fetchAtmDetails();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/locations');
      const data = await response.json();
      const validLocations = data.map(locationName => ({
        id: locationName,
        name: locationName
      }));
      setLocations(validLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
    }
  };

  const fetchAtmDetails = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/locations/atm-details');
      const data = await response.json();
      
      const transformedData = data.reduce((acc, atm) => {
        const formatTimestamp = (timestamp) => {
          return timestamp ? new Date(timestamp).toLocaleString() : 'No data';
        };

        acc[atm.atmcode] = {
          atmcode: atm.atmcode,
          location: atm.location.toLowerCase(),
          currentStatus: {
            temperature: atm.temperature,
            cash: atm.totalAmount,
          },
          tempLogs: [
            {
              timestamp: formatTimestamp(atm.tempTimestamp),
              temp_celsius: atm.temperature,
              temp_kelvin: atm.tempKelvin,
              atm_status: atm.tempStatus || 'NO DATA',
              message: atm.tempMessage || 'No temperature data'
            }
          ],
          cashLogs: [
            {
              timestamp: formatTimestamp(atm.cashTimestamp),
              cash_count_100rs: atm.cashCount100rs,
              cash_count_200rs: atm.cashCount200rs,
              cash_count_500rs: atm.cashCount500rs,
              total_amount: atm.totalAmount,
              atm_status: atm.cashStatus || 'NO DATA',
              message: atm.cashMessage || 'No cash data'
            }
          ]
        };
        return acc;
      }, {});

      setAtmData({
        allData: transformedData,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching ATM details:', error);
      setAtmData(prev => ({ ...prev, loading: false }));
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

  const handleSendCommand = async () => {
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
          atmcode: commandData.atmcode,
          location: commandData.location,
          cashCount100rs: Number(commandData.cashCount100rs),
          cashCount200rs: Number(commandData.cashCount200rs),
          cashCount500rs: Number(commandData.cashCount500rs)
        };
        console.log(payload);
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
      } else {
        alert('Failed to send command');
      }
    } catch (error) {
      alert('Error sending command: ' + error.message);
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      width: "100vw",
      height: "100vh",
      background: "linear-gradient(to top right, #0f2027, #203a43, #2c5364)",
      fontFamily: "'Poppins', sans-serif",
      overflow: "hidden",
      position: "fixed",
      top: 0,
      left: 0,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px",
      background: "rgba(255, 255, 255, 0.15)",
      borderTopLeftRadius: "15px",
      borderTopRightRadius: "15px"
    },
    headerTitle: {
      color: "#FFD700",
      fontSize: "24px",
      margin: 0
    },
    buttonContainer: {
      display: "flex",
      gap: "15px"
    },
    resetBtn: {
      padding: "10px 20px",
      background: "#f44336",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    },
    logoutBtn: {
      padding: "10px 20px",
      background: "#f44336",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    },
    dropdownSection: {
      padding: "20px",
      borderBottom: "1px solid rgba(255,255,255,0.1)"
    },
    select: {
      padding: "10px",
      width: "200px",
      borderRadius: "5px",
      border: "1px solid #ddd",
      background: "white",
      cursor: "pointer"
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    dialog: {
      position: "relative",
      background: "white",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
      width: "300px",
      transform: "none",
    },
    dialogTitle: {
      color: "#333",
      marginBottom: "20px",
      textAlign: "center"
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "10px 0",
      borderRadius: "5px",
      border: "1px solid #ddd"
    },
    dialogButtons: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "20px"
    },
    submitBtn: {
      padding: "10px 20px",
      background: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    },
    cancelBtn: {
      padding: "10px 20px",
      background: "#f44336",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    },
    atmList: {
      padding: "20px",
      overflow: "auto",
      height: "calc(100vh - 180px)",
    },
    atmCard: {
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "10px",
      padding: "20px",
      marginBottom: "15px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    atmHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white",
    },
    atmTitle: {
      color: "#FFD700",
      margin: 0,
    },
    statusBadge: {
      padding: "5px 10px",
      borderRadius: "15px",
      fontSize: "14px",
      marginLeft: "10px",
    },
    logsSection: {
      marginTop: "20px",
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      padding: "15px 0",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      color: "white",
      marginTop: "10px",
    },
    th: {
      textAlign: "left",
      padding: "10px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      color: "#FFD700",
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    },
    commandBtn: {
      padding: "5px 10px",
      background: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginLeft: "10px"
    },
    radioGroup: {
      margin: "15px 0",
      color: "#333"
    },
    commandForm: {
      marginTop: "15px"
    },
    atmDetails: {
      marginBottom: "15px",
      padding: "10px",
      background: "#f5f5f5",
      borderRadius: "5px",
      color: "#333"
    },
    atmDetailText: {
      margin: "5px 0",
      fontSize: "14px",
      fontWeight: "bold"
    }
  };

  const getStatusLabel = (status) => {
    switch(status?.toUpperCase()) {
      case 'HIGH TEMPERATURE':
        return { color: "rgba(255, 68, 68, 0.8)", text: "HIGH" };
      case 'LOW CASH':
        return { color: "rgba(255, 187, 51, 0.8)", text: "LOW" };
      case 'NORMAL':
        return { color: "rgba(0, 200, 81, 0.8)", text: "NORMAL" };
      default:
        return { color: "rgba(128, 128, 128, 0.8)", text: "NO DATA" };
    }
  };

  const filteredAtms = Object.entries(atmData.allData)
    .filter(([_, data]) => !location || data.location === location);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Technician Dashboard</h1>
        <div style={styles.buttonContainer}>
          <button style={styles.resetBtn} onClick={() => setShowResetDialog(true)}>
            Reset Password
          </button>
          <button style={styles.logoutBtn} onClick={() => navigate('/login')}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.dropdownSection}>
        <select 
          value={location} 
          onChange={(e) => setLocation(e.target.value)}
          style={styles.select}
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option 
              key={loc.id} 
              value={loc.name.toLowerCase()}
            >
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.atmList}>
        {atmData.loading ? (
          <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
            Loading ATM data...
          </div>
        ) : filteredAtms.length > 0 ? (
          filteredAtms.map(([atmCode, data]) => (
            <div 
              key={atmCode}
              style={styles.atmCard}
              onClick={() => setExpandedAtm(expandedAtm === atmCode ? null : atmCode)}
            >
              <div style={styles.atmHeader}>
                <h3 style={styles.atmTitle}>
                  {atmCode} - {data.location.charAt(0).toUpperCase() + data.location.slice(1)}
                </h3>
                <div>
                  <span style={{
                    ...styles.statusBadge,
                    background: getStatusLabel(data.tempLogs[0]?.atm_status).color
                  }}>
                    {data.currentStatus.temperature}°C
                  </span>
                  <span style={{
                    ...styles.statusBadge,
                    background: getStatusLabel(data.cashLogs[0]?.atm_status).color
                  }}>
                    ₹{data.currentStatus.cash.toLocaleString()}
                  </span>
                  <button 
                    style={styles.commandBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCommandData({ ...commandData, atmcode: atmCode, location: data.location });
                      setShowCommandDialog(true);
                    }}
                  >
                    Send Commands
                  </button>
                </div>
              </div>

              {expandedAtm === atmCode && (
                <div style={styles.logsSection}>
                  <h4 style={{ color: "#FFD700" }}>Temperature Logs</h4>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Time</th>
                        <th style={styles.th}>Temperature (°C)</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.tempLogs.map((log, index) => (
                        <tr key={index}>
                          <td style={styles.td}>{log.timestamp}</td>
                          <td style={styles.td}>{log.temp_celsius}°C</td>
                          <td style={styles.td}>{log.atm_status}</td>
                          <td style={styles.td}>{log.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h4 style={{ color: "#FFD700", marginTop: "20px" }}>Cash Logs</h4>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Time</th>
                        <th style={styles.th}>₹100</th>
                        <th style={styles.th}>₹200</th>
                        <th style={styles.th}>₹500</th>
                        <th style={styles.th}>Total</th>
                        <th style={styles.th}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.cashLogs.map((log, index) => (
                        <tr key={index}>
                          <td style={styles.td}>{log.timestamp}</td>
                          <td style={styles.td}>{log.cash_count_100rs}</td>
                          <td style={styles.td}>{log.cash_count_200rs}</td>
                          <td style={styles.td}>{log.cash_count_500rs}</td>
                          <td style={styles.td}>₹{log.total_amount.toLocaleString()}</td>
                          <td style={styles.td}>{log.atm_status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
            No ATMs found for the selected location
          </div>
        )}
      </div>

      {showResetDialog && (
        <div style={styles.overlay}>
          <div style={styles.dialog}>
            <h2 style={styles.dialogTitle}>Reset Password</h2>
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              style={styles.input}
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              style={styles.input}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              style={styles.input}
            />
            <div style={styles.dialogButtons}>
              <button style={styles.submitBtn} onClick={handleResetPassword}>
                Submit
              </button>
              <button style={styles.cancelBtn} onClick={() => setShowResetDialog(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCommandDialog && (
        <div style={styles.overlay}>
          <div style={styles.dialog}>
            <h2 style={styles.dialogTitle}>Send Command</h2>
            
            <div style={styles.atmDetails}>
              <p style={styles.atmDetailText}>ATM ID: {commandData.atmcode}</p>
              <p style={styles.atmDetailText}>Location: {commandData.location.charAt(0).toUpperCase() + commandData.location.slice(1)}</p>
            </div>

            <div style={styles.radioGroup}>
              <input
                type="radio"
                id="temperature"
                name="commandType"
                value="temperature"
                onChange={(e) => setCommandType(e.target.value)}
              />
              <label htmlFor="temperature">Temperature</label>
              
              <input
                type="radio"
                id="cash"
                name="commandType"
                value="cash"
                onChange={(e) => setCommandType(e.target.value)}
                style={{ marginLeft: "15px" }}
              />
              <label htmlFor="cash">Cash</label>
            </div>

            {commandType && (
              <div style={styles.commandForm}>
                {commandType === 'temperature' ? (
                  <input
                    type="number"
                    placeholder="Temperature in Celsius"
                    value={commandData.tempCelsius}
                    onChange={(e) => setCommandData({...commandData, tempCelsius: e.target.value})}
                    style={styles.input}
                  />
                ) : (
                  <>
                    <input
                      type="number"
                      placeholder="₹100 Notes Count"
                      value={commandData.cashCount100rs}
                      onChange={(e) => setCommandData({...commandData, cashCount100rs: e.target.value})}
                      style={styles.input}
                    />
                    <input
                      type="number"
                      placeholder="₹200 Notes Count"
                      value={commandData.cashCount200rs}
                      onChange={(e) => setCommandData({...commandData, cashCount200rs: e.target.value})}
                      style={styles.input}
                    />
                    <input
                      type="number"
                      placeholder="₹500 Notes Count"
                      value={commandData.cashCount500rs}
                      onChange={(e) => setCommandData({...commandData, cashCount500rs: e.target.value})}
                      style={styles.input}
                    />
                  </>
                )}
              </div>
            )}

            <div style={styles.dialogButtons}>
              <button 
                style={styles.submitBtn} 
                onClick={handleSendCommand}
                disabled={!commandType}
              >
                Send
              </button>
              <button 
                style={styles.cancelBtn} 
                onClick={() => {
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
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Technician;