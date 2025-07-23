import React from "react";
import { useNavigate } from "react-router-dom";

const CreditsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "50px", fontFamily: "Proxima Nova", backgroundColor: "#F0DFC3", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "40px", color: "#A6785E", marginBottom: "10px" }}>About and Credits</h1>
      <p style={{ fontSize: "24px", color: "#50464E", lineHeight: "1.6" }}>
        This tool was developed at the Digital Art History and Visual Culture Research Lab at Duke University.
        It was intended to help the <i>Dictionary of Art Historians</i> to edit grammatical, syntactical, or other errors on its website.<br />
        The error detection workflow was developed in Python using language-tool-python.
        The Python workflow exports each dictionary entry (i.e. a historian) as a JSON file. The user of this tool should upload these JSON files to this website to process the edits. This website can handle up to 20 JSON files at once.
        The front-end interface was developed using React.<br />
        <br />
        Visit the project's GitHub{" "}
        <a
          href="https://github.com/dahvcduke/doah-spellcheck"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .<br /><br />

        Spell Checker Developers:<br />
        <ul style={{ listStyleType: "'– '", paddingLeft: "30px", marginTop: "1px" }}>
          <li>Bonnie Chen (UNC-Chapel Hill): front-end development<br /></li>
          <li>Jerry Zou (Duke University): spell check Python workflow and front-end development<br /></li>
          <li>Monet Shum (Duke University): spell check Python workflow<br /></li>
        </ul>
        Dictionary of Art Historians:<br />
        <ul style={{ listStyleType: "'– '", paddingLeft: "30px", marginTop: "1px" }}>
          <li>Lee Sorensen (Duke University Libraries)<br /></li>
          <li>Hannah Jacobs (Duke University Libraries)<br /></li>
        </ul>
        Acknowledgement:<br />
        <ul style={{ listStyleType: "'– '", paddingLeft: "30px", marginTop: "1px" }}>
          <li>Greg Baker (Duke University)<br /></li>
        </ul>
      </p>

      <button
        style={{
          fontSize: "20px",
          backgroundColor: "#DEA93D",
          color: "#50464E",
          padding: "10px 30px",
          borderRadius: "15px",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
        }}
        onClick={() => navigate("/")}
      >
        Go back to Homepage
      </button>
    </div>
  );
};

export default CreditsPage;
