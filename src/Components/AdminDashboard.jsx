import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [location, setLocation] = useState("");
  const [passwords, setPasswords] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [expandedAtm, setExpandedAtm] = useState(null);
  const [atmData, setAtmData] = useState({
    allData: {
      "BLR_ATM001": {
        atmcode: "BLR_ATM001",
        location: "bangalore",
        currentStatus: {
          temperature: 28,
          cash: 250000,
        },
        tempLogs: [
          { 
            timestamp: "2024-01-20 10:00:00", 
            temp_celsius: 28, 
            temp_kelvin: 301.15, 
            atm_status: "normal", 
            message: "Temperature within range"
          },
          { 
            timestamp: "2024-01-20 09:00:00", 
            temp_celsius: 31, 
            temp_kelvin: 304.15, 
            atm_status: "warning", 
            message: "Temperature high"
          }
        ],
        cashLogs: [
          { 
            timestamp: "2024-01-20 10:00:00",
            cash_count_100rs: 1000,
            cash_count_200rs: 500,
            cash_count_500rs: 300,
            total_amount: 250000,
            atm_status: "normal",
            message: "Cash sufficient"
          },
          { 
            timestamp: "2024-01-20 09:00:00",
            cash_count_100rs: 800,
            cash_count_200rs: 400,
            cash_count_500rs: 200,
            total_amount: 180000,
            atm_status: "warning",
            message: "Cash low"
          }
        ]
      },
      // Add more ATMs with similar structure for other locations
    },
    loading: false,
  });

  const [passwordConstraints, setPasswordConstraints] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false
  });

  const checkPasswordConstraints = (password, confirmPassword) => {
    setPasswordConstraints({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPassword && password !== ''
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const updatedPasswords = { ...passwords, [name]: value };
    setPasswords(updatedPasswords);
    
    if (name === 'newPassword' || name === 'confirmPassword') {
      checkPasswordConstraints(
        name === 'newPassword' ? value : updatedPasswords.newPassword,
        name === 'confirmPassword' ? value : updatedPasswords.confirmPassword
      );
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push(`Password must be at least ${minLength} characters long`);
    if (!hasUpperCase) errors.push("Password must contain at least one uppercase letter");
    if (!hasLowerCase) errors.push("Password must contain at least one lowercase letter");
    if (!hasNumbers) errors.push("Password must contain at least one number");
    if (!hasSpecialChar) errors.push("Password must contain at least one special character");

    return errors;
  };

  const handleResetPassword = async () => {
    if (!passwords.email || !passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      alert("All fields are required!");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(passwords.email)) {
      alert("Please enter a valid email address!");
      return;
    }

    // Password validation
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New password and Confirm password must match!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: passwords.email,
          oldPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });

      if (response.ok) {
        alert("Password reset successful!");
        setShowResetDialog(false);
        setPasswords({
          email: "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordConstraints({
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false,
          match: false
        });
      } else {
        const errorData = await response.text();
        alert(errorData || "Password reset failed!");
      }
    } catch (error) {
      alert("Connection error. Please try again.");
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      width: "100vw",
      height: "100vh",
      margin: "20px auto",
      background: "linear-gradient(to top right, #0f2027, #203a43, #2c5364)", // Restored original gradient
      fontFamily: "'Poppins', sans-serif",
      overflow: "hidden",
      boxShadow: "0 0 20px rgba(0,0,0,0.3)"
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
    dialog: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "white",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
      zIndex: 1000,
      width: "300px"
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
    constraintsList: {
      margin: "5px 0",
      padding: "0",
      listStyle: "none",
      fontSize: "12px",
      color: "#666",
    },
    constraintItem: {
      display: "flex",
      alignItems: "center",
      marginBottom: "3px",
    },
    checkIcon: {
      marginRight: "5px",
      color: "#4CAF50",
    },
    xIcon: {
      marginRight: "5px",
      color: "#f44336",
    },
    passwordInputWrapper: {
      marginBottom: "15px",
    },
    formLabel: {
      display: "block",
      marginBottom: "5px",
      color: "#333",
      fontWeight: "500",
      fontSize: "14px",
      textAlign: "left"
    }
  };

  const getStatusColor = (value, thresholds) => {
    if (value > thresholds.high) return "rgba(255, 68, 68, 0.5)";
    if (value > thresholds.medium) return "rgba(255, 187, 51, 0.5)";
    return "rgba(0, 200, 81, 0.5)";
  };

  const filteredAtms = Object.entries(atmData.allData)
    .filter(([_, data]) => !location || data.location === location);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Admin Dashboard</h1>
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
          <option value="bangalore">Bangalore</option>
          <option value="chennai">Chennai</option>
          <option value="hyderabad">Hyderabad</option>
          <option value="mumbai">Mumbai</option>
          <option value="pune">Pune</option>
        </select>
      </div>

      <div style={styles.atmList}>
        {filteredAtms.map(([atmCode, data]) => (
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
                  background: getStatusColor(data.currentStatus.temperature, { high: 30, medium: 28 })
                }}>
                  {data.currentStatus.temperature}°C
                </span>
                <span style={{
                  ...styles.statusBadge,
                  background: getStatusColor(data.currentStatus.cash, { high: 100000, medium: 50000 })
                }}>
                  ₹{data.currentStatus.cash.toLocaleString()}
                </span>
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
        ))}
      </div>

      {showResetDialog && (
        <div style={styles.dialog}>
          <h2 style={styles.dialogTitle}>Reset Password</h2>
          <div style={styles.passwordInputWrapper}>
            <label style={styles.formLabel}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={passwords.email}
              onChange={handlePasswordChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.passwordInputWrapper}>
            <label style={styles.formLabel}>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.passwordInputWrapper}>
            <label style={styles.formLabel}>New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              style={styles.input}
              required
            />
            {passwords.newPassword && (
              <ul style={styles.constraintsList}>
                {[
                  { key: 'length', text: 'At least 8 characters' },
                  { key: 'uppercase', text: 'One uppercase letter' },
                  { key: 'lowercase', text: 'One lowercase letter' },
                  { key: 'number', text: 'One number' },
                  { key: 'special', text: 'One special character (!@#$%^&*(),.?":{}|<>)' }
                ].map(({ key, text }) => (
                  <li key={key} style={styles.constraintItem}>
                    <span style={passwordConstraints[key] ? styles.checkIcon : styles.xIcon}>
                      {passwordConstraints[key] ? '✓' : '✗'}
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={styles.passwordInputWrapper}>
            <label style={styles.formLabel}>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              style={styles.input}
              required
            />
            {passwords.confirmPassword && (
              <div style={styles.constraintItem}>
                <span style={passwordConstraints.match ? styles.checkIcon : styles.xIcon}>
                  {passwordConstraints.match ? '✓' : '✗'}
                </span>
                Passwords match
              </div>
            )}
          </div>
          <div style={styles.dialogButtons}>
            <button 
              style={styles.submitBtn} 
              onClick={handleResetPassword}
              disabled={!Object.values(passwordConstraints).every(Boolean)}
            >
              Submit
            </button>
            <button 
              style={styles.cancelBtn} 
              onClick={() => {
                setShowResetDialog(false);
                setPasswords({
                  email: "",
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
                setPasswordConstraints({
                  length: false,
                  uppercase: false,
                  lowercase: false,
                  number: false,
                  special: false,
                  match: false
                });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;