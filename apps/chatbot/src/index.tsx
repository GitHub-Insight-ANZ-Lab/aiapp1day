import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { initializeIcons } from "@fluentui/react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication, EventType, AccountInfo } from "@azure/msal-browser";

import "./index.css";

import Layout from "./pages/layout/Layout";
import Chat from "./pages/chat/Chat";
import Design from "./pages/design/Design";
import Translation from "./pages/translation/Translation";
import Vision from "./pages/vision/Vision";
import Speech from "./pages/speech/Speech";
import Seo from "./pages/seo/Seo";

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
          <Route path="/design" element={<Design />} />
          <Route path="/translation" element={<Translation />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/speech" element={<Speech />} />
          <Route path="/seo" element={<Seo />} />
        </Route>
      </Routes>
    </Router>
    </React.StrictMode>
);
