 import React from "react";
import "./Footer.css";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-logo">4Tree NGO</div>

      <div className="footer-links">
        <a href="/about">About Us</a>
        <a href="/mission">Our Mission</a>
        <a href="/donate">Donate</a>
        <a href="/contact">Contact</a>
      </div>

    

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} 4Tree NGO. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
