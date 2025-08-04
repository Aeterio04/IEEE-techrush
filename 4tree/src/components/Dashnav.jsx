import React, { useState, useEffect } from 'react';
import './DashNav.css';

const DashNav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Logging out... See you soon! 👋');
      console.log('User logged out');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileButton = document.getElementById('profileButton');
      const dropdown = document.getElementById('profileDropdown');
      
      if (profileButton && dropdown && 
          !profileButton.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar-glass">
      <div className="nav-container">
        <div className="nav-content">
          {/* Logo */}
          <div className="logo-container">
            <div className="logo-hover">
              <div className="logo-icon floating-animation">
                <svg className="logo-svg" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <span className="logo-text">EcoConnect</span>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="profile-dropdown">
            <button 
              onClick={toggleProfileDropdown}
              className="profile-button"
              id="profileButton"
            >
              <div className="profile-avatar">
                <span className="avatar-initials">JD</span>
              </div>
              <span className="profile-name">John Doe</span>
              <svg 
                className={`dropdown-arrow ${isDropdownOpen ? 'rotate-180' : ''}`} 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                id="profileDropdown" 
                className="dropdown-menu dropdown-enter"
              >
                <div className="dropdown-content">
                  <a href="#" className="dropdown-item">
                    <svg className="dropdown-icon" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Help & Support
                  </a>
                  <hr className="dropdown-divider" />
                  <button 
                    onClick={handleLogout} 
                    className="dropdown-item logout-item"
                  >
                    <svg className="dropdown-icon" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashNav;