import React from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";

const DataStoragePage = () => {
  const navigate = useNavigate();

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
      {/* Section: Editing History */}
      <div style={{ marginBottom: "50px" }}>
        <h1
          style={{
            fontSize: "50px",
            fontWeight: "bold",
            color: "#A6785E",
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          Editing History
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "25px",
            color: "#50464E",
            fontSize: "30px",
            paddingLeft: "40px",
            paddingRight: "40px",
          }}
        >
          <div style={{ marginLeft: "20px" }}>
            <p
              style={{ cursor: "pointer"}}
              onClick={() => navigate("/editing-history")}
            >
              Document 1
            </p>
            <div style={{ marginLeft: "30px" }}>
              <p style={{ marginLeft: "20px" }}>Line 19: “asoduhosa” to “jnsjd”</p>
              <p style={{ marginLeft: "20px" }}>Line 4: “is” to “are”</p>
              <p
                style={{
                  color: "#A6785E",
                  cursor: "pointer",
                  fontStyle: "italic",
                  marginLeft: "30px",
                  marginTop: "25px",
                }}
                onClick={() => navigate("/editing-history")}
              >
                Show more edits
              </p>
            </div>
          </div>
          <div style={{ marginLeft: "20px" }}>
            <p>Document 2</p>
            <div style={{ marginLeft: "30px" }}>
              <p style={{ marginLeft: "20px" }}>Line 19: “asoduhosa” to “jnsjd”</p>
              <p style={{ marginLeft: "20px" }}>Line 4: “is” to “are”</p>
              <p
                style={{
                  color: "#A6785E",
                  cursor: "pointer",
                  fontStyle: "italic",
                  marginLeft: "30px",
                  marginTop: "25px",
                }}
              >
                Show more edits
              </p>
            </div>
          </div>
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: "30px",
            color: "#A6785E",
            cursor: "pointer",
            fontStyle: "italic",
            marginBottom: "50px",
          }}
          onClick={() => navigate("/all-documents")}
        >
          Show all
        </p>
      </div>

      {/* Section: Uploaded Files */}
      <div style={{ marginBottom: "50px" }}>
        <h1
          style={{
            fontSize: "50px",
            fontWeight: "bold",
            color: "#A6785E",
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          Uploaded Files
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            justifyItems: "center",
            fontSize: "30px",
            color: "#50464E",
            marginBottom: "25px",
            columnGap: "120px",
          }}
        >
          <p>Document 1</p>
          <p>Document 2</p>
          <p>Document 3</p>
          <p>Document 4</p>
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: "30px",
            color: "#A6785E",
            cursor: "pointer",
            fontStyle: "italic",
            marginBottom: "25px",
          }}
          onClick={() => navigate("/all-documents")}
        >
          Show all
        </p>
      </div>

      {/* Section: Back Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "25px",
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
      </div>
    </div>
  );
};

export default DataStoragePage;
