import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ChooseDocumentPage from "./pages/ChooseDocumentPage";
import ErrorProcessPage from "./pages//ErrorProcessPage";
import EditErrorPage from "./pages/EditErrorPage";
import AllErrorCorrectedPage from "./pages/AllErrorCorrectedPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/choose-document" element={<ChooseDocumentPage />} />
        <Route path="/error-process" element={<ErrorProcessPage />} />
        <Route path="/edit-error" element={<EditErrorPage />} />
        <Route path="/all-error-corrected" element={<AllErrorCorrectedPage />} />
      </Routes>
    </Router>
  );
}

export default App;
