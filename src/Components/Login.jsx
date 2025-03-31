import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8081/api';

function Login() {
 const navigate = useNavigate(); // Move this to component level
 const [showPassword, setShowPassword] = useState(false);
 const [formData, setFormData] = useState({ email: "", password: "" });
 const [error, setError] = useState("");

 const handleShowPassword = () => setShowPassword(!showPassword);

 const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
   e.preventDefault();
   setError("");

   try {
     const response = await fetch(`${API_BASE_URL}/auth/login`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         email: formData.email,
         password: formData.password
       })
     });

     const data = await response.json(); // Change to JSON parsing

      if (response.ok) {
        const userRole = data.role; // Assuming backend sends role in response
        console.log(userRole);
        switch(userRole) {
          case 'admin':
            navigate('/AdminDashboard');
            break;
          case 'technician':
            navigate('/Technician');
            break;
          default:
            setError("Invalid role assigned");
            break;
        }
      } else {
        setError(data.message || "Invalid credentials");
      } 
      } catch (err) {
        setError("Connection error. Please try again.");
      }
 };

 return (
   <div style={styles.container}>
     <div style={styles.loginCard}>
       <h2 style={styles.heading}>Welcome Again!</h2>
       {error && <div style={styles.error}>{error}</div>}
       <form onSubmit={handleSubmit}>
         <div style={styles.inputGroup}>
           <label style={styles.label}>Email</label>
           <input
             type="email"
             name="email"
             value={formData.email}
             onChange={handleChange}
             required
             style={styles.input}
             placeholder="Enter your email"
           />
         </div>
         <div style={styles.inputGroup}>
           <label style={styles.label}>Password</label>
           <input
             type={showPassword ? "text" : "password"}
             name="password"
             value={formData.password}
             onChange={handleChange}
             required
             style={styles.input}
             placeholder="Enter your password"
           />
           <div style={styles.showPassword}>
             <input type="checkbox" checked={showPassword} onChange={handleShowPassword} />
             <span>Show Password</span>
           </div>
         </div>
         <button type="submit" style={styles.loginBtn}>Login</button>
       </form>
       <p style={styles.registerLink}>
         Not a user? <Link to="/register" style={styles.link}>Register here</Link>
       </p>
     </div>
   </div>
 );
}

const styles = {
 container: {
   display: "flex",
   justifyContent: "center",
   alignItems: "center",
   width: "100vw",
   height: "100vh",
   background: "linear-gradient(to top right, #0f2027, #203a43, #2c5364)", // Deep Blue to Dark Teal Gradient
   fontFamily: "'Poppins', sans-serif",
 },
 loginCard: {
   background: "linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(0, 0, 0, 0.25))", // Soft Light Gradient for Card
   padding: "40px",
   borderRadius: "12px",
   boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
   width: "350px",
   textAlign: "center",
   backdropFilter: "blur(10px)",
   border: "1px solid rgba(255, 255, 255, 0.2)",
   color: "#EEE",
 },
 heading: {
   marginBottom: "20px",
   fontSize: "26px",
   fontWeight: "600",
   textTransform: "uppercase",
   letterSpacing: "1px",
   color: "#FFD700", // Classy Gold Accent for Heading
 },
 inputGroup: {
   marginBottom: "20px",
   textAlign: "left",
 },
 label: {
   display: "block",
   marginBottom: "5px",
   fontSize: "14px",
   fontWeight: "500",
   color: "#EEE",
 },
 input: {
   width: "100%",
   padding: "12px",
   border: "none",
   borderRadius: "8px",
   fontSize: "14px",
   outline: "none",
   background: "rgba(255, 255, 255, 0.15)", // Soft glass effect with clearer contrast
   color: "#FFF",
   borderBottom: "2px solid rgba(255, 255, 255, 0.3)",
   transition: "0.3s",
 },
 inputFocus: {
   borderBottom: "2px solid #FFD700", // Gold border on focus
 },
 showPassword: {
   marginTop: "8px",
   display: "flex",
   alignItems: "center",
   fontSize: "14px",
   color: "#DDD",
 },
 loginBtn: {
   width: "100%",
   padding: "12px",
   background: "linear-gradient(145deg, #FF8C00, #FFD700)", // Classy Gold Gradient Button
   color: "#FFF",
   border: "none",
   borderRadius: "8px",
   fontSize: "16px",
   fontWeight: "bold",
   cursor: "pointer",
   transition: "0.3s",
   boxShadow: "0 5px 15px rgba(255, 69, 0, 0.4)",
 },
 loginBtnHover: {
   background: "linear-gradient(145deg, #FF6347, #FF4500)",
 },
 registerLink: {
   marginTop: "15px",
   fontSize: "14px",
 },
 link: {
   color: "#FFD700", // Gold Link color
   textDecoration: "none",
   fontWeight: "bold",
 },
 error: {
   color: '#ff6b6b',
   backgroundColor: 'rgba(255, 107, 107, 0.1)',
   padding: '10px',
   borderRadius: '5px',
   marginBottom: '15px',
   fontSize: '14px'
 }
};

const globalStyle = document.createElement("style");

globalStyle.innerHTML = `
 html, body {
   margin: 0;
   padding: 0;
   height: 100%;
   font-family: 'Poppins', sans-serif;
 }
 input::placeholder {
   color: rgba(255, 255, 255, 0.6);
 }
 input:focus {
   border-bottom: 2px solid #FFD700 !important;
   background: rgba(255, 255, 255, 0.25) !important;
 }
 button:hover {
   background: linear-gradient(145deg, #FF8C00, #FFD700) !important;
   transform: scale(1.05);
   box-shadow: 0 8px 25px rgba(255, 69, 0, 0.6);
 }
`;

document.head.appendChild(globalStyle);

export default Login;
