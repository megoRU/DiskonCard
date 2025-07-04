import React, {useState} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {ThemeProvider} from "./context/ThemeContext.jsx";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import AddCardPage from "./pages/AddCardPage.jsx";
import "./App.css";
import '@khmyznikov/pwa-install';

function App() {
    const [isEditMode, setIsEditMode] = useState(false);

    return (
        <ThemeProvider>
            <Router>
                <pwa-install
                    description="Сервис для удобного хранения бонусных карт"
                    manifest-url="/manifest.json"
                    icon="/icon.png">
                </pwa-install>
                <Routes>

                    <Route
                        path="/"
                        element={
                            <Layout isEditMode={isEditMode} setIsEditMode={setIsEditMode}/>
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
                        <Route path="settings" element={<SettingsPage/>}/>
                        <Route path="add-card" element={<AddCardPage/>}/>
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
