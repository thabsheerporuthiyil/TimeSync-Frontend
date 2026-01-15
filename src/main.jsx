import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext.jsx";
import { ShopProvider } from "./context/ShopContext.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NotificationProvider } from "./context/NotificationContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <UserProvider>
        <NotificationProvider>
          <ShopProvider>
            <App />
          </ShopProvider>
        </NotificationProvider>
      </UserProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
