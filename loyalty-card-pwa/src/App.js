import React, { useState } from 'react'; // Import useState
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import AddCardPage from './pages/AddCardPage';
import './App.css';

function App() {
  const [isEditMode, setIsEditMode] = useState(false); // Lifted state

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Pass isEditMode and setIsEditMode to Layout */}
          <Route path="/" element={<Layout isEditMode={isEditMode} setIsEditMode={setIsEditMode} />}>
            {/* Pass isEditMode and setIsEditMode to HomePage */}
            <Route index element={<HomePage isEditMode={isEditMode} setIsEditMode={setIsEditMode} />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="add-card" element={<AddCardPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
