import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';

// Check if device is mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
};

export const useLenis = (options = {}) => {
  const lenisRef = useRef();

  useEffect(() => {
    // Skip Lenis initialization on mobile devices for better performance
    if (isMobile()) {
      console.log('Lenis disabled on mobile device');
      return;
    }

    // Initialize Lenis with advanced options for desktop only
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false, // Always disabled for touch
      touchMultiplier: 0, // Disable touch multiplier
      infinite: false,
      autoResize: true,
      ...options
    });

    lenisRef.current = lenis;

    // Animation loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    // Add scroll event listeners for animations
    lenis.on('scroll', (e) => {
      // Trigger scroll-based animations
      const scrollY = e.scroll;
      const limit = e.limit;
      const progress = scrollY / limit;
      
      // Dispatch custom scroll event for components
      window.dispatchEvent(new CustomEvent('lenis-scroll', {
        detail: { scrollY, limit, progress, velocity: e.velocity }
      }));
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [options]);

  return lenisRef;
};

export const useScrollAnimation = (callback) => {
  const stableCallback = useCallback(callback, [callback]);
  
  useEffect(() => {
    const handleScroll = (e) => {
      stableCallback(e.detail);
    };

    window.addEventListener('lenis-scroll', handleScroll);
    return () => window.removeEventListener('lenis-scroll', handleScroll);
  }, [stableCallback]);
};
