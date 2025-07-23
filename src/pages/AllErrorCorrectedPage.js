import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

// ✅ Updated helper function
function applyCorrectionsToAll(original, edited) {
  const correctedSentences = [];

  for (const [sentence] of Object.entries(original)) {
    const value = edited[sentence];

    let correctedSentence = sentence;

    if (Array.isArray(value)) {
      // Sort replacements in reverse order to preserve index integrity
      const replacements = [...value].sort((a, b) => b.start - a.start);

      for (const change of replacements) {
        const { start, end, replacement } = change;
        correctedSentence =
          correctedSentence.slice(0, start) + replacement + correctedSentence.slice(end);
      }
    }

    correctedSentences.push(correctedSentence);
  }

  return correctedSentences.join(" ");
}


const AllErrorCorrectedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedDocument, lastErrorIndex } = location.state || {
    selectedDocument: "Document 1",
    lastErrorIndex: 0,
  };

  const [showExportPopup, setShowExportPopup] = useState(false);
  const [fileName, setFileName] = useState("corrected_document");
  const [errorCount, setErrorCount] = useState(0);
  const [correctedSentences, setCorrectedSentences] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("uploadedJson");
    if (stored && selectedDocument) {
      const allJson = JSON.parse(stored);
      const json = allJson[selectedDocument];

      if (json) {
        let totalErrors = 0;
        Object.values(json).forEach((arr) => {
          if (Array.isArray(arr)) totalErrors += arr.length;
        });
        setErrorCount(totalErrors);
      }
    }
  }, [selectedDocument]);


  useEffect(() => {
    const originalJsonRaw = localStorage.getItem("originalJson");
    const editedJsonRaw = localStorage.getItem("editedJson");

    if (originalJsonRaw && editedJsonRaw) {
      try {
        const originalJsonAll = JSON.parse(originalJsonRaw);
        const editedJsonAll = JSON.parse(editedJsonRaw);

        const originalJson = originalJsonAll[selectedDocument];
        const editedJson = editedJsonAll[selectedDocument];

        if (originalJson && editedJson) {
          const cleaned = applyCorrectionsToAll(originalJson, editedJson);
          setCorrectedSentences(cleaned);
        }
      } catch (e) {
        console.error("Failed to parse JSON:", e);
      }
    }
  }, [selectedDocument]);

  const paragraphRef = React.useRef(null);

  const handleCopy = () => {
    if (paragraphRef.current) {
      const text = paragraphRef.current.innerText;
      navigator.clipboard.writeText(text).then(() => {
        alert("Cleaned document copied to clipboard!");
      }).catch((err) => {
        console.error("Copy failed:", err);
      });
    }
  };



  const handleBack = () => {
    navigate("/edit-error", {
      state: { selectedDocument, errorIndex: lastErrorIndex },
    });
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
    const originalJsonRaw = localStorage.getItem("originalJson");
    const editedJsonRaw = localStorage.getItem("editedJson");

    if (!originalJsonRaw || !editedJsonRaw) {
      alert("Missing original or edited data in localStorage.");
      return;
    }

    const originalJsonAll = JSON.parse(originalJsonRaw);
    const editedJsonAll = JSON.parse(editedJsonRaw);

    const originalJson = originalJsonAll[selectedDocument];
    const editedJson = editedJsonAll[selectedDocument];

    if (!originalJson || !editedJson) {
      alert("Missing data for selected document.");
      return;
    }

    const output = {};

    Object.entries(originalJson).forEach(([sentence]) => {
      const corrections = editedJson[sentence];

      if (Array.isArray(corrections) && corrections.length > 0) {
        output[sentence] = corrections;
      } else {
        output[sentence] = sentence;
      }
    });

    const fileContent = JSON.stringify(output, null, 2);
    const blob = new Blob([fileContent], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName || "corrected_document"}.json`;
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
        Review Edited Document
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
        <p>{errorCount} errors corrected</p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "25px",
          marginTop: "50px",
          flexWrap: "wrap",
        }}
      >
        <button style={buttonStyle} onClick={() => navigate("/error-process")}>
          Back to All Files
        </button>
        <button style={buttonStyle} onClick={handleBack}>
          Back to Editor
        </button>
        <button style={buttonStyle} onClick={handleHome}>
          Home
        </button>
        <button style={buttonStyle} onClick={handleExportClick}>
          Export
        </button>
      </div>


      {/* Cleaned paragraph display */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "50px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2
            style={{
              fontSize: "30px",
              marginBottom: "20px",
              color: "#50464E",
            }}
          >
            Cleaned Document
          </h2>
          <p
            style={{
              fontSize: "19px",
              marginBottom: "10px",
              fontWeight: "bold"
            }}
          >
            Highlight and copy the edited article content below to your own file editor.
          </p>
          <button
            onClick={handleCopy}
            style={{
              fontSize: "16px",
              backgroundColor: "#DEA93D",
              color: "#50464E",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Copy to Clipboard
          </button>
        </div>
        <p
          ref={paragraphRef}
          style={{ fontSize: "20px", lineHeight: "1.6", color: "#50464E" }}
        >
          {correctedSentences}
        </p>
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
              <button style={popupButtonStyle} onClick={handleCancelExport}>
                Cancel
              </button>
              <button style={popupButtonStyle} onClick={handleSaveExport}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
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
