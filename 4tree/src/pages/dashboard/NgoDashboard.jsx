import React, { useState, useEffect } from 'react';
import './NgoDashboard.css';

const NGODashboard = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview');
  const [requestIdCounter, setRequestIdCounter] = useState(6);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample data for NGO requests
  const [ngoRequests, setNgoRequests] = useState([
    {
      id: 1,
      title: "Educational Books for Children",
      categories: ["Books"],
      quantity: 50,
      urgency: "High",
      description: "We need educational books for our literacy program serving 200+ children",
      status: "Active",
      createdDate: "2024-01-10",
      responses: 12,
      fulfilled: 30
    },
    {
      id: 2,
      title: "Winter Clothing Drive",
      categories: ["Clothes"],
      quantity: 100,
      urgency: "High",
      description: "Urgent need for winter clothes for homeless shelter residents",
      status: "Active",
      createdDate: "2024-01-08",
      responses: 8,
      fulfilled: 45
    },
    {
      id: 3,
      title: "Computer Equipment for Training",
      categories: ["Electronics"],
      quantity: 10,
      urgency: "Medium",
      description: "Need working computers for our skill development center",
      status: "Completed",
      createdDate: "2024-01-05",
      responses: 5,
      fulfilled: 10
    },
    {
      id: 4,
      title: "Kitchen Utensils for Community Kitchen",
      categories: ["Utensils"],
      quantity: 25,
      urgency: "Low",
      description: "Basic kitchen utensils needed for our community meal program",
      status: "Active",
      createdDate: "2024-01-12",
      responses: 3,
      fulfilled: 8
    },
    {
      id: 5,
      title: "Sports Equipment for Youth Program",
      categories: ["Sports"],
      quantity: 15,
      urgency: "Medium",
      description: "Sports equipment needed for our youth development program",
      status: "Active",
      createdDate: "2024-01-14",
      responses: 6,
      fulfilled: 5
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "response",
      title: "New Response Received! 📝",
      message: "Your winter clothing request received 3 new responses from donors.",
      date: "2024-01-20",
      read: false
    },
    {
      id: 2,
      type: "completed",
      title: "Request Fulfilled! 🎉",
      message: "Your computer equipment request has been completely fulfilled. Thank you to all donors!",
      date: "2024-01-19",
      read: false
    },
    {
      id: 3,
      type: "response",
      title: "Donor Interest 💝",
      message: "5 donors have shown interest in your educational books request.",
      date: "2024-01-18",
      read: true
    },
    {
      id: 4,
      type: "milestone",
      title: "Milestone Reached! 🎯",
      message: "Your winter clothing drive has reached 50% completion with 45 items fulfilled.",
      date: "2024-01-17",
      read: true
    }
  ]);

  const categories = [
    { id: "Books", label: "📚 Books" },
    { id: "Clothes", label: "👕 Clothes" },
    { id: "Electronics", label: "📱 Electronics" },
    { id: "Utensils", label: "🍽️ Utensils" },
    { id: "Toys", label: "🧸 Toys" },
    { id: "Furniture", label: "🪑 Furniture" },
    { id: "Sports", label: "⚽ Sports" },
    { id: "Other", label: "📦 Other" }
  ];

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Thank you for your service to the community! See you soon! 🌟');
      console.log('NGO logged out');
    }
  };

  const switchTab = (tabName) => {
    setCurrentTab(tabName);
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const submitRequest = (event) => {
    event.preventDefault();
    
    if (selectedCategories.length === 0) {
      alert('Please select at least one category!');
      return;
    }
    
    const formData = new FormData(event.target);
    const title = formData.get('title');
    const quantity = formData.get('quantity');
    const urgency = formData.get('urgency');
    const description = formData.get('description');
    
    if (!title || !quantity || !urgency || !description) {
      alert('Please fill in all required fields!');
      return;
    }
    
    const newRequest = {
      id: requestIdCounter,
      title,
      categories: [...selectedCategories],
      quantity: parseInt(quantity),
      urgency,
      description,
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
      responses: 0,
      fulfilled: 0
    };
    
    setNgoRequests(prev => [...prev, newRequest]);
    setRequestIdCounter(prev => prev + 1);
    
    // Reset form
    event.target.reset();
    setSelectedCategories([]);
    
    alert('Request submitted successfully! Donors will be notified. 🎉');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'blue';
      case 'Completed': return 'green';
      default: return 'gray';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  // Statistics calculations
  const totalRequests = ngoRequests.length;
  const activeRequests = ngoRequests.filter(r => r.status === 'Active').length;
  const completedRequests = ngoRequests.filter(r => r.status === 'Completed').length;
  const totalResponses = ngoRequests.reduce((sum, req) => sum + req.responses, 0);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Filtering and sorting
  const filteredRequests = ngoRequests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch(sortBy) {
      case 'date':
        return new Date(b.createdDate) - new Date(a.createdDate);
      case 'urgency':
        const urgencyOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      case 'responses':
        return b.responses - a.responses;
      default:
        return 0;
    }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileDropdownOpen]);

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
                  <span className="logo-subtitle">NGO Portal</span>
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
                  <span className="notification-badge">{unreadNotifications}</span>
                </button>
              </div>

              {/* Profile Dropdown */}
              <div className="profile-dropdown-container">
                <button onClick={toggleProfileDropdown} className="profile-button">
                  <svg className="profile-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
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
          <h1 className="welcome-title">Welcome, Hope Foundation! 🏢</h1>
          <p className="welcome-subtitle">Managing requests and helping communities together</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {/* Total Requests */}
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Requests</p>
                <p className="stat-value">{totalRequests}</p>
                <p className="stat-description blue">Items requested</p>
              </div>
              <div className="stat-icon blue">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Active Requests */}
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Active Requests</p>
                <p className="stat-value">{activeRequests}</p>
                <p className="stat-description orange">Currently seeking</p>
              </div>
              <div className="stat-icon orange">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Completed Requests */}
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Completed Requests</p>
                <p className="stat-value">{completedRequests}</p>
                <p className="stat-description green">Successfully fulfilled</p>
              </div>
              <div className="stat-icon green">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Total Responses */}
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Responses</p>
                <p className="stat-value">{totalResponses}</p>
                <p className="stat-description purple">Donor responses</p>
              </div>
              <div className="stat-icon purple">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Management Section */}
        <div className="management-section">
          <h2 className="section-title">NGO Management Dashboard</h2>
          
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              onClick={() => switchTab('overview')} 
              className={`tab-button ${currentTab === 'overview' ? 'active' : ''}`}
            >
              Overview
            </button>
            <button 
              onClick={() => switchTab('createRequest')} 
              className={`tab-button ${currentTab === 'createRequest' ? 'active' : ''}`}
            >
              Create Request
            </button>
            <button 
              onClick={() => switchTab('myRequests')} 
              className={`tab-button ${currentTab === 'myRequests' ? 'active' : ''}`}
            >
              My Requests
            </button>
            <button 
              onClick={() => switchTab('notifications')} 
              className={`tab-button ${currentTab === 'notifications' ? 'active' : ''}`}
            >
              Notifications
            </button>
          </div>

          {/* Overview Tab */}
          {currentTab === 'overview' && (
            <div className="tab-content">
              <div className="overview-grid">
                <div className="overview-card">
                  <h3 className="overview-title">Recent Requests</h3>
                  <div className="overview-list">
                    {ngoRequests.slice(0, 4).map(request => (
                      <div key={request.id} className="overview-item">
                        <div className="overview-item-info">
                          <span className="overview-item-title">{request.title}</span>
                          <span className="overview-item-desc">{request.fulfilled}/{request.quantity} fulfilled - {request.responses} responses</span>
                        </div>
                        <span className={`overview-urgency ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>


              </div>

              <div className="recent-activity">
                <h3 className="activity-title">Recent Activity</h3>
                <div className="activity-list">
                  {notifications.slice(0, 3).map(notification => (
                    <div key={notification.id} className="activity-item">
                      <div className="activity-content">
                        <span className="activity-title-text">{notification.title}</span>
                        <span className="activity-message">{notification.message}</span>
                        <span className="activity-date">{notification.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Create Request Tab */}
          {currentTab === 'createRequest' && (
            <div className="tab-content">
              <div className="form-container">
                <h3 className="form-title">Create New Item Request</h3>
                <form onSubmit={submitRequest} className="donation-form">
                  {/* Request Title */}
                  <div className="form-group">
                    <label className="form-label">Request Title</label>
                    <input 
                      type="text" 
                      name="title"
                      className="form-input" 
                      placeholder="e.g., Winter Clothes for Homeless Shelter" 
                      required
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="form-group">
                    <label className="form-label">Select Categories (Multiple allowed)</label>
                    <div className="category-grid">
                      {categories.map(category => (
                        <div 
                          key={category.id}
                          onClick={() => toggleCategory(category.id)}
                          className={`category-chip ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
                        >
                          {category.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quantity and Urgency */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Quantity Needed</label>
                      <input 
                        type="number" 
                        name="quantity"
                        min="1" 
                        className="form-input" 
                        placeholder="Number of items needed" 
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Urgency Level</label>
                      <select name="urgency" className="form-select" required>
                        <option value="">Select urgency</option>
                        <option value="High">High - Urgent need</option>
                        <option value="Medium">Medium - Moderate need</option>
                        <option value="Low">Low - Can wait</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label className="form-label">Detailed Description</label>
                    <textarea 
                      name="description"
                      rows="4" 
                      className="form-textarea" 
                      placeholder="Describe what you need, why you need it, and how it will help your cause..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="submit-btn">
                    🚀 Submit Request
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* My Requests Tab */}
          {currentTab === 'myRequests' && (
            <div className="tab-content">
              <div className="controls-section">
                <div className="sort-filter-controls">
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="control-select"
                  >
                    <option value="all">All Requests</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="control-select"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="urgency">Sort by Urgency</option>
                    <option value="responses">Sort by Responses</option>
                  </select>
                </div>
              </div>

              <div className="requests-list">
                {sortedRequests.length === 0 ? (
                  <div className="empty-state">
                    <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <p className="empty-text">No requests found</p>
                  </div>
                ) : (
                  sortedRequests.map(request => (
                    <div key={request.id} className="request-card">
                      <div className="request-header">
                        <div className="request-info">
                          <h3 className="request-title">{request.title}</h3>
                          <div className="request-meta">
                            <span className={`priority-badge ${request.urgency.toLowerCase()}`}>
                              {request.urgency} Priority
                            </span>
                            <span className={`status-badge ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="request-items">
                        <div className="items-list">
                          {request.categories.map(category => (
                            <span key={category} className="item-tag">
                              {categories.find(c => c.id === category)?.label || category}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <p className="request-description">{request.description}</p>
                      
                      <div className="request-stats">
                        <div className="stat-item">
                          <span className="stat-number">{request.responses}</span>
                          <span className="stat-label">Responses</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">{request.fulfilled}/{request.quantity}</span>
                          <span className="stat-label">Fulfilled</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">{Math.round((request.fulfilled / request.quantity) * 100)}%</span>
                          <span className="stat-label">Complete</span>
                        </div>
                      </div>

                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${Math.min((request.fulfilled / request.quantity) * 100, 100)}%` }}
                        ></div>
                      </div>
                      
                      <div className="request-footer">
                        <span className="request-date">Created on {request.createdDate}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {currentTab === 'notifications' && (
            <div className="tab-content">
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div className="empty-state">
                    <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM11 19H6.5a2.5 2.5 0 010-5H11m0 5v-5m0 5h5m-5-5V9a3 3 0 116 0v5m-6 0h6"></path>
                    </svg>
                    <p className="empty-text">No notifications found</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div key={notification.id} className={`notification-card ${!notification.read ? 'unread' : ''}`}>
                      <div className="notification-header">
                        <h3 className="notification-title">{notification.title}</h3>
                        <span className={`notification-type ${notification.type}`}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                      </div>
                      <p className="notification-message">{notification.message}</p>
                      <p className="notification-date">{notification.date}</p>
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
}
export default NGODashboard;