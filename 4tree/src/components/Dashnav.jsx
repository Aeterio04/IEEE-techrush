import React, { useState, useEffect, useRef } from 'react';
import './Dashnav.css';

const Dashnav = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const navRef = useRef(null);

  const toggleDropdown = (itemId) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  const handleNotificationClick = (notificationId) => {
    console.log(`Notification ${notificationId} clicked`);
    setActiveDropdown(null);
  };

  const markAllRead = () => {
    setUnreadNotifications(0);
    console.log('All notifications marked as read');
  };

  const handleProfileAction = (action) => {
    console.log(`Profile action: ${action}`);
    setActiveDropdown(null);
    
    switch(action) {
      case 'help':
        alert('Opening help & support...');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      // In a Django app, you would typically redirect to the logout URL
      // window.location.href = '/accounts/logout/';
      alert('Logging out... This would redirect to login page in a real application.');
    }
    setActiveDropdown(null);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdowns on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && activeDropdown) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [activeDropdown]);

  return (
    <nav className="dashboard-navbar" ref={navRef}>
      {/* Left Side - Logo */}
      <div className="navbar-left">
        <div className="logo-container">
          <div className="logo">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div className="logo-text">
            Hope<span className="highlight">NGO</span>
          </div>
        </div>
      </div>

      {/* Right Side - Notifications & Profile */}
      <div className="navbar-right">
        {/* Notifications */}
        <div className={`nav-item ${activeDropdown === 'notificationItem' ? 'active' : ''}`} id="notificationItem">
          <button className="notification-btn" onClick={() => toggleDropdown('notificationItem')}>
            <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            {unreadNotifications > 0 && (
              <span className="notification-badge">{unreadNotifications}</span>
            )}
          </button>
          
          <div className="dropdown-menu notification-dropdown">
            <div className="dropdown-header">
              <span>Notifications</span>
              <span className="mark-all-read" onClick={markAllRead}>Mark all read</span>
            </div>
            
            <div className="notification-item" onClick={() => handleNotificationClick(1)}>
              <div className="notification-icon success">
                <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <div className="notification-content">
                <div className="notification-title">Donation Received</div>
                <div className="notification-text">New donation of $500 from John Smith for education program</div>
                <div className="notification-time">2 minutes ago</div>
              </div>
            </div>
            
            <div className="notification-item" onClick={() => handleNotificationClick(2)}>
              <div className="notification-icon warning">
                <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
              </div>
              <div className="notification-content">
                <div className="notification-title">Low Inventory Alert</div>
                <div className="notification-text">Medical supplies running low at Community Center #3</div>
                <div className="notification-time">1 hour ago</div>
              </div>
            </div>
            
            <div className="notification-item" onClick={() => handleNotificationClick(3)}>
              <div className="notification-icon info">
                <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              </div>
              <div className="notification-content">
                <div className="notification-title">Volunteer Registration</div>
                <div className="notification-text">5 new volunteers registered for weekend food drive</div>
                <div className="notification-time">3 hours ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className={`nav-item ${activeDropdown === 'profileItem' ? 'active' : ''}`} id="profileItem">
          <div className="profile-icon" onClick={() => toggleDropdown('profileItem')}>
            <svg fill="white" viewBox="0 0 24 24" width="24" height="24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={() => handleProfileAction('help')}>
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
              Help & Support
            </div>
            
            <div className="dropdown-divider"></div>
            
            <div className="dropdown-item" onClick={handleLogout} style={{ color: '#EF4444' }}>
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              Logout
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Dashnav;