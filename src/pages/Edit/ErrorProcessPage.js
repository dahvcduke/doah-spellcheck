import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../App.css";

const ErrorProcessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedDocument } = location.state || { selectedDocument: "Document 1" };
  const [errorCount, setErrorCount] = useState("---"); // Placeholder for error count
  const totalErrors = "---"; // Placeholder for total errors

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
        <p>
          {errorCount}/{totalErrors} errors found
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "20px",
        }}
      >
        <button
          style={{
            fontSize: "30px",
            backgroundColor: "#DEA93D",
            color: "#50464E",
            padding: "10px 30px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={handleBack}
        >
          Back
        </button>

        <button
          style={{
            fontSize: "30px",
            backgroundColor: "#DEA93D",
            color: "#50464E",
            padding: "10px 30px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={handleNext}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default ErrorProcessPage;