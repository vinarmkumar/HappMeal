import React from 'react';
import { MagneticElement, SmoothReveal } from './ScrollEffects';
import './FeaturesSection.css';

const FeaturesSection = ({ darkMode }) => {
  const features = [
    {
      id: 1,
      title: "AI Recipe Generator",
      description: "Transform your available ingredients into delicious recipes. Our smart AI suggests creative meals based on what you have in your kitchen.",
      image: "🤖👨‍🍳",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderColor: "rgba(102, 126, 234, 0.3)"
    },
    {
      id: 2,
      title: "Smart Grocery Lists",
      description: "Automatically generate organized shopping lists from your favorite recipes. Never forget an ingredient again with our intelligent planning system.",
      image: "🛒📝",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      borderColor: "rgba(240, 147, 251, 0.3)"
    },
    {
      id: 3,
      title: "Culinary Assistant",
      description: "Get instant cooking tips, substitution suggestions, and step-by-step guidance. Your personal AI chef is here to help 24/7.",
      image: "💬🍳",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      borderColor: "rgba(79, 172, 254, 0.3)"
    }
  ];

  return (
    <section className={`features-section ${darkMode ? 'dark' : 'light'}`}>
      <div className="features-container">
        <SmoothReveal direction="up" distance={80} duration={1}>
          <div className="features-header">
            <h2 className="features-title">MegaTron</h2>
            <p className="features-subtitle">
              Discover what makes MealCart your ultimate cooking companion
            </p>
          </div>
        </SmoothReveal>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <SmoothReveal 
              key={feature.id}
              direction="up" 
              distance={60} 
              duration={0.8}
              style={{ transitionDelay: `${index * 0.2}s` }}
            >
              <MagneticElement strength={0.2} className="magnetic-hover">
                <div 
                  className={`feature-card glassmorphism-card ${darkMode ? 'dark' : 'light'} pulse-glow wave-animation`}
                  style={{ 
                    '--border-color': feature.borderColor,
                    animationDelay: `${index * 0.3}s`
                  }}
                >
                  <div className="card-glow" style={{ background: feature.gradient }}></div>
                  
                  <div className="feature-image float-gentle" style={{ background: feature.gradient }}>
                    <span className="feature-emoji">{feature.image}</span>
                  </div>
                  
                  <div className="feature-content">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                  
                  <div className="feature-hover-effect"></div>
                </div>
              </MagneticElement>
            </SmoothReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
