import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

function Header() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Job Board</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Jobs</Link>
          <Link to="/admin" className="nav-link">Admin</Link>
          {currentUser && (
            <button onClick={handleLogout} className="nav-link logout-button">
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
