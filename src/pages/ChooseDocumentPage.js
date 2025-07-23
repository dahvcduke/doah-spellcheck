import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const ChooseDocumentPage = () => {
  const navigate = useNavigate();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  useEffect(() => {
    const storedDocs = JSON.parse(localStorage.getItem("uploadedFilenames")) || [];
    if (storedDocs.length === 0) {
      localStorage.removeItem("uploadedJson");
      localStorage.removeItem("originalJson");
      localStorage.removeItem("editedJson");
      localStorage.removeItem("uploadedFilenames");
    }

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
    const files = Array.from(event.target.files).slice(0, 20); // increase limit if desired
    const newUploadedDocs = [];
    const newJsonMap = {};

    let processedCount = 0;

    // Get existing uploadedJson from localStorage (merge)
    const existingJson = JSON.parse(localStorage.getItem("uploadedJson")) || {};

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          newJsonMap[file.name] = json;
          newUploadedDocs.push(file.name);

          processedCount++;
          if (processedCount === files.length) {
            const updatedFiles = [...new Set([...uploadedDocuments, ...newUploadedDocs])];
            const mergedJson = { ...existingJson, ...newJsonMap };

            setUploadedDocuments(updatedFiles);
            localStorage.setItem("uploadedFilenames", JSON.stringify(updatedFiles));
            localStorage.setItem("uploadedJson", JSON.stringify(mergedJson));
            localStorage.setItem("originalJson", JSON.stringify(mergedJson));

            const editedJson = JSON.parse(localStorage.getItem("editedJson")) || {};
            localStorage.setItem("editedJson", JSON.stringify(editedJson));

            setSelectedDocument(newUploadedDocs[0]); // still select first for now
          }
        } catch (error) {
          alert(`Invalid JSON in file: ${file.name}`);
        }
      };

      reader.readAsText(file);
    });
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
        Choose Up to 20 JSON Files
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
            accept=".json"
            multiple
          />
        </label>
      </div>

      {uploadedDocuments.length > 0 && (
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ textAlign: "center", color: "#50464E", fontSize: "28px" }}>
            Uploaded Documents
          </h2>
          <ul style={{ listStyle: "none", padding: 0, fontSize: "22px", textAlign: "center" }}>
            {uploadedDocuments.map((filename) => (
              <li
                key={filename}
                onClick={() => setSelectedDocument(filename)}
                style={{
                  margin: "10px 0",
                  cursor: "pointer",
                  color: filename === selectedDocument ? "#DEA93D" : "#50464E",
                  fontWeight: filename === selectedDocument ? "bold" : "normal",
                  textDecoration: filename === selectedDocument ? "underline" : "none",
                }}
              >
                {filename}
              </li>
            ))}
          </ul>
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
