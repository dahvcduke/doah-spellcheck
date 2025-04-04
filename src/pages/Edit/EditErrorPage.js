import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../App.css"; 

const EditErrorsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedDocument } = location.state || { selectedDocument: "Document 1" };

  const [errorIndex, setErrorIndex] = useState(0);
  const [correctedErrors, setCorrectedErrors] = useState(1);
  const totalErrors = 2105; 
  const [manualEdit, setManualEdit] = useState("");

  const errorList = [
    {
      text: "Americanist art historian; first associate director of the Museum of Modern Art in New York. Abbott was born to Arthur Abbott and Flora Parkman (Abbott). After attending Dexter High School, Abbott graduated from Bowdin College with a bachelor's degree in science and attended graduate school at Harvard University in physics.",
      incorrectWord: "Americanist",
      suggestions: ["Americanism"],
      pastErrors: [],
      futureErrors: ["Bowdin", "Harvard"],
    },
    {
      text: "Americanism art historian; first associate director of the Museum of Modern Art in New York. Abbott was born to Arthur Abbott and Flora Parkman (Abbott). After attending Dexter High School, Abbott graduated from Bowdin College with a bachelor's degree in science and attended graduate school at Harvard University in physics.",
      incorrectWord: "Bowdin",
      suggestions: ["Bowden", "Bowdoin", "Boudin", "Bow din"],
      pastErrors: ["Americanism"],
      futureErrors: ["Harvard"],
    },
  ];

  const highlightText = (text, incorrectWord, pastErrors, futureErrors) => {
    let highlightedText = text;
    pastErrors.forEach((word) => {
      highlightedText = highlightedText.replace(
        new RegExp(`\\b${word}\\b`, "g"),
        `<span style='color:green; font-weight:bold;'>${word}</span>`
      );
    });
    highlightedText = highlightedText.replace(
      new RegExp(`\\b${incorrectWord}\\b`, "g"),
      `<span style='color:red; font-weight:bold;'>${incorrectWord}</span>`
    );
    futureErrors.forEach((word) => {
      highlightedText = highlightedText.replace(
        new RegExp(`\\b${word}\\b`, "g"),
        `<span style='color:orange; font-weight:bold;'>${word}</span>`
      );
    });
    return highlightedText;
  };

  const handleNextError = () => {
    if (errorIndex < errorList.length - 1) {
      setErrorIndex((prev) => prev + 1);
      setCorrectedErrors((prev) => prev + 1);
      setManualEdit("");
    } else {
      navigate("/all-error-corrected", { state: { selectedDocument } });
    }
  };  

  const handleBack = () => {
    if (errorIndex > 0) {
      setErrorIndex((prev) => prev - 1);
      setCorrectedErrors((prev) => prev - 1);
    } else {
      navigate("/error-process", { state: { selectedDocument } });
    }
  };

  const handleSkip = () => {
    if (errorIndex < errorList.length - 1) {
      setErrorIndex((prev) => prev + 1);
      setManualEdit("");
    } else {
      navigate("/all-error-corrected", { state: { selectedDocument } });
    }
  };

  return (
    <div style={{ backgroundColor: "#F0DFC3", fontFamily: "Proxima Nova", minHeight: "100vh", position: "relative", padding: "50px 100px", display: "flex", flexDirection: "column" }}>
      <h1 style={{ fontSize: "50px", fontWeight: "bold", color: "#A6785E", textAlign: "center", marginBottom: "50px" }}>Edit Document</h1>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "30px", color: "#50464E", marginBottom: "50px" }}>
        <p>Document: {selectedDocument}</p>
        <p>{correctedErrors}/{totalErrors} current error</p>
      </div>

      <div style={{ display: "flex", gap: "50px" }}>
        <div style={{ flex: 1, background: "white", padding: "20px", borderRadius: "10px", fontSize: "24px", lineHeight: "1.6", overflowWrap: "break-word", wordWrap: "break-word" }}>
          <p dangerouslySetInnerHTML={{ __html: highlightText(errorList[errorIndex].text, errorList[errorIndex].incorrectWord, errorList[errorIndex].pastErrors, errorList[errorIndex].futureErrors) }}></p>
        </div>

        <div style={{ flex: 1, fontSize: "30px", color: "#50464E" }}>
          <p>Error: {errorList[errorIndex].incorrectWord}</p>
          <p>Suggested words:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {errorList[errorIndex].suggestions.map((word, idx) => (
              <label key={idx} style={{ cursor: "pointer" }}>
                <input type="radio" name="suggestion" style={{ marginRight: "10px" }} onClick={() => setManualEdit(word)} />
                {word}
              </label>
            ))}
            <label style={{ cursor: "pointer" }}>
              <input type="radio" name="suggestion" style={{ marginRight: "10px" }} />
              Manual edit:
              <input type="text" value={manualEdit} onChange={(e) => setManualEdit(e.target.value)} style={{ marginLeft: "10px", padding: "5px 10px", borderRadius: "10px", border: "1px solid #A6785E" }} />
            </label>
            <div style={{ marginTop: "10px", textAlign: "right" }}>
              <button
                onClick={handleSkip}
                style={{ fontSize: "20px", backgroundColor: "#DEA93D", color: "#50464E", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "25px", marginTop: "50px" }}>
        <button style={{ fontSize: "30px", backgroundColor: "#DEA93D", color: "#50464E", padding: "10px 30px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "bold" }} onClick={handleBack}>Back</button>
        <button style={{ fontSize: "30px", backgroundColor: "#DEA93D", color: "#50464E", padding: "10px 30px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "bold" }} onClick={handleNextError}>Next</button>
      </div>
    </div>
  );
};

export default EditErrorsPage;
