import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const App = () => {
  const [ngos, setNgos] = useState([]);
  const [currentTab, setCurrentTab] = useState('addNgo');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalNgos: 0,
    pendingApprovals: 0,
    approvedNgos: 0,
    totalRequests: 0
  });

  // Django API base URL - adjust according to your Django setup
  const API_BASE_URL = 'http://localhost:8000/api';

  // Fetch NGOs from Django backend
  const fetchNgos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/ngos/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // If using JWT
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setNgos(data);
        updateStats(data);
      } else {
        console.error('Failed to fetch NGOs');
      }
    } catch (error) {
      console.error('Error fetching NGOs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new NGO
  const createNgo = async (ngoData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/ngos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(ngoData),
      });

      if (response.ok) {
        const newNgo = await response.json();
        setNgos(prev => [...prev, newNgo]);
        updateStats([...ngos, newNgo]);
        return { success: true, data: newNgo };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error('Error creating NGO:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update NGO status (approve/reject)
  const updateNgoStatus = async (ngoId, status, rejectionReason = null) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/ngos/${ngoId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          status,
          rejection_reason: rejectionReason 
        }),
      });

      if (response.ok) {
        const updatedNgo = await response.json();
        setNgos(prev => prev.map(ngo => 
          ngo.id === ngoId ? updatedNgo : ngo
        ));
        updateStats(ngos.map(ngo => ngo.id === ngoId ? updatedNgo : ngo));
        return { success: true, data: updatedNgo };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error('Error updating NGO status:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete NGO
  const deleteNgo = async (ngoId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/ngos/${ngoId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setNgos(prev => prev.filter(ngo => ngo.id !== ngoId));
        updateStats(ngos.filter(ngo => ngo.id !== ngoId));
        return { success: true };
      } else {
        return { success: false, error: 'Failed to delete NGO' };
      }
    } catch (error) {
      console.error('Error deleting NGO:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update statistics
  const updateStats = (ngoList) => {
    const totalNgos = ngoList.length;
    const pendingApprovals = ngoList.filter(ngo => ngo.status === 'pending').length;
    const approvedNgos = ngoList.filter(ngo => ngo.status === 'approved').length;
    
    setStats({
      totalNgos,
      pendingApprovals,
      approvedNgos,
      totalRequests: totalNgos
    });
  };

  // Handle form submission
  const handleNgoSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const ngoData = {
      name: formData.get('ngoName'),
      mobile: formData.get('mobile'),
      email: formData.get('email'),
      city: formData.get('city'),
      address: formData.get('address'),
      status: 'pending'
    };

    const result = await createNgo(ngoData);
    
    if (result.success) {
      event.target.reset();
      alert(`🎉 NGO "${result.data.name}" has been registered successfully!\n\nYour registration is now pending admin approval. You will receive an email confirmation once approved.\n\nThank you for joining the EcoConnect platform! 🌟`);
    } else {
      alert(`Error: ${result.error.message || 'Failed to register NGO'}`);
    }
  };

  // Handle NGO approval
  const handleApproveNgo = async (ngoId) => {
    const result = await updateNgoStatus(ngoId, 'approved');
    
    if (result.success) {
      alert(`${result.data.name} has been approved successfully! ✅`);
    } else {
      alert(`Error: ${result.error.message || 'Failed to approve NGO'}`);
    }
  };

  // Handle NGO rejection
  const handleRejectNgo = async (ngoId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      const ngo = ngos.find(n => n.id === ngoId);
      const result = await updateNgoStatus(ngoId, 'rejected', reason);
      
      if (result.success) {
        alert(`${ngo.name} has been rejected. Reason: ${reason} ❌`);
      } else {
        alert(`Error: ${result.error.message || 'Failed to reject NGO'}`);
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      alert('Thank you for using the EcoConnect NGO Registration Portal! See you soon! 🌟');
      // Redirect to login page or handle logout logic
      window.location.href = '/login';
    }
  };

  // Filter NGOs by status
  const getPendingNgos = () => ngos.filter(ngo => ngo.status === 'pending');
  const getApprovedNgos = () => ngos.filter(ngo => ngo.status === 'approved');

  // Load data on component mount
  useEffect(() => {
    fetchNgos();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="app-container">
      {/* Background decorative elements */}
      <div className="background-decorations">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-inner">
            {/* Logo */}
            <div className="logo-section">
              <div className="logo-container">
                <div className="logo-icon">
                  <svg className="heart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
                <div className="logo-text">
                  <span className="logo-title">EcoConnect</span>
                  <span className="logo-subtitle">Admin Portal</span>
                </div>
              </div>
            </div>

            {/* Notifications & Profile */}
            <div className="nav-actions">
              {/* Notifications Bell */}
              <div className="notification-bell">
                <button className="bell-button">
                  <svg className="bell-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM11 19H6.5a2.5 2.5 0 010-5H11m0 5v-5m0 5h5m-5-5V9a3 3 0 116 0v5m-6 0h6"></path>
                  </svg>
                  <span className="notification-badge">{stats.pendingApprovals}</span>
                </button>
              </div>

              {/* Profile Dropdown */}
              <div className="profile-dropdown-container">
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)} 
                  className="profile-button"
                >
                  <svg className="profile-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-content">
                      <a href="#" className="dropdown-item">
                        <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Help & Support
                      </a>
                      <hr className="dropdown-divider" />
                      <button onClick={handleLogout} className="dropdown-item logout-item">
                        <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome, Admin! 👨‍💼</h1>
          <p className="welcome-subtitle">Managing NGOs and overseeing the donation ecosystem</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {/* Total NGOs */}
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total NGOs</p>
                <p className="stat-value">{stats.totalNgos}</p>
                <p className="stat-description blue">Registered organizations</p>
              </div>
              <div className="stat-icon blue">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Pending Approvals</p>
                <p className="stat-value">{stats.pendingApprovals}</p>
                <p className="stat-description orange">Awaiting review</p>
              </div>
              <div className="stat-icon orange">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Approved NGOs */}
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Approved NGOs</p>
                <p className="stat-value">{stats.approvedNgos}</p>
                <p className="stat-description green">Active organizations</p>
              </div>
              <div className="stat-icon green">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Total Requests */}
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Requests</p>
                <p className="stat-value">{stats.totalRequests}</p>
                <p className="stat-description purple">Active requests</p>
              </div>
              <div className="stat-icon purple">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Management Section */}
        <div className="management-section">
          <h2 className="section-title">Admin Management Dashboard</h2>
          
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              onClick={() => setCurrentTab('addNgo')} 
              className={`tab-button ${currentTab === 'addNgo' ? 'active' : ''}`}
            >
              Add NGO Registration
            </button>
            <button 
              onClick={() => setCurrentTab('pendingRequests')} 
              className={`tab-button ${currentTab === 'pendingRequests' ? 'active' : ''}`}
            >
              Pending Requests
            </button>
            <button 
              onClick={() => setCurrentTab('approvedRequests')} 
              className={`tab-button ${currentTab === 'approvedRequests' ? 'active' : ''}`}
            >
              Approved Requests
            </button>
          </div>

          {/* Add NGO Tab */}
          {currentTab === 'addNgo' && (
            <div className="tab-content">
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
                    NGO Registration Form
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    Register your NGO to join the EcoConnect platform and start receiving donations
                  </p>
                </div>

                <form 
                  onSubmit={handleNgoSubmit} 
                  className="form-container" 
                  style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="form-group">
                    <label className="form-label">NGO Name *</label>
                    <input type="text" name="ngoName" className="form-input" placeholder="Enter your NGO name" required />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Mobile Number *</label>
                      <input type="tel" name="mobile" className="form-input" placeholder="+91 98765 43210" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input type="email" name="email" className="form-input" placeholder="ngo@example.com" required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input type="text" name="city" className="form-input" placeholder="Enter your city name" required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Complete Address *</label>
                    <textarea name="address" className="form-textarea" rows="4" placeholder="Enter your complete address with landmarks and postal code" required></textarea>
                  </div>

                  <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.5rem', padding: '1rem', margin: '1.5rem 0' }}>
                    <h4 style={{ color: '#0369a1', fontWeight: '600', marginBottom: '0.5rem' }}>📋 Registration Process</h4>
                    <ul style={{ color: '#0369a1', fontSize: '0.875rem', marginLeft: '1rem' }}>
                      <li>Your NGO registration will be submitted for admin review</li>
                      <li>Admin will verify your details and approve the registration</li>
                      <li>Once approved, you can start receiving donations through the platform</li>
                      <li>You will receive email confirmation upon approval</li>
                    </ul>
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn" 
                    style={{ width: '100%', marginTop: '1rem' }}
                    disabled={loading}
                  >
                    {loading ? '⏳ Submitting...' : '🚀 Submit NGO Registration'}
                  </button>
                </form>

                {/* Registered NGOs List */}
                <div style={{ marginTop: '2rem' }}>
                  {ngos.length > 0 && (
                    <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                        📋 Registered NGOs ({ngos.length})
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {ngos.map(ngo => (
                          <div 
                            key={ngo.id} 
                            style={{ 
                              border: '1px solid #e5e7eb', 
                              borderRadius: '0.5rem', 
                              padding: '1.5rem', 
                              borderLeft: `4px solid ${ngo.status === 'pending' ? '#f59e0b' : '#10b981'}`
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                              <div>
                                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>{ngo.name}</h4>
                                <p style={{ color: '#4b5563', margin: '0.25rem 0', fontSize: '0.875rem' }}>📱 {ngo.mobile}</p>
                                <p style={{ color: '#4b5563', margin: '0.25rem 0', fontSize: '0.875rem' }}>📧 {ngo.email}</p>
                                <p style={{ color: '#4b5563', margin: '0.25rem 0', fontSize: '0.875rem' }}>🏙️ {ngo.city}</p>
                                <p style={{ color: '#2563eb', fontWeight: '500', fontSize: '0.875rem' }}>📅 Registered: {new Date(ngo.created_at || Date.now()).toLocaleDateString()}</p>
                              </div>
                              <span 
                                style={{ 
                                  fontSize: '0.75rem', 
                                  fontWeight: '500', 
                                  padding: '0.25rem 0.625rem', 
                                  borderRadius: '9999px',
                                  backgroundColor: ngo.status === 'approved' ? '#dcfce7' : '#fed7aa',
                                  color: ngo.status === 'approved' ? '#166534' : '#9a3412'
                                }}
                              >
                                {ngo.status.charAt(0).toUpperCase() + ngo.status.slice(1)}
                              </span>
                            </div>
                            <p style={{ color: '#374151', marginBottom: '1rem', fontSize: '0.875rem' }}>📍 {ngo.address}</p>
                            {ngo.status === 'pending' ? (
                              <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '0.5rem', padding: '0.75rem' }}>
                                <p style={{ color: '#92400e', fontWeight: '500' }}>⏳ Registration is pending admin approval</p>
                              </div>
                            ) : (
                              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.5rem', padding: '0.75rem' }}>
                                <p style={{ color: '#15803d', fontWeight: '500' }}>✅ NGO is approved and can receive donations</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pending Requests Tab */}
          {currentTab === 'pendingRequests' && (
            <div className="tab-content">
              <div className="ngo-list">
                {getPendingNgos().length === 0 ? (
                  <div className="empty-state">
                    <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="empty-text">No pending requests</p>
                  </div>
                ) : (
                  getPendingNgos().map(ngo => (
                    <div key={ngo.id} className="ngo-card pending">
                      <div className="ngo-header">
                        <div className="ngo-info">
                          <h3 className="ngo-name">{ngo.name}</h3>
                          <p className="ngo-details">📱 {ngo.mobile}</p>
                          <p className="ngo-details">📧 {ngo.email}</p>
                          <p className="ngo-details">🏙️ {ngo.city}</p>
                          <p className="ngo-contact">📅 Registered: {new Date(ngo.created_at || Date.now()).toLocaleDateString()}</p>
                        </div>
                        <span className="status-badge orange">Pending</span>
                      </div>
                      <p className="ngo-address">📍 {ngo.address}</p>
                      <div className="ngo-actions">
                        <button 
                          onClick={() => handleApproveNgo(ngo.id)} 
                          className="approve-btn"
                          disabled={loading}
                        >
                          ✅ Approve
                        </button>
                        <button 
                          onClick={() => handleRejectNgo(ngo.id)} 
                          className="reject-btn"
                          disabled={loading}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Approved Requests Tab */}
          {currentTab === 'approvedRequests' && (
            <div className="tab-content">
              <div className="ngo-list">
                {getApprovedNgos().length === 0 ? (
                  <div className="empty-state">
                    <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="empty-text">No approved NGOs yet</p>
                  </div>
                ) : (
                  getApprovedNgos().map(ngo => (
                    <div key={ngo.id} className="ngo-card approved">
                      <div className="ngo-header">
                        <div className="ngo-info">
                          <h3 className="ngo-name">{ngo.name}</h3>
                          <p className="ngo-details">📱 {ngo.mobile}</p>
                          <p className="ngo-details">📧 {ngo.email}</p>
                          <p className="ngo-details">🏙️ {ngo.city}</p>
                          <p className="ngo-contact">📅 Approved: {new Date(ngo.updated_at || Date.now()).toLocaleDateString()}</p>
                        </div>
                        <span className="status-badge green">Approved</span>
                      </div>
                      <p className="ngo-address">📍 {ngo.address}</p>
                      <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.5rem', padding: '0.75rem', marginTop: '1rem' }}>
                        <p style={{ color: '#15803d', fontWeight: '500' }}>✅ NGO is active and can receive donations</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

