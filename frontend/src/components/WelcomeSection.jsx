import React from "react";
import "./WelcomeSection.css";
import "./WelcomeSection.light.css";
import "./WelcomeSection.menu.css";
import "./WelcomeSection.mobile.css";

const WelcomeSection = ({ darkMode }) => {
  const features = [
    {
      icon: "🔭",
      title: "Discover Recipes",
      description:"🍳 Seek Out the Ultimate Recipes Customized for You! 🍳",
    },
    {
      icon: "🛍️",
      title: "Smart Shopping",
      description: "🥗 Quickly Compile Your Grocery List from Tasty Recipes! 🥗",
    },
    {
      icon: "👨‍🚀",
      title: "AutoBots",
      description: "👩‍🍳 Enjoy Customized Culinary Recommendations! 🍴",
    },
  ];

  return (
    <section className="welcome-section">
      <div className={`welcome-card ${darkMode ? "dark" : "light"}`}>
        <div className="welcome-content">
          <h3 className="welcome-title"> 𝓔𝓧𝓟𝓛𝓞𝓡𝓔-𝓜𝓔 </h3>
          <p className="welcome-description">
            <span className="food-emoji">🍜</span>
            <span className="menu-text">Idli Dosa Sambar Chutney Chutney</span>
            <span className="food-emoji">🍛</span>
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
