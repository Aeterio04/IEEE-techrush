import React, { useState, useEffect } from 'react';
import './NgoDashboard.css';
import { useParams } from 'react-router-dom';
import logo from '../../assets/logo.jpeg';

const NGODashboard = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview');

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');
  const [userData, setUserData] = useState({});
  const { slug } = useParams()
  // Sample data for NGO requests
  const [ngoRequests, setNgoRequests] = useState([]);

  const [notifications, setNotifications] = useState([]);


  const categories = [
    { id: "Home Essentials", label: "🏠 Home Essentials" },
    { id: "Furniture", label: "🪑 Furniture" },
    { id: "Clothing & Footwear", label: "👕👟 Clothing & Footwear" },
    { id: "Hygiene Essentials", label: "🧴🧼 Hygiene Essentials" },
    { id: "Education Supplies", label: "📚✏️ Education Supplies" },
    { id: "Childcare and Toys", label: "🧸🍼 Childcare and Toys" },
    { id: "Medical Supplies", label: "💊🩹 Medical Supplies" },
    { id: "Bedding & Shelter", label: "🛏️⛺ Bedding & Shelter" }
  ];

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      alert('Thank you for using the EcoConnect NGO Registration Portal! See you soon! 🌟');
      // Redirect to login page or handle logout logic
      window.location.href = '/';
    }
  };

  const switchTab = (tabName) => {
    setCurrentTab(tabName);
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? [] : [category] // Only keep the selected category
    );
  };


  const [totalRequests, setTotalRequests] = useState(0);
  const [activeRequests, setactiveRequests] = useState(0);
  const [completedRequests, setcompletedRequests] = useState(0);


  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  useEffect(() => {
    async function fetchUserData() {
      try {

        const response = await fetch(`http://localhost:8000/api/ngo/${slug}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie('csrftoken'),
          },

        });

        if (!response.ok) {
          throw new Error("User not found");
        }

        const data = await response.json();
        setUserData(data);
        console.log(data);
        setNotifications(data.notifications)
        console.log(notifications)
        setNgoRequests(data.requests)
        setTotalRequests(data.totalRequests);
        setactiveRequests(data.activeRequests);
        setcompletedRequests(data.completeRequests);

        console.log(data);
      } catch (err) {
        console.log(err.message);
      }
    }

    fetchUserData();
  }, []);

  function getCSRFToken() {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue;
  }

  const submitRequest = async (event) => {
    event.preventDefault();

    if (selectedCategories.length === 0) {
      alert('Please select at least one category!');
      return;
    }

    const formData = new FormData(event.target);
    const title = formData.get('title');
    const quantity = formData.get('quantity');
    const description = formData.get('description');

    if (!title || !quantity || !description) {
      alert('Please fill in all required fields!');
      return;
    }



    const newRequest = {

      title: title,
      categories: [selectedCategories[0]],
      quantity: parseInt(quantity),
      description: description,
    };

    try {
      const response = await fetch(`http://localhost:8000/api/ngorequestscreate/${slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },

        body: JSON.stringify(newRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit donation');
      }

      const data = await response.json();

      // Success handling
      alert('Request submitted successfully! We will notify you if further devlopments are made. 🎉');

      // Reset form
      event.target.reset();
      window.location.reload()

      // Optional: Redirect or update UI
      // window.location.href = '/donations/success';

    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error submitting donation: ${error.message}`);
    }


  };


  const [delivery_data, SetDeliveryData]= useState([])
  useEffect(() => {
    async function fetchDeliveryData() {
      try {

        const response = await fetch(`http://localhost:8000/api/ngodelivery/${slug}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie('csrftoken'),
          },

        });

        if (!response.ok) {
          throw new Error("User not found");
        }

        const data = await response.json();
        SetDeliveryData(data.donationlist);
        console.log(data.donationlist)

      } catch (err) {
        console.log(err.message);
      }
    }

    fetchDeliveryData();
  }, []);


  const submitDelivery = async(reqid,action)=>{

    const bodydata={
      reqid:reqid,
      action:action
    }
    try {
      const response = await fetch(`http://localhost:8000/api/submitdelivery/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify(bodydata),
      });

      if (response.ok) {
        const updatedNgo = await response.json();
        
        window.location.reload()
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error('Error updating NGO status:', error);
      return { success: false, error: error.message };
    }

  }
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'blue';
      case 'Completed': return 'green';
      default: return 'gray';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  // Statistics calculations


  // Filtering and sorting
  const filteredRequests = ngoRequests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdDate) - new Date(a.createdDate);
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
            <div className="logo-section" style={{ position: 'absolute', left: 25, top: 19 }}>
              <div className="logo-container">
                <div className="logo-icon">
                  <img src={logo} alt="Logo" width="40" height="40" style={{ position: 'fixed' }} />
                </div>
                <div className="logo-text">
                  <span className="logo-title">4tree</span>
                  <span className="logo-subtitle">NGO Portal</span>
                </div>
              </div>
            </div>

            {/* Notifications & Profile */}
            <div className="nav-actions">
              {/* Notifications Bell */}
              {/* <div className="notification-bell">
                <button className="bell-button">
                  <svg className="bell-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM11 19H6.5a2.5 2.5 0 010-5H11m0 5v-5m0 5h5m-5-5V9a3 3 0 116 0v5m-6 0h6"></path>
                  </svg>
                </button>
              </div> */}

              {/* Profile Dropdown */}
              <div className="profile-dropdown-container" style={{ position: 'absolute', right: 30, top: '25%', zIndex: 1000, }}>
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
          <h1 className="welcome-title">Welcome, {userData.username}! 🏢</h1>
          <p className="welcome-subtitle">Managing requests and helping communities together</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          margin: '2rem'
        }}>
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

            <button
              onClick={() => switchTab('donationStatus')}
              className={`tab-button ${currentTab === 'donationStatus' ? 'active' : ''}`}
            >
              Donation Status
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
                  {/* Category Selection */}
                  <div className="form-group">
                    <label className="form-label">Select Category</label> {/* Changed label text */}
                    <div className="category-grid">
                      {categories.map(category => (
                        <div
                          key={category.id}
                          onClick={() => toggleCategory(category.id)}
                          className={`category-chip ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
                          role="radio" // Add for accessibility
                          aria-checked={selectedCategories.includes(category.id)}
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
                            <span className={`status-badge ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="request-items">
                        <div className="items-list">

                          <span key={request.categories} className="item-tag">
                            {request.categories}
                          </span>

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

          {/* Donation Status Section */}
          {currentTab === 'donationStatus' && (
            <div className="tab-content">
              <div className="form-container">
                <h3 className="form-title">Donation Status</h3>

                <div className="donation-cards">
                  {/* Example cards — replace with dynamic data */}
                  {delivery_data.map((item, index) => (
                    <div key={index} className="donation-card">
                      <p><strong>Request Name:</strong> {item.RequestName} </p>
                      <p><strong>Username:</strong> {item.DonorUsername}</p>
                      <p><strong>Contact:</strong> {item.DonorContact}</p>
                      <p><strong>Last Date of Donating: 
                      </strong> <br></br>{item.Date}</p>

                      <div className="button-group">
                        <button className="accept-btn" onClick={()=>submitDelivery(item.id,'accept')}>Accept</button>
                        <button className="decline-btn" onClick={()=>submitDelivery(item.id,'decline')}>Decline</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
export default NGODashboard;