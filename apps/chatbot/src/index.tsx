import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { initializeIcons } from "@fluentui/react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication, EventType, AccountInfo } from "@azure/msal-browser";

import "./index.css";

import Layout from "./pages/layout/Layout";
import Chat from "./pages/chat/Chat";
import Vision from "./pages/vision/vision";
import Image from "./pages/image/Image";
import Translate from "./pages/translate/translate";

var layout;

layout = <Layout />;

initializeIcons();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Chat />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/image" element={<Image />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/translate" element={<Translate />} />
        </Route>
      </Routes>
    </Router>
    </React.StrictMode>
);
