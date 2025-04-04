import React from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";

const EditingHistoryPage = () => {
  const navigate = useNavigate();

  // Example edits for Document 1
  const editsLeft = [
    "Line 4: “is” to “are”",
    "Line 19: “asoduhosa” to “jnsjd”",
    "Line 21: “asoduhosa” to “jnsjd”",
    "Line 34: “asoduhosa” to “jnsjd”",
    "Line 75: “asoduhosa” to “jnsjd”",
    "Line 95: “asoduhosa” to “jnsjd”",
    "Line 106: “asoduhosa” to “jnsjd”",
    "Line 111: “asoduhosa” to “jnsjd”",
  ];

  const editsRight = [
    "Line 5: “is” to “are”",
    "Line 20: “asoduhosa” to “jnsjd”",
    "Line 22: “asoduhosa” to “jnsjd”",
    "Line 50: “asoduhosa” to “jnsjd”",
    "Line 92: “asoduhosa” to “jnsjd”",
    "Line 100: “asoduhosa” to “jnsjd”",
    "Line 108: “asoduhosa” to “jnsjd”",
    "Line 113: “asoduhosa” to “jnsjd”",
  ];

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
        Editing History
      </h1>

      <h2
        style={{
          fontSize: "35px",
          fontWeight: "bold",
          color: "#50464E",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Document 1
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "25px",
          fontSize: "30px",
          color: "#50464E",
        }}
      >
        <div>
          {editsLeft.map((edit, index) => (
            <p key={index}>{edit}</p>
          ))}
        </div>
        <div>
          {editsRight.map((edit, index) => (
            <p key={index}>{edit}</p>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "25px",
          marginTop: "25px",
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
          onClick={() => navigate("/")}
        >
          Home
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
          onClick={() => navigate("/all-documents")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default EditingHistoryPage;
