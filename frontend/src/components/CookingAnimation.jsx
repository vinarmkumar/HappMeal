import React from "react";
import "./CookingAnimation.css";

export const CookingAnimation = () => {
  return (
    <div className="cooking-animation-container">
      <div className="food-plate">
        <div className="plate-base">
          <div className="plate-rim"></div>
          <div className="plate-center">
            {/* Food elements */}
            <div className="food-item salad"></div>
            <div className="food-item tomato"></div>
            <div className="food-item cucumber"></div>
            <div className="food-sparkle sparkle-1"></div>
            <div className="food-sparkle sparkle-2"></div>
            <div className="food-sparkle sparkle-3"></div>
          </div>
        </div>
        <div className="steam-container">
          <div className="steam steam-1"></div>
          <div className="steam steam-2"></div>
          <div className="steam steam-3"></div>
          <div className="steam steam-4"></div>
        </div>
      </div>
    </div>
  );
};
