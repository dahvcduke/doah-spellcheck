import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

const ErrorProcessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedDocument } = location.state || { selectedDocument: "Document.json" };

  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    const jsonString = localStorage.getItem("uploadedJson");

    if (jsonString) {
      try {
        const jsonData = JSON.parse(jsonString);
        let totalErrors = 0;

        for (const entry of Object.values(jsonData)) {
          if (Array.isArray(entry)) {
            totalErrors += entry.length;
          }
        }

        setErrorCount(totalErrors);
      } catch (err) {
        console.error("Failed to parse uploadedJson:", err);
        setErrorCount(0);
      }
    }
  }, []);

  const handleNext = () => {
    navigate("/edit-error", { state: { selectedDocument } });
  };

  const handleBack = () => {
    navigate("/choose-document");
  };

  return (
    <div
      style={{
        backgroundColor: "#F0DFC3",
        fontFamily: "Proxima Nova",
        minHeight: "100vh",
        position: "relative",
        padding: "50px 100px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          fontSize: "50px",
          fontWeight: "bold",
          color: "#A6785E",
          textAlign: "center",
          marginBottom: "50px",
        }}
      >
        Error Processing
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "30px",
          color: "#50464E",
          marginBottom: "50px",
        }}
      >
        <p>Document: {selectedDocument}</p>
        <p>{errorCount} error{errorCount !== 1 ? "s" : ""} found</p>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
        <button style={buttonStyle} onClick={handleBack}>Back</button>
        <button style={buttonStyle} onClick={handleNext}>Start</button>
      </div>
    </div>
  );
};

const buttonStyle = {
  fontSize: "30px",
  backgroundColor: "#DEA93D",
  color: "#50464E",
  padding: "10px 30px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
};

export default ErrorProcessPage;