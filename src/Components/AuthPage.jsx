import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";
const API_BASE_URL = "http://localhost:8081/api";

// SVG Icons
const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="currentColor" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="currentColor" />
  </svg>
);

const EyeIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {open ? (
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor" />
    ) : (
      <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.84 13.26 16.57 13.8L19.12 16.35C21.68 14.7 23 12 23 12C21.27 7.61 17 4.5 12 4.5C10.6 4.5 9.26 4.75 8 5.2L10.17 7.35C10.73 7.13 11.34 7 12 7ZM2.41 3.65L4.93 6.17C2.38 7.86 1 12 1 12C2.73 16.39 7 19.5 12 19.5C13.4 19.5 14.78 19.25 16.05 18.8L18.58 21.33L19.99 19.92L3.82 3.75L2.41 3.65ZM12 17C9.24 17 7 14.76 7 12C7 11.36 7.13 10.75 7.35 10.19L9.18 12.02C9.18 12.01 9.17 12.01 9.17 12C9.17 10.89 10.06 10 11.17 10C11.18 10 11.18 10 11.19 10L13.01 11.82C12.45 12.04 11.84 12.17 11.2 12.17C10.09 12.17 9.17 11.25 9.17 10.14C9.17 9.5 9.3 8.89 9.53 8.33L13.84 12.64C13.29 12.87 12.67 13 12 13C11.35 13 10.74 12.87 10.18 12.64L12.47 14.93C12.47 14.93 12.47 14.93 12.47 14.93C14.58 14.77 16.24 13.11 16.4 11L18.38 12.97C17.5 15.28 15.01 17 12 17Z" fill="currentColor" />
    )}
  </svg>
);

const PersonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
  </svg>
);

const RoleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    <path d="M19 3H5C4.9 3 4 3.9 4 5V19C4 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 10H9V17H7V10ZM11 7H13V17H11V7ZM15 13H17V17H15V13Z" fill="currentColor" />
  </svg>
);

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Register state
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    // Prevent horizontal scrolling on the body
    document.body.style.overflow = "hidden"; 
    
    // Cleanup function to revert changes when component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const validateEmail = () => {
    if (!email.includes("@")) {
      setEmailError("Invalid email address");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = () => {
    // Password must be 4-12 characters, include at least one capital letter, one number, and one special character.
    if (isLogin) return true; // Skip validation for login

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,12}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be 4-12 characters with at least one capital letter, one number, and one special character."
      );
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const validateConfirmPassword = () => {
    if (isLogin) return true; // Skip validation for login

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const checkEmailAvailability = async () => {
    // Skip validation for login mode or if email is invalid
    if (isLogin || !validateEmail()) return;
    
    setIsCheckingEmail(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.exists) {
        setEmailError("This email is already registered");
        return false;
      } else {
        setEmailError("");
        return true;
      }
    } catch (error) {
      console.error("Error checking email:", error);
      // Don't block registration if the check fails
      return true;
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user info in localStorage
        localStorage.setItem("userRole", data.role || "user");
        localStorage.setItem("userName", data.name || email.split('@')[0]);
        localStorage.setItem("userToken", data.token || "demo-token");
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Login failed. Please check your connection or credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate form
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const isEmailAvailable = await checkEmailAvailability();

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isEmailAvailable) {
      setIsLoading(false);
      return;
    }

    // Check if any required field is empty
    if (!name || !email || !role || !password || !confirmPassword) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      // Format the registration data as required
      const registrationData = {
        name: name,
        email: email,
        password: password,
        role: role // This needs to be either "admin" or "tech"
      };

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLogin(true); // Switch to login view
        setError("");
        // Clear registration fields
        setName("");
        setEmail("");
        setPassword("");
        setRole("");
        setConfirmPassword("");
        // Show success notification
        setError("Registration successful! Please login.");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      setError("Please enter your email address");
      return;
    }

    // In a real application, this would connect to your backend
    // For now, we'll just simulate a successful password reset email
    setResetSuccess(true);
    setTimeout(() => {
      setShowForgotDialog(false);
      setResetSuccess(false);
      setResetEmail("");
    }, 3000);
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${isLogin ? 'card-login' : 'card-register'}`}>
        
        <h1 className="auth-heading">ATM Monitoring System</h1>
        <p className="auth-subheading">{isLogin ? "Welcome Back! Login to continue" : "Create an account"}</p>

        {error && <div className={error.includes("successful") ? "auth-success" : "auth-error"}>{error}</div>}

        {isLogin ? (
          // Login Form
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="auth-label">Email Address</label>
              <div className="input-wrapper">
                <EmailIcon />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="auth-input"
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="auth-label">Password</label>
              <div className="input-wrapper">
                <LockIcon />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-input"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={handleShowPassword}
                  className="show-password-btn"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            <div className="auth-footer">
              <button 
                type="button"
                className="toggle-link"
                onClick={() => setIsLogin(false)}
              >
                Need an account? Register
              </button>
              <button
                type="button"
                className="reset-link"
                onClick={() => setShowForgotDialog(true)}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        ) : (
          // Registration Form
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label className="auth-label">Full Name</label>
              <div className="input-wrapper">
                <PersonIcon />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="auth-input"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="auth-label">Email Address</label>
              <div className="input-wrapper">
                <EmailIcon />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={checkEmailAvailability}
                  required
                  className="auth-input"
                  placeholder="Enter your email"
                />
                {isCheckingEmail && <span className="loading-indicator">Checking...</span>}
              </div>
              {emailError && <p className="field-error">{emailError}</p>}
            </div>

            <div className="input-group">
              <label className="auth-label">Role</label>
              <div className="select-wrapper">
                <RoleIcon />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="auth-select"
                >
                  <option value="" disabled hidden className="auth-option">
                    Select Role
                  </option>
                  <option value="admin" className="auth-option">
                    Admin
                  </option>
                  <option value="tech" className="auth-option">
                    Technician
                  </option>
                </select>
              </div>
            </div>

            <div className="flex-row">
              <div className="flex-column input-group">
                <label className="auth-label">Password</label>
                <div className="input-wrapper">
                  <LockIcon />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={validatePassword}
                    required
                    className="auth-input"
                    placeholder="Create password"
                  />
                </div>
                {passwordError && <p className="field-error">{passwordError}</p>}
              </div>

              <div className="flex-column input-group">
                <label className="auth-label">Confirm</label>
                <div className="input-wrapper">
                  <LockIcon />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={validateConfirmPassword}
                    required
                    className="auth-input"
                    placeholder="Confirm password"
                  />
                </div>
                {confirmPasswordError && <p className="field-error">{confirmPasswordError}</p>}
              </div>
            </div>

            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={handleShowPassword}
                id="showPassword"
              />
              <label htmlFor="showPassword">Show passwords</label>
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>

            <div className="auth-footer">
              <button 
                type="button"
                className="toggle-link"
                onClick={() => setIsLogin(true)}
              >
                Already have an account? Sign in
              </button>
              <span></span> {/* Empty span to push content to the sides */}
            </div>
          </form>
        )}
      </div>

      {showForgotDialog && (
        <div className="auth-overlay">
          <div className="auth-dialog">
            <h2 className="dialog-title">Reset Password</h2>

            {resetSuccess ? (
              <div className="success-message">
                Password reset link has been sent to your email.
              </div>
            ) : (
              <>
                <p className="dialog-text">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <input
                  type="email"
                  placeholder="Email Address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="dialog-input"
                />

                <div className="dialog-buttons">
                  <button
                    className="dialog-btn cancel-btn"
                    onClick={() => setShowForgotDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="dialog-btn submit-btn"
                    onClick={handleForgotPassword}
                  >
                    Send Link
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
