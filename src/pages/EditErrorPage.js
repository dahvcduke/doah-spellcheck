import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

const EditErrorsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedDocument } = location.state || {};

  const [errorIndex, setErrorIndex] = useState(0);
  const [errorList, setErrorList] = useState([]);
  const [manualEdit, setManualEdit] = useState("");
  const [selectedWord, setSelectedWord] = useState("");
  const [editedSentences, setEditedSentences] = useState({});

  useEffect(() => {
    const jsonString = localStorage.getItem("uploadedJson");
    if (!jsonString) return;

    const json = JSON.parse(jsonString);
    const list = [];

    Object.entries(json).forEach(([sentence, errors]) => {
      errors.forEach(([start, end, suggestions]) => {
        list.push({
          sentence,
          start,
          end,
          suggestions,
          incorrectWord: sentence.slice(start, end),
          correctedWord: null,
        });
      });
    });

    setErrorList(list);
  }, []);

  useEffect(() => {
    localStorage.setItem("editedJson", JSON.stringify(editedSentences));
  }, [editedSentences]);

  const currentError = errorList[errorIndex];

  const applyCorrection = (correction) => {
    const updated = [...errorList];
    updated[errorIndex].correctedWord = correction;
    setErrorList(updated);
    setSelectedWord(correction);
    setManualEdit(correction);

    const { sentence, start, end } = currentError;

    const updates = editedSentences[sentence]?.filter(
      (entry) => !(entry.start === start && entry.end === end)
    ) || [];

    const newUpdates = [...updates, { start, end, replacement: correction }];
    const updatedSentences = {
      ...editedSentences,
      [sentence]: newUpdates,
    };

    setEditedSentences(updatedSentences);
  };

  const handleNext = () => {
    if (!selectedWord) {
      alert("Please select a suggestion or make a manual edit before continuing.");
      return;
    }

    if (errorIndex < errorList.length - 1) {
      setErrorIndex((prev) => prev + 1);
      setManualEdit("");
      setSelectedWord("");
    } else {
      navigate("/all-error-corrected", {
        state: {
          selectedDocument,
          lastErrorIndex: errorList.length - 1,
        },
      });
    }
  };

  const handleBack = () => {
    if (errorIndex > 0) {
      setErrorIndex((prev) => prev - 1);
      const prevError = errorList[errorIndex - 1];
      const prevSaved = editedSentences[prevError.sentence]?.find(
        (e) => e.start === prevError.start && e.end === prevError.end
      );
      if (prevSaved) {
        setManualEdit(prevSaved.replacement);
        setSelectedWord(prevSaved.replacement);
      } else {
        setManualEdit("");
        setSelectedWord("");
      }
    } else {
      navigate("/error-process", { state: { selectedDocument } });
    }
  };

  const handleSkip = () => {
    if (errorIndex < errorList.length - 1) {
      setErrorIndex((prev) => prev + 1);
      setManualEdit("");
      setSelectedWord("");
    } else {
      navigate("/all-error-corrected", {
        state: {
          selectedDocument,
          lastErrorIndex: errorList.length - 1,
        },
      });
    }
  };

  const getLineHTML = (sentence) => {
    const sentenceErrors = errorList.map((e, idx) => ({ ...e, idx })).filter(e => e.sentence === sentence);
    let segments = [];
    let lastIndex = 0;

    sentenceErrors.sort((a, b) => a.start - b.start).forEach((e) => {
      const { start, end, correctedWord, incorrectWord, idx } = e;

      segments.push(sentence.slice(lastIndex, start));

      const isPast = idx < errorIndex;
      const isCurrent = idx === errorIndex;
      const color = isPast ? "green" : isCurrent ? "red" : "orange";
      const content = isPast ? (correctedWord || incorrectWord) : incorrectWord;

      segments.push(`<span style="color:${color}; font-weight:bold;">${content}</span>`);
      lastIndex = end;
    });

    segments.push(sentence.slice(lastIndex));
    return segments.join("");
  };

  const getVisibleContext = () => {
    const allSentences = [...new Set(errorList.map(e => e.sentence))];
    const currSentence = currentError?.sentence;
    const currentIdx = allSentences.indexOf(currSentence);
    const range = allSentences.slice(Math.max(0, currentIdx - 1), currentIdx + 2);

    return range.map((line, idx) => (
      <p
        key={idx}
        dangerouslySetInnerHTML={{ __html: getLineHTML(line) }}
        style={{ fontSize: "24px", lineHeight: "1.6" }}
      />
    ));
  };

  if (!currentError) return null;

  return (
    <div style={{ backgroundColor: "#F0DFC3", fontFamily: "Proxima Nova", minHeight: "100vh", padding: "50px 100px", display: "flex", flexDirection: "column" }}>
      <h1 style={{ fontSize: "50px", fontWeight: "bold", color: "#A6785E", textAlign: "center", marginBottom: "50px" }}>Edit Document</h1>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "30px", color: "#50464E", marginBottom: "50px" }}>
        <p>Document: {selectedDocument}</p>
        <p>{errorIndex + 1}/{errorList.length} current error</p>
      </div>

      <div style={{ display: "flex", gap: "50px" }}>
        <div style={{ flex: 1, background: "white", padding: "20px", borderRadius: "10px", overflowWrap: "break-word", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "500px", maxHeight: "300px" }}>
          {getVisibleContext()}
        </div>

        <div style={{ flex: 1, fontSize: "30px", color: "#50464E", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <p>Error: <strong>{currentError.incorrectWord}</strong></p>
            <p>Suggested words:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {currentError.suggestions.map((word, idx) => (
                <label key={idx} style={{ cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="suggestion"
                    checked={selectedWord === word}
                    onChange={() => applyCorrection(word)}
                    style={{ marginRight: "10px" }}
                  />
                  {word}
                </label>
              ))}
              <label style={{ cursor: "pointer" }}>
                <input
                  type="radio"
                  name="suggestion"
                  checked={!currentError.suggestions.includes(selectedWord) && !!manualEdit}
                  onChange={() => applyCorrection(manualEdit)}
                  style={{ marginRight: "10px" }}
                />
                Manual edit:
                <input
                  type="text"
                  value={manualEdit}
                  onChange={(e) => {
                    const value = e.target.value;
                    setManualEdit(value);
                    setSelectedWord(value);

                    const { sentence, start, end } = currentError;
                    const updates = editedSentences[sentence]?.filter(
                      (entry) => !(entry.start === start && entry.end === end)
                    ) || [];

                    const newUpdates = [...updates, { start, end, replacement: value }];
                    const updatedSentences = {
                      ...editedSentences,
                      [sentence]: newUpdates,
                    };

                    setEditedSentences(updatedSentences);
                  }}
                  style={{
                    marginLeft: "10px",
                    padding: "5px 10px",
                    borderRadius: "10px",
                    border: "1px solid #A6785E",
                  }}
                />
              </label>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
            <button onClick={handleSkip} style={skipButtonStyle}>Skip</button>
            <div style={{ display: "flex", gap: "20px" }}>
              <button style={navButtonStyle} onClick={handleBack}>Back</button>
              <button style={navButtonStyle} onClick={handleNext}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const navButtonStyle = {
  fontSize: "30px",
  backgroundColor: "#DEA93D",
  color: "#50464E",
  padding: "10px 30px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
};

const skipButtonStyle = {
  fontSize: "20px",
  backgroundColor: "#DEA93D",
  color: "#50464E",
  padding: "8px 20px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
};

export default EditErrorsPage;
