import React, { useEffect } from "react";
import "./Home.css";

const HeroSection = () => {
  useEffect(() => {
    const heroBackground = document.querySelector(".hero-background");
    const heroContent = document.querySelector(".hero-content");

    const onScroll = () => {
      if (heroBackground) {
        const rate = window.pageYOffset * -0.5;
        heroBackground.style.transform = `translateY(${rate}px)`;
      }
    };

    const onLoad = () => {
      if (heroContent) {
        heroContent.style.opacity = "0";
        heroContent.style.transform = "translateY(50px)";
        setTimeout(() => {
          heroContent.style.transition = "all 1s cubic-bezier(0.4, 0, 0.2, 1)";
          heroContent.style.opacity = "1";
          heroContent.style.transform = "translateY(0)";
        }, 300);
      }
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="hero-background"></div>

        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-quote">"Transforming Lives, Building Communities"</h1>
          <p className="hero-subtitle">
          Join us in creating lasting change through education, healthcare, and community development programs that empower individuals and strengthen communities worldwide.
          </p>
          <a href="/signup" className="hero-donate-btn">
            <svg className="heart-icon" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                       2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 
                       4.5 2.09C13.09 3.81 14.76 3 16.5 
                       3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
                       6.86-8.55 11.54L12 21.35z" />
            </svg>
            Donate Now
          </a>
        </div>
      </section>

      <section className="worker-showcase-section">
        <h2 className="worker-section-title">Meet Our Ground Heroes</h2>
        <div className="worker-card-container">
          <div className="worker-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1eaC0Ys3z5fgkK7eAecqgloHyvoo-QmMa6g&s" alt="NGO Worker 1" />
          
            <h3>Food Distribution</h3>
            <p>Helping the needy with nutritious meals across villages and cities.</p>
          </div>
          <div className="worker-card">
            <img src="https://give.do/blog/wp-content/uploads/2023/10/Rural-Health-Care-Foundation-an-NGO-in-Kolkata-bridging-the-healthcare-gap.jpg" alt="NGO Worker 2" />
           
            <h3>Medical Support</h3>
            <p>Providing essential care and first aid in rural areas and slums.</p>
          </div>
          <div className="worker-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEdSQ0o599wjKOkaPulmZHq0MtaM7MIcjUc8nidXlQ_LY8WHDTFg90FtLd_zpMv5610Zw&usqp=CAU" alt="NGO Worker 3" />
          
            <h3>Education Drives</h3>
            <p>Spreading awareness, books, and basic schooling for children.</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
