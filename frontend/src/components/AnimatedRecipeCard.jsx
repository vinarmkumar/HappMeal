import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useCardMagnetism } from '../hooks/useGSAPAnimations';
import './AnimatedRecipeCard.css';

const AnimatedRecipeCard = ({ 
  recipe, 
  userFavorites = [], 
  onToggleFavorite, 
  onViewRecipe, 
  onShoppingList 
}) => {
  const cardRef = useCardMagnetism();
  const contentRef = useRef(null);
  const headerRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    // Initial setup animation
    const card = cardRef.current;
    const content = contentRef.current;
    const header = headerRef.current;
    const actions = actionsRef.current;

    if (!card) return;

    // Set initial state
    gsap.set([card, content, header, actions], {
      opacity: 0,
      y: 50,
      scale: 0.9
    });

    // Entrance animation
    const tl = gsap.timeline({ delay: Math.random() * 0.5 });
    
    tl.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.7)"
    })
    .to(header, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.4")
    .to(content, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.3")
    .to(actions, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.2");

    return () => {
      tl.kill();
    };
  }, [cardRef]);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    
    // Animate favorite button
    const btn = e.currentTarget;
    gsap.to(btn, {
      scale: 1.3,
      rotation: 360,
      duration: 0.3,
      ease: "back.out(1.7)",
      yoyo: true,
      repeat: 1
    });

    // Heart burst effect
    const burst = document.createElement('div');
    burst.className = 'heart-burst';
    burst.innerHTML = '💖';
    btn.appendChild(burst);
    
    gsap.fromTo(burst, {
      scale: 0,
      opacity: 1
    }, {
      scale: 2,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => burst.remove()
    });

    onToggleFavorite(recipe._id);
  };

  const handleCardClick = () => {
    // Card click animation
    gsap.to(cardRef.current, {
      scale: 0.98,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: () => onViewRecipe(recipe)
    });
  };

  const handleButtonClick = (action) => {
    // Button click animation with ripple effect
    const btn = event.currentTarget;
    const ripple = document.createElement('span');
    ripple.className = 'button-ripple';
    btn.appendChild(ripple);

    gsap.fromTo(ripple, {
      scale: 0,
      opacity: 0.6
    }, {
      scale: 4,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => ripple.remove()
    });

    action();
  };

  const isFavorited = userFavorites.includes(recipe._id);

  return (
    <div 
      ref={cardRef}
      className="animated-recipe-card"
      onClick={handleCardClick}
    >
      {/* Header with favorite and badges */}
      <div ref={headerRef} className="animated-card-header">
        <div className="animated-badges">
          {recipe.difficulty && (
            <span className={`animated-badge difficulty-${recipe.difficulty}`}>
              {recipe.difficulty}
            </span>
          )}
          {recipe.dietaryTags && recipe.dietaryTags.slice(0, 2).map(tag => (
            <span key={tag} className="animated-badge dietary-badge">
              {tag}
            </span>
          ))}
        </div>
        
        <button 
          className={`animated-favorite-btn ${isFavorited ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
        >
          <span className="heart-icon">♥</span>
          <div className="favorite-glow"></div>
        </button>
      </div>

      {/* Content */}
      <div ref={contentRef} className="animated-card-content">
        <h3 className="animated-card-title">
          {recipe.name || recipe.title}
        </h3>
        
        <p className="animated-card-description">
          {recipe.description}
        </p>

        <div className="animated-card-meta">
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span>{(recipe.preparationTime || recipe.prepTime || 0) + (recipe.cookingTime || 0)} min</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">👥</span>
            <span>{recipe.servings || 1} servings</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">🍽️</span>
            <span>{recipe.cuisine}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div ref={actionsRef} className="animated-card-actions">
        <button 
          className="animated-btn primary"
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick(() => onViewRecipe(recipe));
          }}
        >
          <span>View Recipe</span>
          <div className="btn-glow"></div>
        </button>
        
        <button 
          className="animated-btn secondary"
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick(() => onShoppingList(recipe));
          }}
        >
          <span>🛒 Shopping List</span>
          <div className="btn-glow"></div>
        </button>
      </div>

      {/* Decorative elements */}
      <div className="card-glow"></div>
      <div className="card-border"></div>
    </div>
  );
};

export default AnimatedRecipeCard;
