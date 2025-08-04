import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('pending');
  const [donations, setDonations] = useState({
    pending: [],
    accepted: [],
    rejected: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  const fetchDonations = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('https://api.yourbackend.com/donations');
      if (!response.ok) {
        throw new Error('Failed to fetch donations');
      }
      const data = await response.json();
      setDonations(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Error fetching donations:', err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const toggleProfileDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Logging out... See you soon! 👋');
      console.log('Admin logged out');
      // Add logout logic here
    }
  };

  const switchTab = (tabName) => {
    setCurrentTab(tabName);
  };

  const acceptDonation = async (id) => {
    try {
      const response = await fetch(`https://api.yourbackend.com/donations/${id}/accept`, {
        method: 'PUT'
      });
      if (!response.ok) {
        throw new Error('Failed to accept donation');
      }
      fetchDonations(); // Refresh data
      alert('Donation accepted successfully! ✅');
    } catch (err) {
      alert('Error accepting donation: ' + err.message);
      console.error(err);
    }
  };

  const rejectDonation = async (id) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      try {
        const response = await fetch(`https://api.yourbackend.com/donations/${id}/reject`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason })
        });
        if (!response.ok) {
          throw new Error('Failed to reject donation');
        }
        fetchDonations(); // Refresh data
        alert('Donation rejected successfully! ❌');
      } catch (err) {
        alert('Error rejecting donation: ' + err.message);
        console.error(err);
      }
    }
  };

  const markAsSubmitted = async (id) => {
    try {
      const response = await fetch(`https://api.yourbackend.com/donations/${id}/submit`, {
        method: 'PUT'
      });
      if (!response.ok) {
        throw new Error('Failed to mark as submitted');
      }
      fetchDonations(); // Refresh data
      alert('Donation marked as submitted! 📦');
    } catch (err) {
      alert('Error marking as submitted: ' + err.message);
      console.error(err);
    }
  };

  const updateCounts = () => {
    return {
      pending: donations.pending.length,
      accepted: donations.accepted.length,
      submitted: donations.accepted.filter(d => d.submitted).length,
      rejected: donations.rejected.length
    };
  };

  const renderDonations = () => {
    const donationList = donations[currentTab];
    const counts = updateCounts();

    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading donations...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-message">
          <p>Error loading donations: {error}</p>
          <button onClick={fetchDonations} className="retry-button">
            Retry
          </button>
        </div>
      );
    }

    if (donationList.length === 0) {
      return (
        <div className="empty-state">
          <svg className="empty-icon" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-2 2m0 0l-2-2m2 2v6"></path>
          </svg>
          <p>No {currentTab} donations found</p>
        </div>
      );
    }

    return donationList.map(donation => {
      if (currentTab === 'pending') {
        return (
          <div key={donation.id} className="donation-card">
            <div className="donation-header">
              <div className="donation-info">
                <h3>{donation.item}</h3>
                <p>by {donation.donor}</p>
                <p className="donor-email">{donation.email}</p>
              </div>
              <span className="status-badge pending">Pending</span>
            </div>
            <div className="donation-details">
              <div className="detail-item">
                <span>Quantity:</span>
                <span>{donation.quantity}</span>
              </div>
              <div className="detail-item">
                <span>Date:</span>
                <span>{donation.date}</span>
              </div>
              <div className="detail-item full-width">
                <span>Location:</span>
                <span>{donation.location}</span>
              </div>
            </div>
            <p className="donation-description">{donation.description}</p>
            <div className="donation-actions">
              <button onClick={() => acceptDonation(donation.id)} className="action-button accept">
                Accept
              </button>
              <button onClick={() => rejectDonation(donation.id)} className="action-button reject">
                Reject
              </button>
            </div>
          </div>
        );
      } else if (currentTab === 'accepted') {
        return (
          <div key={donation.id} className="donation-card">
            <div className="donation-header">
              <div className="donation-info">
                <h3>{donation.item}</h3>
                <p>by {donation.donor}</p>
                <p className="donor-email">{donation.email}</p>
              </div>
              <span className={`status-badge ${donation.submitted ? 'submitted' : 'accepted'}`}>
                {donation.submitted ? 'Submitted' : 'Accepted'}
              </span>
            </div>
            <div className="donation-details">
              <div className="detail-item">
                <span>Quantity:</span>
                <span>{donation.quantity}</span>
              </div>
              <div className="detail-item">
                <span>Date:</span>
                <span>{donation.date}</span>
              </div>
              <div className="detail-item full-width">
                <span>Location:</span>
                <span>{donation.location}</span>
              </div>
            </div>
            <p className="donation-description">{donation.description}</p>
            {!donation.submitted ? (
              <button onClick={() => markAsSubmitted(donation.id)} className="action-button submit">
                Mark as Submitted
              </button>
            ) : (
              <div className="submitted-indicator">
                <svg className="check-icon" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Item has been submitted
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div key={donation.id} className="donation-card">
            <div className="donation-header">
              <div className="donation-info">
                <h3>{donation.item}</h3>
                <p>by {donation.donor}</p>
                <p className="donor-email">{donation.email}</p>
              </div>
              <span className="status-badge rejected">Rejected</span>
            </div>
            <div className="donation-details">
              <div className="detail-item">
                <span>Quantity:</span>
                <span>{donation.quantity}</span>
              </div>
              <div className="detail-item">
                <span>Date:</span>
                <span>{donation.date}</span>
              </div>
              <div className="detail-item full-width">
                <span>Location:</span>
                <span>{donation.location}</span>
              </div>
            </div>
            <p className="donation-description">{donation.description}</p>
            <div className="rejection-reason">
              <p>Rejection Reason:</p>
              <p>{donation.reason}</p>
            </div>
          </div>
        );
      }
    });
  };

  const counts = updateCounts();

  return (
    <div className="admin-dashboard">
      {/* Background decorative elements */}
      <div className="background-elements">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="navbar-glass">
        <div className="nav-container">
          <div className="nav-content">
            {/* Logo */}
            <div className="logo-container">
              <div className="logo-hover">
                <div className="logo-icon floating-animation">
                  <svg className="logo-svg" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <div>
                  <span className="logo-text">EcoConnect</span>
                  <span className="logo-subtext">Admin Panel</span>
                </div>
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
                  <span className="avatar-initials">AD</span>
                </div>
                <span className="profile-name">Admin User</span>
                <svg 
                  className={`dropdown-arrow ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div id="profileDropdown" className="dropdown-menu">
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
                      className="dropdown-item logout"
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

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section slide-in">
          <h1>Admin Dashboard 🛡️</h1>
          <p>Manage donation requests and track submissions</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {/* Pending Requests */}
          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Pending Requests</p>
                <p className="stat-value">{counts.pending}</p>
                <p className="stat-status pending">Awaiting review</p>
              </div>
              <div className="stat-icon pending">
                <svg className="stat-svg" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Accepted Donations */}
          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Accepted Donations</p>
                <p className="stat-value">{counts.accepted}</p>
                <p className="stat-status accepted">Approved items</p>
              </div>
              <div className="stat-icon accepted">
                <svg className="stat-svg" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Items Submitted */}
          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Items Submitted</p>
                <p className="stat-value">{counts.submitted}</p>
                <p className="stat-status submitted">Received items</p>
              </div>
              <div className="stat-icon submitted">
                <svg className="stat-svg" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Total Rejected */}
          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Rejected Requests</p>
                <p className="stat-value">{counts.rejected}</p>
                <p className="stat-status rejected">Declined items</p>
              </div>
              <div className="stat-icon rejected">
                <svg className="stat-svg" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Management Section */}
        <div className="management-section slide-in">
          <h2>Donation Management</h2>
          
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              onClick={() => switchTab('pending')} 
              className={`tab-button ${currentTab === 'pending' ? 'active' : ''}`}
            >
              Pending Requests
            </button>
            <button 
              onClick={() => switchTab('accepted')} 
              className={`tab-button ${currentTab === 'accepted' ? 'active' : ''}`}
            >
              Accepted Donations
            </button>
            <button 
              onClick={() => switchTab('rejected')} 
              className={`tab-button ${currentTab === 'rejected' ? 'active' : ''}`}
            >
              Rejected Requests
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            <div className="donations-list">
              {renderDonations()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;