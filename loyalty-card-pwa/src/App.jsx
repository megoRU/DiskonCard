import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ThemeProvider} from './context/ThemeContext.jsx';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import AddCardPage from './pages/AddCardPage.jsx';
import {useServiceWorkerUpdate} from './hooks/useServiceWorkerUpdate';
import './App.css';

function App() {
  const [isEditMode, setIsEditMode] = useState(false);
  const {waitingWorker, reloadPage} = useServiceWorkerUpdate();

  return (
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout isEditMode={isEditMode} setIsEditMode={setIsEditMode}/>}>
              <Route index element={<HomePage isEditMode={isEditMode} setIsEditMode={setIsEditMode}/>}/>
              <Route path="settings" element={<SettingsPage/>}/>
              <Route path="add-card" element={<AddCardPage/>}/>
            </Route>
          </Routes>
        </Router>

        {waitingWorker && (
            <div style={{
              position: 'fixed',
              bottom: '60px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#444',
              color: '#fff',
              padding: '15px 30px', // больше паддингов
              borderRadius: '8px',
              zIndex: 1000,
              maxWidth: '480px', // увеличил ширину
              width: '90%',      // адаптивно
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
              Доступно обновление.
              <button
                  onClick={reloadPage}
                  style={{
                    marginLeft: 15,
                    padding: '7px 14px', // чуть больше кнопка
                    cursor: 'pointer',
                    backgroundColor: '#3f51b5',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '3px',
                    fontWeight: '600',
                  }}
              >
                Перезагрузить
              </button>
            </div>
        )}
      </ThemeProvider>
  );
}

export default App;