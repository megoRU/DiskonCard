import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom'; // Import NavLink
import { FiHome, FiSettings, FiPlusSquare } from 'react-icons/fi';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <main className="content">
        <Outlet /> {/* Nested routes will render here */}
      </main>
      <nav className="bottom-nav">
        <NavLink
          to="/"
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          end // Important for NavLink to match root path exactly
        >
          <FiHome />
          <span>Home</span>
        </NavLink>
        {/* Keep Link for add-card as it's styled as a button, not a typical nav item */}
        <Link to="/add-card" className="nav-item add-card-button">
          <FiPlusSquare /> {/* Removed size prop, will be controlled by CSS */}
        </Link>
        <NavLink
          to="/settings"
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <FiSettings />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;
