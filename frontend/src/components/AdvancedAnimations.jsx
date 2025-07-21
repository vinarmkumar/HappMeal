import React, { useEffect, useRef } from 'react';

// Advanced Navigation Animation
export const AnimatedNav = ({ children, className = '', ...props }) => {
  const navRef = useRef();

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let lastScrollY = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide nav
        nav.style.transform = 'translateY(-100%)';
        nav.style.backdropFilter = 'blur(10px)';
      } else {
        // Scrolling up - show nav
        nav.style.transform = 'translateY(0)';
        nav.style.backdropFilter = 'blur(20px)';
      }
      
      // Add transparency based on scroll
      const opacity = Math.max(0.8, 1 - currentScrollY / 300);
      nav.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      ref={navRef}
      className={`animated-nav ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform'
      }}
      {...props}
    >
      {children}
    </nav>
  );
};

// Loading Skeleton Animation
export const SkeletonLoader = ({ width = '100%', height = '20px', className = '' }) => {
  return (
    <div 
      className={`skeleton-loader ${className}`}
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s infinite',
        borderRadius: '4px'
      }}
    />
  );
};

// Morphing Button
export const MorphingButton = ({ 
  children, 
  onClick, 
  morphType = 'elastic',
  className = '',
  ...props 
}) => {
  const buttonRef = useRef();

  const handleClick = (e) => {
    const button = buttonRef.current;
    if (button) {
      // Create ripple effect
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }
    
    if (onClick) onClick(e);
  };

  return (
    <button
      ref={buttonRef}
      className={`morphing-button ${morphType} ${className}`}
      onClick={handleClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform'
      }}
      {...props}
    >
      {children}
    </button>
  );
};

// Infinite Scroll Animation
export const InfiniteScroll = ({ children, speed = 50, direction = 'left' }) => {
  const scrollRef = useRef();

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const scrollWidth = element.scrollWidth;
    const clientWidth = element.clientWidth;
    
    if (scrollWidth <= clientWidth) return;

    let animationId;
    let currentTranslate = 0;

    const animate = () => {
      currentTranslate -= speed / 60; // 60fps
      
      if (Math.abs(currentTranslate) >= scrollWidth / 2) {
        currentTranslate = 0;
      }
      
      element.style.transform = `translateX(${currentTranslate}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [speed, direction]);

  return (
    <div 
      className="infinite-scroll-container"
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}
    >
      <div
        ref={scrollRef}
        style={{
          display: 'inline-flex',
          willChange: 'transform'
        }}
      >
        {children}
        {/* Duplicate for seamless loop */}
        {children}
      </div>
    </div>
  );
};

// CSS Styles for Advanced Animations
const advancedAnimationStyles = `
  @keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .morphing-button {
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    background: linear-gradient(135deg, #ff6b35, #f7931e);
    color: white;
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  }

  .morphing-button:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
  }

  .morphing-button:active {
    transform: translateY(0) scale(0.98);
  }

  .morphing-button.elastic:hover {
    animation: elastic-bounce 0.6s ease;
  }

  @keyframes elastic-bounce {
    0% { transform: scale(1); }
    20% { transform: scale(1.1); }
    40% { transform: scale(0.95); }
    60% { transform: scale(1.05); }
    80% { transform: scale(0.98); }
    100% { transform: scale(1); }
  }

  .animated-nav {
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.9);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .dark .animated-nav {
    background: rgba(30, 30, 30, 0.9);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Advanced hover effects */
  .hover-lift {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  .hover-glow:hover {
    box-shadow: 0 0 30px rgba(255, 107, 53, 0.5);
  }

  .hover-rotate:hover {
    transform: rotate(2deg);
  }

  /* Performance optimizations */
  .will-change-transform {
    will-change: transform;
  }

  .will-change-auto {
    will-change: auto;
  }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('advanced-ui-animations')) {
  const style = document.createElement('style');
  style.id = 'advanced-ui-animations';
  style.textContent = advancedAnimationStyles;
  document.head.appendChild(style);
}
