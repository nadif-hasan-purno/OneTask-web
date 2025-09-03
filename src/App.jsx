import { Provider } from "react-redux";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store from "./store";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import NavBar from "./components/NavBar";

function App() {
  const themes = [
    "light",
    "dark",
    "cupcake",
    "corporate",
    "emerald",
    "synthwave",
    "retro",
    "cyberpunk",
  ];

  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setCurrentTheme(savedTheme);
  }, []);

  const handleThemeChange = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    setCurrentTheme(theme);
  };

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen">
          <NavBar themes={themes} onThemeChange={handleThemeChange} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
