import React, { useRef, useEffect, useState } from 'react';
import { useScrollAnimation } from '../hooks/useLenis';

// Check if device is mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
};

// Mobile-optimized animation config
const getMobileConfig = (originalConfig) => {
  if (isMobile()) {
    return {
      ...originalConfig,
      duration: Math.max((originalConfig.duration || 0.6) * 1.5, 0.8), // Slower animations on mobile
      delay: Math.min(originalConfig.delay || 0, 0.3) // Reduced delays but not too fast
    };
  }
  return originalConfig;
};

// Advanced Morphing Animation Component
export const MorphIn = ({ 
  children, 
  delay = 0, 
  duration = 0.8,
  morphType = 'elastic',
  className = '',
  ...props 
}) => {
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set initial state based on morph type
    const morphStyles = {
      elastic: {
        initial: 'scale(0.3) rotate(-10deg)',
        final: 'scale(1) rotate(0deg)',
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      },
      bounce: {
        initial: 'scale(0) translateY(-100px)',
        final: 'scale(1) translateY(0)',
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      },
      flip: {
        initial: 'rotateY(90deg) scale(0.8)',
        final: 'rotateY(0deg) scale(1)',
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      },
      slide: {
        initial: 'translateX(-100%) skewX(-10deg)',
        final: 'translateX(0%) skewX(0deg)',
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }
    };

    const selectedMorph = morphStyles[morphType] || morphStyles.elastic;

    element.style.opacity = '0';
    element.style.transform = selectedMorph.initial;
    element.style.transition = `all ${duration}s ${selectedMorph.easing} ${delay}s`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.opacity = '1';
          element.style.transform = selectedMorph.final;
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, duration, morphType]);

  return (
    <div ref={elementRef} className={className} {...props}>
      {children}
    </div>
  );
};

// Advanced Parallax Component with Multiple Layers
export const AdvancedParallax = ({ 
  children, 
  speed = 0.5,
  direction = 'vertical',
  className = '',
  ...props 
}) => {
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;
      
      if (direction === 'vertical') {
        element.style.transform = `translateY(${rate}px)`;
      } else {
        element.style.transform = `translateX(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return (
    <div 
      ref={elementRef} 
      className={className} 
      style={{ willChange: 'transform' }}
      {...props}
    >
      {children}
    </div>
  );
};

// Text Reveal Animation with Typewriter Effect
export const TextReveal = ({ 
  text, 
  delay = 0, 
  speed = 50,
  className = '',
  ...props 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => {
            if (currentIndex < text.length) {
              setDisplayedText(prev => prev + text[currentIndex]);
              setCurrentIndex(prev => prev + 1);
            }
          }, delay + speed);

          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [currentIndex, text, delay, speed]);

  return (
    <span ref={elementRef} className={className} {...props}>
      {displayedText}
      <span className="cursor-blink">|</span>
    </span>
  );
};

// Advanced Stagger with Custom Effects
export const AdvancedStagger = ({ 
  children, 
  staggerDelay = 0.1,
  animationType = 'slideUp',
  className = '',
  ...props 
}) => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const childElements = Array.from(container.children);
    
    const animations = {
      slideUp: {
        initial: { opacity: 0, transform: 'translateY(50px)' },
        final: { opacity: 1, transform: 'translateY(0)' }
      },
      slideLeft: {
        initial: { opacity: 0, transform: 'translateX(-50px)' },
        final: { opacity: 1, transform: 'translateX(0)' }
      },
      scale: {
        initial: { opacity: 0, transform: 'scale(0.5)' },
        final: { opacity: 1, transform: 'scale(1)' }
      },
      rotate: {
        initial: { opacity: 0, transform: 'rotate(-20deg) scale(0.8)' },
        final: { opacity: 1, transform: 'rotate(0deg) scale(1)' }
      },
      flip: {
        initial: { opacity: 0, transform: 'rotateY(90deg)' },
        final: { opacity: 1, transform: 'rotateY(0deg)' }
      }
    };

    const selectedAnimation = animations[animationType] || animations.slideUp;
    
    childElements.forEach((child, index) => {
      Object.assign(child.style, {
        opacity: selectedAnimation.initial.opacity,
        transform: selectedAnimation.initial.transform,
        transition: `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * staggerDelay}s`
      });
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          childElements.forEach((child) => {
            child.style.opacity = selectedAnimation.final.opacity;
            child.style.transform = selectedAnimation.final.transform;
          });
          observer.unobserve(container);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [staggerDelay, animationType]);

  return (
    <div ref={containerRef} className={className} {...props}>
      {children}
    </div>
  );
};

// Floating Elements Animation
export const FloatingElements = ({ 
  children, 
  intensity = 1,
  className = '',
  ...props 
}) => {
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const speed = scrolled * 0.02 * intensity;
      
      element.style.transform = `translateY(${Math.sin(speed) * 10}px) translateX(${Math.cos(speed) * 5}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [intensity]);

  return (
    <div 
      ref={elementRef} 
      className={className}
      style={{ willChange: 'transform' }}
      {...props}
    >
      {children}
    </div>
  );
};

