import React from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";

const AllDocumentsPage = () => {
  const navigate = useNavigate();

  const documents = Array.from({ length: 20 }, (_, i) => `Document ${i + 1}`);

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
        Editing History and Uploaded Files
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          justifyItems: "start",
          fontSize: "30px",
          color: "#50464E",
          marginBottom: "25px",
          columnGap: "25px",
          rowGap: "25px",
        }}
      >
        {documents.map((doc, index) => (
          <p
            key={index}
            style={{ cursor: "pointer", margin: "5px 0" }}
            onClick={() => navigate("/editing-history")}
          >
            {doc}
          </p>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
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
          onClick={() => navigate("/data-storage")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default AllDocumentsPage;
