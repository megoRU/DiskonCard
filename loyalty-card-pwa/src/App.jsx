import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import AddCardPage from "./pages/AddCardPage.jsx";
import { useServiceWorkerUpdate } from "./hooks/useServiceWorkerUpdate";
import "./App.css";

function App() {
  const [isEditMode, setIsEditMode] = useState(false);
  const { waitingWorker, reloadPage } = useServiceWorkerUpdate();

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
            }
          >
            <Route
              index
              element={
                <HomePage
                  isEditMode={isEditMode}
                  setIsEditMode={setIsEditMode}
                />
              }
            />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="add-card" element={<AddCardPage />} />
          </Route>
        </Routes>
      </Router>

      {waitingWorker && (
        <div className="update-notification">
          Доступно обновление.
          <button onClick={reloadPage} className="update-notification-button">
            Перезагрузить
          </button>
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;
