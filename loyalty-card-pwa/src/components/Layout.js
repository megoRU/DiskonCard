import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { FiHome, FiSettings, FiPlusSquare } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import './Layout.css';

const Layout = () => {
  const { t } = useTranslation();

  return (
    <div className="layout">
      <main className="content">
        <Outlet /> {/* Nested routes will render here */}
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
        <Link to="/add-card" className="nav-item add-card-button" aria-label={t('nav.addCardLabel', 'Add Card')}> {/* Added aria-label for accessibility */}
          <FiPlusSquare />
        </Link>
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
