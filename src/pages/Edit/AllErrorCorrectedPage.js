import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../App.css";

const AllErrorCorrectedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedDocument, lastErrorIndex } = location.state || { selectedDocument: "Document 1", lastErrorIndex: 0 };
  const totalErrors = 2105;
  const correctedErrors = totalErrors;
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [fileName, setFileName] = useState("corrected_document");
  const [fileType, setFileType] = useState("csv");

  const handleBack = () => {
    navigate("/edit-error", { state: { selectedDocument, errorIndex: lastErrorIndex } });
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleExportClick = () => {
    setShowExportPopup(true);
  };

  const handleCancelExport = () => {
    setShowExportPopup(false);
  };

  const handleSaveExport = () => {
    const blob = new Blob([""], { type: `text/${fileType}` });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.${fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    setShowExportPopup(false);
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
        Edit Document
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
        <p>{correctedErrors}/{totalErrors} errors corrected</p>
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
          onClick={handleHome}
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
          onClick={handleExportClick}
        >
          Export
        </button>
      </div>

      {showExportPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "50px 80px",
              borderRadius: "10px",
              textAlign: "center",
              width: "700px",
            }}
          >
            <h2 style={{ fontSize: "40px", color: "#50464E", marginBottom: "20px" }}>Export</h2>
            <label style={{ fontSize: "30px", color: "#50464E", display: "block", marginBottom: "15px" }}>
              File name:
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                style={{ marginLeft: "10px", padding: "5px 10px", borderRadius: "5px", border: "1px solid #A6785E", width: "100%" }}
              />
            </label>
            <label style={{ fontSize: "30px", color: "#50464E", display: "block", marginBottom: "15px" }}>
              Save as type:
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                style={{ marginLeft: "10px", padding: "5px 10px", borderRadius: "5px", border: "1px solid #A6785E", width: "100%" }}
              >
                <option value="csv">csv</option>
                <option value="json">json</option>
                <option value="pdf">pdf</option>
              </select>
            </label>
            <button
              style={{ fontSize: "30px", backgroundColor: "#DEA93D", padding: "10px 20px", borderRadius: "5px", border: "none", cursor: "pointer", fontWeight: "bold", marginTop: "20px" }}
              onClick={handleCancelExport}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllErrorCorrectedPage;
