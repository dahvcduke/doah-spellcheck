import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="landing-container"
      style={{
        backgroundColor: "#F0DFC3",
        fontFamily: "Proxima Nova",
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 50px",
      }}
    >
      <h1
        style={{
          fontSize: "50px",
          fontWeight: "bold",
          color: "#A6785E",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Historian Dictionary
      </h1>
      <p
        style={{
          fontSize: "30px",
          color: "#50464E",
          textAlign: "center",
          maxWidth: "900px",
          marginBottom: "40px",
          lineHeight: "1.5",
        }}
      >
        The Dictionary Grammar and Spelling Checker is a Python-based tool designed to correct
        common errors while recognizing foreign words, proper nouns, and specialized terms. With
        sentence-level implementation and word-level focus separately managed, this program ensures
        accurate and context-aware corrections tailored for dictionary use.
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "80px",
          marginBottom: "100px",
        }}
      >
        <button
          style={{
            fontSize: "40px",
            backgroundColor: "#DEA93D",
            color: "#50464E",
            padding: "20px 60px",
            borderRadius: "15px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => navigate("/choose-document")}
        >
          Edit Document
        </button>
        <button
          style={{
            fontSize: "40px",
            backgroundColor: "#DEA93D",
            color: "#50464E",
            padding: "20px 60px",
            borderRadius: "15px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => navigate("/data-storage")}
        >
          Data Storage
        </button>
      </div>
      <p
        style={{
          fontSize: "20px",
          color: "#50464E",
          position: "absolute",
          bottom: "20px",
          right: "40px",
        }}
      >
        Credit @Duke University
      </p>
    </div>
  );
};

export default LandingPage;