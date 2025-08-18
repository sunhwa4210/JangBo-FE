import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import StorePage from "./pages/Store/StorePage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/store" element={<StorePage />} />
        <Route path="/store/:storeId" element={<StorePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
