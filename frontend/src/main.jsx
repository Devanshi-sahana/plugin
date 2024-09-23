import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Fallback from "./components/Fallback.jsx";
import Chatbot from "./components/Chatbot.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import '@fontsource/red-hat-display';


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Fallback>
      {" "}
      <Chatbot />
    </Fallback>
  </StrictMode>
);
