import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DataStoragePage from "./pages/Data/DataStoragePage";
import AllDocumentsPage from "./pages/Data/AllDocumentsPage";
import EditingHistoryPage from "./pages/Data/EditingHistoryPage";
import ChooseDocumentPage from "./pages/Edit/ChooseDocumentPage";
import ErrorProcessPage from "./pages/Edit/ErrorProcessPage";
import EditErrorPage from "./pages/Edit/EditErrorPage";
import AllErrorCorrectedPage from "./pages/Edit/AllErrorCorrectedPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/data-storage" element={<DataStoragePage />} />
        <Route path="/all-documents" element={<AllDocumentsPage />} />
        <Route path="/editing-history" element={<EditingHistoryPage />} />
        <Route path="/choose-document" element={<ChooseDocumentPage />} />
        <Route path="/error-process" element={<ErrorProcessPage />} />
        <Route path="/edit-error" element={<EditErrorPage />} />
        <Route path="/all-error-corrected" element={<AllErrorCorrectedPage />} />
      </Routes>
    </Router>
  );
}

export default App;
