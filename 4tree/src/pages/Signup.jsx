import React, { useState } from 'react';
import './signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    terms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/auth/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone_number: formData.phone,
          password: formData.password,
          location: formData.location || null,
          terms: formData.terms
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      alert(`Welcome ${data.user.name}! Your account has been created successfully. 🎉`);
      // Redirect to login or dashboard
      window.location.href = '/login';

    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error('Registration error:', error);
    }
  };

  const redirectToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="signup-container">
      {/* Background decorative elements */}
     

      <div className="signup-form-container slide-in">
        {/* Header */}
        <div className="signup-header">
          <div className="signup-logo floating-animation">
            <svg className="signup-logo-icon" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
          <h2>Create Account</h2>
          <p>Join our community today!</p>
        </div>

        {/* Signup Form */}
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>


          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          {/* Location (Optional) */}
          <div className="form-group">
            <label htmlFor="location">Location <span className="optional-text">(Optional)</span></label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select your location</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>

          {/* Terms and Conditions */}
          <div className="terms-group">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              required
              checked={formData.terms}
              onChange={handleChange}
            />
            <label htmlFor="terms">
              I agree to the <a href="/terms" className="link-hover">Terms of Service</a> and <a href="/privacy" className="link-hover">Privacy Policy</a>
            </label>
          </div>

          {/* Sign Up Button */}
          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="form-divider">
          <div className="divider-line"></div>
          <span>or</span>
          <div className="divider-line"></div>
        </div>


        {/* Login Link */}
        <div className="login-link">
          <p>
            Already have an account?
            <button onClick={redirectToLogin} className="link-hover">
              Log in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;