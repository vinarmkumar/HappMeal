import React from "react";
import "./HeroSection.css";
import "./HeroSection.mobile.css";

const HeroSection = ({ onGetStarted }) => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="contact-us">
            <button
              className="contact-button-3d"
              onClick={() =>
                (window.location.href = "mailto:princeofpersiajmp@gmail.com")
              }
            >
              Contact Us
            </button>
          </div>
          <div className="hero-text">
            <h1 className="CypherSchool"> 🎓 Cypher School 🎓</h1>
            <h1 className="hero-title">Vinarm Recipe Generator</h1>
            <p className="hero-description">
              Enter your ingredients and let the AI generate unique delicious
              recipe for you
            </p>
            <p className="domain-text">
              Advance Cooking Site Link:{" "}
              <a href="https://recipes.lionix.io/">
                https://recipes.lionix.io/
              </a>
            </p>
            <button
              className="hero-cta-button"
              onClick={() => {
                document.getElementById("search-section").scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              Make Recipe
            </button>
          </div>
          <div className="hero-illustration">
            <div className="cooking-pot">
              <div className="pot-handle-left"></div>
              <div className="pot-handle-right"></div>
              <div className="pot-body">
                <div className="pot-content">
                  {/* Bubbling effect */}
                  <div className="bubbles">
                    <div className="bubble bubble-1"></div>
                    <div className="bubble bubble-2"></div>
                    <div className="bubble bubble-3"></div>
                    <div className="bubble bubble-4"></div>
                    <div className="bubble bubble-5"></div>
                    <div className="bubble bubble-6"></div>
                  </div>

                  {/* Soup ingredients */}
                  <div className="ingredients">
                    <div className="ingredient shrimp shrimp-1"></div>
                    <div className="ingredient shrimp shrimp-2"></div>
                    <div className="ingredient vegetable veg-1"></div>
                    <div className="ingredient vegetable veg-2"></div>
                    <div className="ingredient vegetable veg-3"></div>
                    <div className="ingredient lemon lemon-1"></div>
                    <div className="ingredient lemon lemon-2"></div>
                    <div className="ingredient pepper pepper-1"></div>
                    <div className="ingredient pepper pepper-2"></div>
                  </div>
                </div>
              </div>

              {/* Steam effect */}
              <div className="steam">
                <div className="steam-line steam-1"></div>
                <div className="steam-line steam-2"></div>
                <div className="steam-line steam-3"></div>
                <div className="steam-line steam-4"></div>
                <div className="steam-line steam-5"></div>
              </div>

              {/* Heat/fire effect at the bottom */}
              <div className="heat-effect">
                <div className="flame flame-bg"></div>
                <div className="flame flame-mid"></div>
                <div className="flame flame-fg"></div>
                <div className="flame flame-left"></div>
                <div className="flame flame-right"></div>
                {/* Optional embers/sparks */}
                <div className="ember ember-1"></div>
                <div className="ember ember-2"></div>
                <div className="ember ember-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
