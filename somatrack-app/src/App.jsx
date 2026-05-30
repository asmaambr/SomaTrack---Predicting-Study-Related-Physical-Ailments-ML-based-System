/**
 * SomaTrack — App.jsx
 * Root component. Manages routing between pages and passes shared state.
 *
 * Pages:
 *   home      → HomePage
 *   form      → FormPage   (multi-step risk questionnaire)
 *   loading   → LoadingPage
 *   results   → ResultsPage
 *   pomodoro  → PomodoroPage
 */

import { useState } from "react";

// Import pages
import HomePage     from "./HomePage.jsx";
import FormPage     from "./FormPage.jsx";
import LoadingPage  from "./LoadingPage.jsx";
import ResultsPage  from "./ResultsPage.jsx";
import PomodoroPage from "./PomodoroPage.jsx";

// Import shared layout
import { Navbar } from "./components.jsx";

// Import API helpers
import { getPrediction } from "./api.js";

// Google font
const fontLink = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap";

export default function App() {
  const [page,    setPage]    = useState("home");   // home | form | loading | results | pomodoro
  const [results, setResults] = useState(null);
  const [error,   setError]   = useState("");

  // Pages that show the top navbar
  const showNav = ["home", "form", "results", "pomodoro"].includes(page);

  const navigate = (target) => {
    // When navigating to form, reset results
    if (target === "form") {
      setResults(null);
      setError("");
    }
    setPage(target);
  };

  const handleFormSubmit = async (formData) => {
    setError("");
    setPage("loading");
    try {
      const res = await getPrediction(formData);
      setResults(res);
    } catch (err) {
      console.error("API error:", err);
      setResults(null);
      setError(err instanceof Error ? err.message : "Unable to reach the local model server.");
    }
    setPage("results");
  };

  return (
    <>
      {/* Google Fonts */}
      <link href={fontLink} rel="stylesheet" />

      {/* Global resets */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FAFDF7; }
        input:focus { border-color: #52B788 !important; }
        button:focus-visible { outline: 3px solid #4CC9F0; outline-offset: 2px; }
      `}</style>

      {/* Navbar (hidden on loading screen) */}
      {showNav && (
        <Navbar activePage={page} onNavigate={navigate} />
      )}

      {/* Page rendering */}
      {page === "home"     && <HomePage     onStart={() => navigate("form")} onNavigate={navigate} />}
      {page === "form"     && <FormPage     onResults={handleFormSubmit} />}
      {page === "loading"  && <LoadingPage  />}
      {page === "results"  && <ResultsPage  results={results} error={error} onRestart={() => navigate("home")} onRetry={() => navigate("form")} />}
      {page === "pomodoro" && <PomodoroPage />}
    </>
  );
}
