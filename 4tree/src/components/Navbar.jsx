import React from "react";
import "./Navbar.css"; // Link to external CSS
import { Link } from "react-router-dom";
import logo from '../assets/logo.jpeg';


const Navbar = () => {
  const toggleMobileMenu = () => {
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu) {
      mobileMenu.classList.toggle("active");
    }
  };

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      const navbar = document.querySelector(".navbar");
      const mobileMenu = document.getElementById("mobileMenu");

      if (navbar && !navbar.contains(event.target)) {
        mobileMenu?.classList.remove("active");
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Scroll effect
  // React.useEffect(() => {
  //   const handleScroll = () => {
  //     const navbar = document.querySelector(".navbar");
  //     if (window.scrollY > 50) {
  //       navbar.style.background = "rgba(255, 255, 255, 0.95)";
  //       navbar.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.15)";
  //     } else {
  //       navbar.style.background = "rgba(255, 255, 255, 0.85)";
  //       navbar.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  return (
    <>
      <nav className="navbar" style={{ background:" rgba(216, 207, 207, 0.98)"}}>
        <div className="logo-section">
          <div className="logo-icon">
          <img src={logo} alt="Logo" width="40" height="40" />
          </div>
          <div className="logo-text">4Tree NGO</div>
        </div>

        <div className="nav-buttons">
          <Link to="/signup" className="btn btn-donate">Donate</Link>
          <Link to="/login" className="btn btn-signin">Sign In</Link>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <div className="mobile-menu" id="mobileMenu">
          <Link to="/donate" className="btn btn-donate">Donate</Link>
          <Link to="/signup" className="btn btn-signin">Sign In</Link>
        </div>
      </nav>

     
    </>
  );
};

export default Navbar;
