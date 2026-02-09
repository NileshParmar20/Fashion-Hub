import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * Custom hook for page entrance animations
 */
export const usePageAnimation = (dependencies = []) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll('.animate-in');
    if (elements.length === 0) return;

    gsap.from(elements, {
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, { 
    scope: containerRef, 
    dependencies: dependencies 
  });

  return containerRef;
};

export const useCardAnimation = (selector = '.card-item', dependencies = []) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(selector);
    if (elements.length === 0) return;

    gsap.from(elements, {
      scale: 0.9,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
    });
  }, { 
    scope: containerRef, 
    dependencies: dependencies 
  });

  return containerRef;
};

/**
 * Custom hook for stagger animations
 */
export const useStaggerAnimation = (selector, dependencies = []) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.from(containerRef.current.querySelectorAll(selector), {
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, { scope: containerRef, dependencies });

  return containerRef;
};

/**
 * Custom hook for fade-in animation
 */
export const useFadeIn = (dependencies = []) => {
  const elementRef = useRef(null);

  useGSAP(() => {
    if (!elementRef.current) return;

    gsap.from(elementRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  }, { scope: elementRef, dependencies });

  return elementRef;
};

/**
 * Custom hook for modal animations
 */
export const useModalAnimation = (isOpen) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  useGSAP(() => {
    if (!isOpen || !modalRef.current || !overlayRef.current) return;

    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    );

    gsap.fromTo(
      modalRef.current,
      { scale: 0.8, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
    );
  }, { dependencies: [isOpen] });

  return { modalRef, overlayRef };
};
