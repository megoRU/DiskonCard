import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FiHome, FiSettings, FiPlusSquare, FiTrash2, FiX } from 'react-icons/fi'; // Added FiTrash2, FiX
import { useTranslation } from 'react-i18next';
import './Layout.css';

// Accept isEditMode and setIsEditMode as props
const Layout = ({ isEditMode, setIsEditMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCentralButtonClick = () => {
    if (isEditMode) {
      // In Edit Mode, the central button becomes a "Cancel Edit Mode" button
      setIsEditMode(false);
      // Optionally, add logic for "delete selected cards" if that's the primary action
      // For now, it just exits edit mode.
      console.log("Exited edit mode via central button");
    } else {
      // Normal mode: navigate to add card page
      navigate('/add-card');
    }
  };

  return (
    <div className="layout">
      <main className="content">
        <Outlet />
      </main>
      <nav className="bottom-nav">
        <NavLink
          to="/"
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          end
        >
          <FiHome />
          <span>{t('nav.home')}</span>
        </NavLink>

        <button // Changed from Link to button for more control
          onClick={handleCentralButtonClick}
          className={`nav-item add-card-button ${isEditMode ? 'edit-mode-active' : ''}`}
          aria-label={isEditMode ? t('nav.cancelEditModeLabel', 'Cancel Edit Mode') : t('nav.addCardLabel', 'Add Card')}
        >
          {isEditMode ? <FiX /> : <FiPlusSquare />}
        </button>

        <NavLink
          to="/settings"
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <FiSettings />
          <span>{t('nav.settings')}</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;
