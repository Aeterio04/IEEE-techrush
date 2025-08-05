import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

const App = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('newDonation');
  const [donations, setDonations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Location data structure for India
  const locationData = {
    maharashtra: {
      name: "Maharashtra",
      cities: {
        mumbai: {
          name: "Mumbai",
          locations: {
            andheri: {
              name: "Andheri Community Center",
              address: "SV Road, Andheri West, Mumbai - 400058",
              hours: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM",
              icon: "🏢"
            },
            bandra: {
              name: "Bandra Charity Hub",
              address: "Hill Road, Bandra West, Mumbai - 400050",
              hours: "Mon-Sat: 8AM-7PM, Sun: 12PM-5PM",
              icon: "🌊"
            }
          }
        }
      }
    },
    delhi: {
      name: "Delhi",
      cities: {
        "new-delhi": {
          name: "New Delhi",
          locations: {
            cp: {
              name: "Connaught Place Center",
              address: "Block A, Connaught Place, New Delhi - 110001",
              hours: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM",
              icon: "🏛️"
            }
          }
        }
      }
    }
  };

  // Fetch data from Django backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch donations
        const donationsResponse = await fetch('/api/donations/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        const donationsData = await donationsResponse.json();
        setDonations(donationsData);

        // Fetch notifications
        const notificationsResponse = await fetch('/api/notifications/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        const notificationsData = await notificationsResponse.json();
        setNotifications(notificationsData);

        // Initialize countries
        setAvailableCountries([
          { key: 'maharashtra', name: 'Maharashtra', searchText: 'maharashtra mumbai pune nagpur' },
          { key: 'delhi', name: 'Delhi', searchText: 'delhi new delhi gurgaon' }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  

  // Django API functions
  const submitDonation = async (formData) => {
    try {
      const response = await fetch('/api/donations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit donation');
      }

      const newDonation = await response.json();
      setDonations(prev => [...prev, newDonation]);
      return newDonation;
    } catch (error) {
      console.error('Error submitting donation:', error);
      throw error;
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? {...n, read: true} : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // UI helper functions
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const switchTab = (tabName) => {
    setCurrentTab(tabName);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleFileUpload = (files) => {
    const newPhotos = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );
    setUploadedPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (index) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const selectCountry = (countryKey, countryName) => {
    setSelectedCountry(countryKey);
    setSelectedCity(null);
    setSelectedLocation(null);
    
    if (locationData[countryKey]) {
      const cities = Object.keys(locationData[countryKey].cities).map(cityKey => ({
        key: cityKey,
        name: locationData[countryKey].cities[cityKey].name,
        searchText: locationData[countryKey].cities[cityKey].name.toLowerCase()
      }));
      setAvailableCities(cities);
    } else {
      setAvailableCities([]);
    }
    
    setIsCountryDropdownOpen(false);
  };

  const selectCity = (cityKey, cityName) => {
    setSelectedCity(cityKey);
    setSelectedLocation(null);
    setIsCityDropdownOpen(false);
  };

  const selectLocation = (locationKey) => {
    if (selectedCountry && selectedCity) {
      const location = locationData[selectedCountry].cities[selectedCity].locations[locationKey];
      setSelectedLocation({
        country: selectedCountry,
        city: selectedCity,
        location: locationKey,
        ...location
      });
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    
    if (uploadedPhotos.length === 0 || selectedCategories.length === 0 || !selectedLocation) {
      alert('Please fill all required fields!');
      return;
    }

    const formData = {
      categories: selectedCategories,
      condition: e.target.condition.value,
      quantity: parseInt(e.target.quantity.value),
      description: e.target.description.value,
      location: selectedLocation,
      photos: uploadedPhotos
    };

    try {
      await submitDonation(formData);
      
      // Reset form
      e.target.reset();
      setSelectedCategories([]);
      setUploadedPhotos([]);
      setSelectedLocation(null);
      setSelectedCountry(null);
      setSelectedCity(null);
      
      alert('Donation submitted successfully!');
    } catch (error) {
      alert('Error submitting donation. Please try again.');
    }
  };

  // Calculate stats
  const totalDonations = donations.length;
  const pendingDonations = donations.filter(d => d.status === 'Pending').length;
  const acceptedDonations = donations.filter(d => d.status === 'Accepted').length;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Background decorative elements */}
      <div className="background-elements">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>

      {/* Navigation Bar */}
      
      {/* Main Content */}
      <main className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section slide-in">
          <h1>Welcome back, John! 🌟</h1>
          <p>Thank you for making a difference in your community</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {/* Total Donations */}
          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Total Donations</p>
                <p className="stat-value">{totalDonations}</p>
                <p className="stat-status">Items donated</p>
              </div>
              <div className="stat-icon">
                <svg className="stat-svg" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Approval */}
          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Pending Approval</p>
                <p className="stat-value">{pendingDonations}</p>
                <p className="stat-status pending">Under review</p>
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
                <p className="stat-value">{acceptedDonations}</p>
                <p className="stat-status accepted">Approved items</p>
              </div>
              <div className="stat-icon accepted">
                <svg className="stat-svg" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* People Helped */}
          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">People Helped</p>
                <p className="stat-value">47</p>
                <p className="stat-status people">Lives impacted</p>
              </div>
              <div className="stat-icon people">
                <svg className="stat-svg" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
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
              onClick={() => switchTab('newDonation')} 
              className={`tab-button ${currentTab === 'newDonation' ? 'active' : ''}`}
            >
              New Donation
            </button>
            <button 
              onClick={() => switchTab('myDonations')} 
              className={`tab-button ${currentTab === 'myDonations' ? 'active' : ''}`}
            >
              My Donations
            </button>
            <button 
              onClick={() => switchTab('notifications')} 
              className={`tab-button ${currentTab === 'notifications' ? 'active' : ''}`}
            >
              Notifications
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {currentTab === 'newDonation' && (
              <div className="donation-form-container">
                <h3>Create New Donation Request</h3>
                <form onSubmit={handleDonationSubmit} className="donation-form">
                  {/* Photo Upload Section */}
                  <div className="form-group">
                    <label>Upload Photos of Items</label>
                    <div 
                      className="upload-area"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('dragover');
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('dragover');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('dragover');
                        handleFileUpload(e.dataTransfer.files);
                      }}
                      onClick={() => document.getElementById('fileInput').click()}
                    >
                      <svg className="upload-icon" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p>Drag and drop photos here, or click to select</p>
                      <p className="upload-hint">Support for multiple images (JPG, PNG, GIF)</p>
                    </div>
                    <input 
                      type="file" 
                      id="fileInput" 
                      multiple 
                      accept="image/*" 
                      className="file-input" 
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                    
                    {/* Photo Previews */}
                    <div className="photo-preview-container">
                      {uploadedPhotos.map((photo, index) => (
                        <div key={index} className="photo-preview">
                          <img 
                            src={URL.createObjectURL(photo)} 
                            alt={`Preview ${index}`}
                            className="photo-preview-image"
                          />
                          <button 
                            type="button"
                            className="remove-photo-button"
                            onClick={() => removePhoto(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="form-group">
                    <label>Select Categories (Multiple allowed)</label>
                    <div className="category-selection">
                      {['Books', 'Clothes', 'Electronics', 'Utensils', 'Toys', 'Furniture', 'Sports', 'Other'].map(category => (
                        <div 
                          key={category}
                          className={`category-chip ${selectedCategories.includes(category) ? 'selected' : ''}`}
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category === 'Books' && '📚'}
                          {category === 'Clothes' && '👕'}
                          {category === 'Electronics' && '📱'}
                          {category === 'Utensils' && '🍽️'}
                          {category === 'Toys' && '🧸'}
                          {category === 'Furniture' && '🪑'}
                          {category === 'Sports' && '⚽'}
                          {category === 'Other' && '📦'} {category}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="form-row">
                    <div className="form-group">
                      <label>Item Condition</label>
                      <select name="condition" className="form-control">
                        <option value="">Select condition</option>
                        <option value="New">New</option>
                        <option value="Like New">Like New</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Quantity</label>
                      <input 
                        type="number" 
                        name="quantity" 
                        min="1" 
                        className="form-control" 
                        placeholder="Number of items"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      name="description" 
                      rows="4" 
                      className="form-control" 
                      placeholder="Describe the items, their condition, and any special notes..."
                    ></textarea>
                  </div>

                  {/* Location Selection */}
                  <div className="form-group">
                    <label>Select Your Location</label>
                    
                    {/* State and City Selection */}
                    <div className="form-row">
                      <div className="form-group location-input-group">
                        <label>State</label>
                        <input 
                          type="text" 
                          value={selectedCountry ? locationData[selectedCountry]?.name : ''}
                          className="form-control" 
                          placeholder="Type or select state..."
                          onFocus={() => setIsCountryDropdownOpen(true)}
                          onChange={(e) => {
                            // Implement search/filter if needed
                          }}
                        />
                        {isCountryDropdownOpen && (
                          <div className="location-dropdown">
                            {availableCountries.map(country => (
                              <div 
                                key={country.key}
                                className="dropdown-item"
                                onClick={() => selectCountry(country.key, country.name)}
                              >
                                {country.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="form-group location-input-group">
                        <label>City</label>
                        <input 
                          type="text" 
                          value={selectedCity ? locationData[selectedCountry]?.cities[selectedCity]?.name : ''}
                          className="form-control" 
                          placeholder={selectedCountry ? "Type city name..." : "First select a state"}
                          disabled={!selectedCountry}
                          onFocus={() => setIsCityDropdownOpen(true)}
                          onChange={(e) => {
                            // Implement search/filter if needed
                          }}
                        />
                        {isCityDropdownOpen && availableCities.length > 0 && (
                          <div className="location-dropdown">
                            {availableCities.map(city => (
                              <div 
                                key={city.key}
                                className="dropdown-item"
                                onClick={() => selectCity(city.key, city.name)}
                              >
                                {city.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Drop-off Location Selection */}
                    {selectedCity && (
                      <div className="location-selection-container">
                        <label>Available Drop-off Locations</label>
                        <div className="location-selection">
                          {selectedCountry && selectedCity && Object.entries(
                            locationData[selectedCountry]?.cities[selectedCity]?.locations || {}
                          ).map(([key, location]) => (
                            <div 
                              key={key}
                              className={`location-option ${
                                selectedLocation?.location === key ? 'selected' : ''
                              }`}
                              onClick={() => selectLocation(key)}
                            >
                              <div className="location-icon">{location.icon}</div>
                              <div className="location-details">
                                <h4>{location.name}</h4>
                                <p>{location.address}</p>
                                <p className="location-hours">{location.hours}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="location-hint">
                          💡 Select your preferred location. We'll confirm availability and provide exact drop-off instructions.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="form-row">
                    <div className="form-group">
                      <label>Preferred Contact Method</label>
                      <select name="contactMethod" className="form-control">
                        <option value="Email">Email</option>
                        <option value="Phone">Phone</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Availability</label>
                      <select name="availability" className="form-control">
                        <option value="Weekdays">Weekdays</option>
                        <option value="Weekends">Weekends</option>
                        <option value="Anytime">Anytime</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="submit-button">
                    Submit Donation Request
                  </button>
                </form>
              </div>
            )}

            {currentTab === 'myDonations' && (
              <div className="donations-list">
                {donations.length === 0 ? (
                  <div className="empty-state">
                    <svg className="empty-icon" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p>No donations found</p>
                  </div>
                ) : (
                  donations.map(donation => (
                    <div key={donation.id} className="donation-card">
                      <div className="donation-header">
                        <div className="donation-photos">
                          {donation.photos.map((photo, index) => (
                            <span key={index} className="donation-photo">{photo}</span>
                          ))}
                        </div>
                        <div className="donation-info">
                          <h3>{donation.categories.join(', ')}</h3>
                          <p>Quantity: {donation.quantity} • Condition: {donation.condition}</p>
                          <p className="donation-date">Submitted on {donation.submissionDate}</p>
                          {donation.preferredLocation && (
                            <p className="donation-location">
                              📍 Preferred: {donation.preferredLocation.name} - {donation.preferredLocation.address}
                            </p>
                          )}
                        </div>
                        <span className={`donation-status ${donation.status.toLowerCase()}`}>
                          {donation.status}
                        </span>
                      </div>
                      <p className="donation-description">{donation.description}</p>
                      
                      {donation.status === 'Accepted' && donation.dropOffLocation && (
                        <div className="donation-message success">
                          <p>Drop-off Location:</p>
                          <p>{donation.dropOffLocation}</p>
                        </div>
                      )}
                      
                      {donation.status === 'Rejected' && donation.rejectionReason && (
                        <div className="donation-message error">
                          <p>Rejection Reason:</p>
                          <p>{donation.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {currentTab === 'notifications' && (
              <div className="notifications-tab">
                {notifications.length === 0 ? (
                  <div className="empty-state">
                    <svg className="empty-icon" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM11 19H6.5a2.5 2.5 0 010-5H11m0 5v-5m0 5h5m-5-5V9a3 3 0 116 0v5m-6 0h6"></path>
                    </svg>
                    <p>No notifications found</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="notification-header">
                        <h3>{notification.title}</h3>
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;