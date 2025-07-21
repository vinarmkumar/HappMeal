import React, { useEffect, useRef } from 'react';

// Scroll Progress Indicator
export const ScrollProgress = () => {
  const progressRef = useRef();

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      
      if (progressRef.current) {
        progressRef.current.style.width = `${scrollPercent * 100}%`;
      }
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="scroll-progress-container">
      <div 
        ref={progressRef}
        className="scroll-progress-bar"
      />
    </div>
  );
};

// Magnetic Mouse Effect
export const MagneticElement = ({ children, strength = 0.3, className = '', ...props }) => {
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      
      element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = 'translate(0px, 0px)';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <div 
      ref={elementRef}
      className={className}
      style={{ 
        transition: 'transform 0.2s ease-out',
        willChange: 'transform'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Smooth Reveal on Scroll
export const SmoothReveal = ({ 
  children, 
  direction = 'up',
  distance = 100,
  duration = 1,
  className = '',
  ...props 
}) => {
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.opacity = '1';
          element.style.transform = 'translate(0, 0)';
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '-50px'
      }
    );

    // Set initial state
    const transforms = {
      up: `translateY(${distance}px)`,
      down: `translateY(-${distance}px)`,
      left: `translateX(-${distance}px)`,
      right: `translateX(${distance}px)`
    };

    element.style.opacity = '0';
    element.style.transform = transforms[direction];
    element.style.transition = `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

    observer.observe(element);

    return () => observer.disconnect();
  }, [direction, distance, duration]);

  return (
    <div ref={elementRef} className={className} {...props}>
      {children}
    </div>
  );
};

// Background Parallax
export const BackgroundParallax = ({ 
  children, 
  speed = 0.5,
  className = '',
  backgroundImage = '',
  ...props 
}) => {
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;
      
      if (backgroundImage) {
        element.style.backgroundPosition = `center ${rate}px`;
      } else {
        element.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, backgroundImage]);

  return (
    <div 
      ref={elementRef}
      className={className}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        willChange: 'transform'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Text Animation on Scroll
export const AnimatedText = ({ 
  text, 
  delay = 0,
  speed = 100,
  className = '',
  ...props 
}) => {
  const containerRef = useRef();
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(container);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <div ref={containerRef} className={className} {...props}>
      {words.map((word, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.6s ease ${delay + index * speed}ms`,
            marginRight: '0.3em'
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

// CSS Styles for Scroll Effects
const scrollEffectStyles = `
  .scroll-progress-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    z-index: 9999;
  }

  .scroll-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #ff6b35, #f7931e);
    width: 0%;
    transition: width 0.1s ease;
    box-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
  }

  /* Magnetic hover effect */
  .magnetic-hover {
    cursor: pointer;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #ff6b35, #f7931e);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #f7931e, #ff6b35);
  }

  /* Smooth scroll behavior */
  html {
    scroll-behavior: smooth;
  }

  /* Advanced animations */
  @keyframes wave {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(5deg); }
    75% { transform: rotate(-5deg); }
  }

  .wave-animation {
    animation: wave 2s ease-in-out infinite;
  }

  @keyframes float-gentle {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  .float-gentle {
    animation: float-gentle 3s ease-in-out infinite;
  }

  @keyframes pulse-glow {
    0%, 100% { 
      box-shadow: 0 0 5px rgba(255, 107, 53, 0.3);
    }
    50% { 
      box-shadow: 0 0 20px rgba(255, 107, 53, 0.6);
    }
  }

  .pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('scroll-effect-styles')) {
  const style = document.createElement('style');
  style.id = 'scroll-effect-styles';
  style.textContent = scrollEffectStyles;
  document.head.appendChild(style);
}
