import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css"; 

const ChooseDocumentPage = () => {
  const navigate = useNavigate();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const documents = Array.from({ length: 6 }, (_, i) => `Document ${i + 1}`).concat(uploadedDocuments);

  const handleDocumentSelect = (doc) => {
    setSelectedDocument(doc);
  };

  const handleNext = () => {
    if (selectedDocument) {
      navigate("/error-process", { state: { selectedDocument } });
    } else {
      alert("Please select a document or upload a new one.");
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedDocuments((prev) => [...prev, file.name]);
    }
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
        Choose Your Document
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "25px",
            fontSize: "30px",
            color: "#50464E",
            width: "45%",
          }}
        >
          {documents.map((doc, index) => (
            <label
              key={index}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <input
                type="checkbox"
                checked={selectedDocument === doc}
                onChange={() => handleDocumentSelect(doc)}
                style={{ marginRight: "10px", flexShrink: 0 }}
              />
              <span
                style={{
                  display: "inline-block",
                  maxWidth: "250px", // Ensuring width stays fixed
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={doc} // Tooltip to show full name on hover
              >
                {doc}
              </span>
            </label>
          ))}
        </div>

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

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "25px",
          marginTop: "50px",
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
          Next
        </button>
      </div>
    </div>
  );
};

export default ChooseDocumentPage;
