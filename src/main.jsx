import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        richColors
        position="top-center"
        toastOptions={{
          classNames: {
            toast: "text-base px-6 py-4 rounded-xl",
            description: "text-sm mt-1",
            actionButton: "text-sm px-4 py-2",
            closeButton: "text-lg",
          },
        }} />
    </BrowserRouter>
  </StrictMode>
);
