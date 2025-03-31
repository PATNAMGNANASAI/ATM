import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Update API base URL to use port 8081
const API_BASE_URL = 'http://localhost:8081/api'; // Adjust this to match your Spring Boot server URL

function Register() {

 const navigate = useNavigate();

 const [showPassword, setShowPassword] = useState(false);

 const [formData, setFormData] = useState({

  name: "",

  email: "",

  role: "",

  password: "",

  confirmPassword: "",

 });

 const [emailError, setEmailError] = useState("");

 const [passwordError, setPasswordError] = useState("");

 const [confirmPasswordError, setConfirmPasswordError] = useState("");

 const handleChange = (e) => {

  setFormData({ ...formData, [e.target.name]: e.target.value });

  // Reset respective error on change

  if (e.target.name === "email") setEmailError("");

  if (e.target.name === "password") setPasswordError("");

  if (e.target.name === "confirmPassword") setConfirmPasswordError("");

 };

 const handleShowPassword = () => setShowPassword(!showPassword);

 const validateEmail = () => {

  if (!formData.email.includes("@")) {

   setEmailError("Invalid email address");

  } else {

   setEmailError("");

  }

 };

 const validatePassword = () => {

  // Password must be 4-12 characters, include at least one capital letter, one number, and one special character.

  const passwordRegex =

   /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,12}$/;

  if (!passwordRegex.test(formData.password)) {

   setPasswordError(

    "Password must be 4-12 characters, include at least one capital letter, one number, and one special character."

   );

  } else {

   setPasswordError("");

  }

 };

 const validateConfirmPassword = () => {

  if (formData.password !== formData.confirmPassword) {

   setConfirmPasswordError("Passwords do not match");

  } else {

   setConfirmPasswordError("");

  }

 };

 const handleSubmit = async (e) => {

  e.preventDefault();

  validateEmail();

  validatePassword();

  validateConfirmPassword();

  // If any error exists, do not submit

  if (emailError || passwordError || confirmPasswordError) {

   return;

  }

  // Check if any required field is empty

  if (

   !formData.name ||

   !formData.email ||

   !formData.role ||

   !formData.password ||

   !formData.confirmPassword

  ) {

   return;

  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password
      })
    });

    if (response.ok) {
      alert("Registration Successful!");
      navigate("/login");
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Registration failed. Please try again.");
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert("Registration failed. Please check your connection and try again.");
  }
 };

 return (

  <div style={styles.container}>

   <div style={styles.registerCard}>

    <h2 style={styles.heading}>Create an Account</h2>

    <form onSubmit={handleSubmit}>

     <div style={styles.inputGroup}>

      <label style={styles.label}>Name</label>

      <input

       type="text"

       name="name"

       value={formData.name}

       onChange={handleChange}

       required

       style={styles.input}

       placeholder="Enter your name"

      />

     </div>

     <div style={styles.inputGroup}>

      <label style={styles.label}>Email</label>

      <input

       type="email"

       name="email"

       value={formData.email}

       onChange={handleChange}

       onBlur={validateEmail}

       required

       style={styles.input}

       placeholder="Enter your email"

      />

      {emailError && <p style={styles.error}>{emailError}</p>}

     </div>

     <div style={styles.inputGroup}>

      <label style={styles.label}>Role</label>

      <select

       name="role"

       value={formData.role}

       onChange={handleChange}

       required

       style={styles.select}

      >

       <option value="" hidden style={styles.option}>

        Select Role

       </option>

       <option value="admin" style={styles.option}>

        Admin

       </option>

       <option value="technician" style={styles.option}>

        Technician

       </option>

      </select>

     </div>

     <div style={styles.passwordContainer}>

      <div style={styles.inputGroup}>

       <label style={styles.label}>Password</label>

       <input

        type={showPassword ? "text" : "password"}

        name="password"

        value={formData.password}

        onChange={handleChange}

        onBlur={validatePassword}

        required

        style={styles.input}

        placeholder="Enter password"

       />

       {passwordError && <p style={styles.error}>{passwordError}</p>}

      </div>

      {/* Removed the <div style={{ width: "10px" }} /> spacer */}

      <div style={styles.inputGroup}>

       <label style={styles.label}>Confirm Password</label>

       <input

        type={showPassword ? "text" : "password"}

        name="confirmPassword"

        value={formData.confirmPassword}

        onChange={handleChange}

        onBlur={validateConfirmPassword}

        required

        style={styles.input}

        placeholder="Confirm password"

       />

       {confirmPasswordError && (

        <p style={styles.error}>{confirmPasswordError}</p>

       )}

      </div>

     </div>

     <div style={styles.showPassword}>

      <input

       type="checkbox"

       checked={showPassword}

       onChange={handleShowPassword}

      />

      <span>Show Password</span>

     </div>

     <button type="submit" style={styles.registerBtn}>

      Register

     </button>

    </form>

    <p style={styles.loginLink}>

     Already have an account?{" "}

     <Link to="/login" style={styles.link}>

      Login here

     </Link>

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

  minHeight: "100vh",

  background: "linear-gradient(to top right, #0f2027, #203a43, #2c5364)",

  fontFamily: "'Poppins', sans-serif",
  overflow: "auto",

 },

 registerCard: {
    //maxwidth:"450px",

  background:

   "linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(0, 0, 0, 0.25))",

  padding: "40px",

  borderRadius: "12px",

  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",

  width: "450px",

  textAlign: "center",

  backdropFilter: "blur(10px)",

  border: "1px solid rgba(255, 255, 255, 0.2)",

  color: "#EEE",

 },

 heading: {
  margin:"0px",
  padding:"0px",
  fontSize: "20px",

  fontWeight: "600",

  textTransform: "uppercase",

  letterSpacing: "1px",

  color: "#FFD700",

 },

 inputGroup: {

  marginBottom: "20px",

  textAlign: "left",

  flex: 1, // Ensures columns share the same width

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

  background: "rgba(255, 255, 255, 0.15)",

  color: "#FFF",

  borderBottom: "2px solid rgba(255, 255, 255, 0.3)",

  transition: "0.3s",

 },

 select: {

  width: "470px",

  padding: "12px",

  borderRadius: "8px",

  fontSize: "14px",

  background: "rgba(255, 255, 255, 0.2)",

  color: "#FFF",

  outline: "none",

  border: "none",

 },

 option: {

  background: "rgba(15, 32, 39, 0.7)",

  color: "white",

 },

 passwordContainer: {

  display: "flex",

  gap: "30px",

  justifyContent: "space-between",

 },

 showPassword: {

  marginTop: "0px",
  marginBottom: "5px",

  display: "flex",

  alignItems: "center",

  fontSize: "14px",

  color: "#DDD",

 },

 registerBtn: {

  width: "100%",

  padding: "12px",

  background: "linear-gradient(145deg, #FF8C00, #FFD700)",

  color: "#FFF",

  border: "none",

  borderRadius: "8px",

  fontSize: "16px",

  fontWeight: "bold",

  cursor: "pointer",

  transition: "0.3s",

  boxShadow: "0 5px 15px rgba(255, 69, 0, 0.4)",

 },

 loginLink: {

  marginTop: "15px",

  fontSize: "14px",

 },

 link: {

  color: "#FFD700",

  textDecoration: "none",

  fontWeight: "bold",

 },

 error: {

  color: "red",
  padding:"0px",

  fontSize: "14px",

  marginTop: "5px",
  marginBottom: "0px",
  width: "100%", // Matches input width

  wordBreak: "break-word",

  minHeight: "0px", // Reserve space for error text

 },

};

export default Register;
