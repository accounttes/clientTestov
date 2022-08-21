import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registration from "./components/Registration";
import Authorization from "./components/Authorization";
import People from "./components/People";
import MyPage from "./components/MyPage";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/auth" element={<Authorization />} />
        <Route path="/people" element={<People />} />
        <Route path="/account" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
