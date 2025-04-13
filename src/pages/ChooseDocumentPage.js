import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const ChooseDocumentPage = () => {
  const navigate = useNavigate();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  useEffect(() => {
    const storedDocs = JSON.parse(localStorage.getItem("uploadedFilenames")) || [];
    setUploadedDocuments(storedDocs);
  }, []);

  const handleNext = () => {
    if (selectedDocument) {
      navigate("/error-process", { state: { selectedDocument } });
    } else {
      alert("Please upload a document first.");
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);

          // ✅ FIXED: set originalJson and initialize empty editedJson
          localStorage.setItem("uploadedJson", JSON.stringify(json));
          localStorage.setItem("originalJson", JSON.stringify(json));
          localStorage.setItem("editedJson", JSON.stringify({}));

          const newFileName = file.name;
          const updatedFiles = [...new Set([...uploadedDocuments, newFileName])];
          setUploadedDocuments(updatedFiles);
          localStorage.setItem("uploadedFilenames", JSON.stringify(updatedFiles));

          setSelectedDocument(newFileName);
        } catch (error) {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F0DFC3",
        fontFamily: "Proxima Nova",
        minHeight: "100vh",
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
        Choose Your Document
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <label
          htmlFor="file-upload"
          style={{
            border: "2px dashed #50464E",
            borderRadius: "10px",
            width: "50%",
            height: "400px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#50464E",
            fontSize: "30px",
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          Upload Document
          <input
            id="file-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleUpload}
          />
        </label>
      </div>

      {selectedDocument && (
        <div
          style={{
            textAlign: "center",
            fontSize: "28px",
            color: "#50464E",
            marginBottom: "40px",
          }}
        >
          Selected Document: {selectedDocument}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "25px",
        }}
      >
        <button style={buttonStyle} onClick={() => navigate("/")}>
          Back
        </button>
        <button style={buttonStyle} onClick={handleNext}>
          Next
        </button>
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

export default ChooseDocumentPage;
