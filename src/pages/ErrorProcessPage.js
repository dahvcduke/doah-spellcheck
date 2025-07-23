import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const ErrorProcessPage = () => {
  const navigate = useNavigate();
  const [fileErrors, setFileErrors] = useState({});

  useEffect(() => {
    const jsonString = localStorage.getItem("uploadedJson");
    if (!jsonString) return;

    try {
      const allJsons = JSON.parse(jsonString);
      const counts = {};

      Object.entries(allJsons).forEach(([filename, fileData]) => {
        let count = 0;
        Object.values(fileData).forEach((arr) => {
          if (Array.isArray(arr)) count += arr.length;
        });
        counts[filename] = count;
      });

      setFileErrors(counts);
    } catch (err) {
      console.error("Failed to parse uploadedJson:", err);
    }
  }, []);


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

      <div style={{ marginBottom: "40px" }}>
        {Object.keys(fileErrors).length === 0 ? (
          <p style={{ fontSize: "24px", color: "#50464E" }}>No uploaded files found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, fontSize: "24px", color: "#50464E" }}>
            {Object.entries(fileErrors).map(([filename, count]) => (
              <li key={filename} style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span><strong>{filename}</strong>: {count} error{count !== 1 ? "s" : ""}</span>
                <button
                  style={{ ...buttonStyle, fontSize: "20px", padding: "8px 20px" }}
                  onClick={() => navigate("/edit-error", { state: { selectedDocument: filename } })}
                >
                  Start
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>


      <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
        <button style={buttonStyle} onClick={handleBack}>Back</button>
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