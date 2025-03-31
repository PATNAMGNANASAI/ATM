import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./Components/AuthPage";
import Dashboard from "./Components/Dashboard"; // Use the Dashboard component for both roles
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route 
          path="/dashboard" 
          element={<Dashboard />} // Use single Dashboard for both admin and technician
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;





