import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext.jsx";
import { ShopProvider } from "./context/ShopContext.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
        <UserProvider> 
          <AuthProvider> 
            <ShopProvider>
            <App />
            </ShopProvider>
          </AuthProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
