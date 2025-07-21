import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useLenisScroll = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Connect Lenis with GSAP ScrollTrigger
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // GSAP ticker for smooth animation loop
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return lenisRef;
};

export const useParallaxEffects = () => {
  useEffect(() => {
    // Parallax effect for cards
    gsap.utils.toArray('.recipe-card').forEach((card) => {
      gsap.to(card, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    // Floating animation for cards
    gsap.utils.toArray('.recipe-card').forEach((card, index) => {
      gsap.to(card, {
        y: "random(-20, 20)",
        rotation: "random(-2, 2)",
        duration: "random(3, 5)",
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: index * 0.1
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
};
