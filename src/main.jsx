import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

import AdminContextProvider from "./Context/AdminContext.jsx";
import DoctorContextProvider from "./Context/DoctorContext.jsx";
import AppContextProvider from "./Context/AppContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AdminContextProvider>
        <DoctorContextProvider>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </DoctorContextProvider>
      </AdminContextProvider>
    </BrowserRouter>
  </StrictMode>
);