// Advanced Fade In Animation Component
export const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  threshold = 0.1,
  className = '',
  ...props 
}) => {
  const elementRef = useRef();
  const config = getMobileConfig({ delay, duration });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set initial state
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = `opacity ${config.duration}s ease-out ${config.delay}s, transform ${config.duration}s ease-out ${config.delay}s`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [config.delay, config.duration, threshold]);

  return (
    <div ref={elementRef} className={className} {...props}>
      {children}
    </div>
  );
};

// Slide In Animation Component
export const SlideIn = ({ 
  children, 
  direction = 'left', 
  delay = 0, 
  duration = 0.8,
  distance = 50,
  className = '',
  ...props 
}) => {
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const transforms = {
      left: `translateX(-${distance}px)`,
      right: `translateX(${distance}px)`,
      up: `translateY(-${distance}px)`,
      down: `translateY(${distance}px)`
    };

    // Set initial state
    element.style.opacity = '0';
    element.style.transform = transforms[direction];
    element.style.transition = `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.opacity = '1';
          element.style.transform = 'translate(0, 0)';
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [direction, delay, duration, distance]);

  return (
    <div ref={elementRef} className={className} {...props}>
      {children}
    </div>
  );
};

// Parallax Component
export const Parallax = ({ 
  children, 
  speed = 0.5, 
  className = '',
  ...props 
}) => {
  const elementRef = useRef();

  useScrollAnimation(({ scrollY }) => {
    const element = elementRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const elementTop = rect.top + scrollY;
    const elementHeight = rect.height;
    const windowHeight = window.innerHeight;

    // Calculate if element is in viewport
    if (scrollY + windowHeight > elementTop && scrollY < elementTop + elementHeight) {
      const translateY = (scrollY - elementTop) * speed;
      element.style.transform = `translateY(${translateY}px)`;
    }
  });

  return (
    <div ref={elementRef} className={className} {...props}>
      {children}
    </div>
  );
};

// Scale Animation Component
export const ScaleIn = ({ 
  children, 
  delay = 0, 
  duration = 0.6,
  scale = 0.8,
  className = '',
  ...props 
}) => {
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set initial state
    element.style.opacity = '0';
    element.style.transform = `scale(${scale})`;
    element.style.transition = `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.opacity = '1';
          element.style.transform = 'scale(1)';
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, duration, scale]);

  return (
    <div ref={elementRef} className={className} {...props}>
      {children}
    </div>
  );
};

// Stagger Animation Component
export const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.1,
  className = '',
  ...props 
}) => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const childElements = Array.from(container.children);
    
    childElements.forEach((child, index) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(20px)';
      child.style.transition = `opacity 0.6s ease-out ${index * staggerDelay}s, transform 0.6s ease-out ${index * staggerDelay}s`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          childElements.forEach((child) => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          });
          observer.unobserve(container);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [staggerDelay]);

  return (
    <div ref={containerRef} className={className} {...props}>
      {children}
    </div>
  );
};

// CSS for Typewriter Cursor and Advanced Animations
const advancedAnimationStyles = `
  .cursor-blink {
    animation: cursor-blink 1s infinite;
  }
  
  @keyframes cursor-blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  /* Advanced hover effects for animated elements */
  .animation-hover:hover {
    transform: translateY(-5px) !important;
    transition: transform 0.3s ease !important;
  }

  .animation-glow:hover {
    box-shadow: 0 0 20px rgba(255, 107, 53, 0.3) !important;
    transition: box-shadow 0.3s ease !important;
  }

  /* Custom easing curves */
  .ease-out-quart {
    transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1) !important;
  }

  .ease-out-expo {
    transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1) !important;
  }

  .ease-out-back {
    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('advanced-animation-styles')) {
  const style = document.createElement('style');
  style.id = 'advanced-animation-styles';
  style.textContent = advancedAnimationStyles;
  document.head.appendChild(style);
}
