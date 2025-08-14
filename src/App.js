import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import MarketPage from "./pages/Market/MarketPage.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/market" element={<MarketPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
