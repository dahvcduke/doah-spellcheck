import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../App.css";

const AllErrorCorrectedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedDocument, lastErrorIndex } = location.state || { selectedDocument: "Document 1", lastErrorIndex: 0 };

  const [showExportPopup, setShowExportPopup] = useState(false);
  const [fileName, setFileName] = useState("corrected_document");
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("uploadedJson");
    if (stored) {
      const json = JSON.parse(stored);
      let totalErrors = 0;
      Object.values(json).forEach(errors => {
        totalErrors += errors.length;
      });
      setErrorCount(totalErrors);
    }
  }, []);

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
    const originalJson = JSON.parse(localStorage.getItem("originalJson") || "{}");
    const editedJson = JSON.parse(localStorage.getItem("editedJson") || "{}");

    // Merge corrected and unedited lines
    const merged = {};
    Object.keys(originalJson).forEach((line) => {
      merged[line] = editedJson[line] || line;
    });

    const fileContent = JSON.stringify(merged, null, 2);

    const blob = new Blob([fileContent], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    setShowExportPopup(false);
  };

  return (
    <div style={{
      backgroundColor: "#F0DFC3",
      fontFamily: "Proxima Nova",
      minHeight: "100vh",
      position: "relative",
      padding: "50px 100px",
      display: "flex",
      flexDirection: "column",
    }}>
      <h1 style={{
        fontSize: "50px",
        fontWeight: "bold",
        color: "#A6785E",
        textAlign: "center",
        marginBottom: "50px",
      }}>
        Edit Document
      </h1>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "30px",
        color: "#50464E",
        marginBottom: "50px",
      }}>
        <p>Document: {selectedDocument}</p>
        <p>{errorCount} errors corrected</p>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "25px",
        marginTop: "50px",
      }}>
        <button style={buttonStyle} onClick={handleBack}>Back</button>
        <button style={buttonStyle} onClick={handleHome}>Home</button>
        <button style={buttonStyle} onClick={handleExportClick}>Export</button>
      </div>

      {showExportPopup && (
        <div style={popupOverlayStyle}>
          <div style={popupContentStyle}>
            <h2 style={popupTitleStyle}>Export</h2>
            <label style={popupLabelStyle}>
              File name:
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={popupLabelStyle}>
              Save as type:
              <select value="json" disabled style={inputStyle}>
                <option value="json">json</option>
              </select>
            </label>
            <div style={popupButtonRowStyle}>
              <button style={popupButtonStyle} onClick={handleCancelExport}>Cancel</button>
              <button style={popupButtonStyle} onClick={handleSaveExport}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
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

const popupOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const popupContentStyle = {
  backgroundColor: "#fff",
  padding: "50px 80px",
  borderRadius: "10px",
  textAlign: "center",
  width: "700px",
};

const popupTitleStyle = {
  fontSize: "40px",
  color: "#50464E",
  marginBottom: "20px",
};

const popupLabelStyle = {
  fontSize: "30px",
  color: "#50464E",
  display: "block",
  marginBottom: "15px",
};

const inputStyle = {
  marginLeft: "10px",
  padding: "5px 10px",
  borderRadius: "5px",
  border: "1px solid #A6785E",
  width: "100%",
};

const popupButtonRowStyle = {
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  gap: "20px",
};

const popupButtonStyle = {
  fontSize: "30px",
  backgroundColor: "#DEA93D",
  padding: "10px 20px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
};

export default AllErrorCorrectedPage;
