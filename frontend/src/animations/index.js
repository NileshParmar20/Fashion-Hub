import gsap from 'gsap';

// Common animation configurations
export const fadeInUp = {
  from: {
    y: 30,
    opacity: 0,
  },
  to: {
    y: 0,
    opacity: 1,
    duration: 0.6,
    ease: 'power3.out',
  },
};

export const fadeIn = {
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
    duration: 0.6,
  },
};

export const scaleIn = {
  from: {
    scale: 0.9,
    opacity: 0,
  },
  to: {
    scale: 1,
    opacity: 1,
    duration: 0.6,
    ease: 'back.out(1.7)',
  },
};

export const slideInLeft = {
  from: {
    x: -50,
    opacity: 0,
  },
  to: {
    x: 0,
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out',
  },
};

export const slideInRight = {
  from: {
    x: 50,
    opacity: 0,
  },
  to: {
    x: 0,
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out',
  },
};

// Animation functions
export const animateElements = (selector, config, stagger = 0.1) => {
  gsap.from(selector, {
    ...config.from,
    ...config.to,
    stagger,
  });
};

export const animateTimeline = (animations) => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  animations.forEach(({ selector, ...config }) => {
    tl.from(selector, config);
  });
  
  return tl;
};

// Modal animations
export const animateModal = (modalRef, overlayRef) => {
  if (!modalRef.current || !overlayRef.current) return;
  
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
};

// Card hover animation
export const cardHoverAnimation = (cardRef) => {
  if (!cardRef.current) return;
  
  cardRef.current.addEventListener('mouseenter', () => {
    gsap.to(cardRef.current, {
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
    });
  });
  
  cardRef.current.addEventListener('mouseleave', () => {
    gsap.to(cardRef.current, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  });
};

// Page transition animations
export const pageEnterAnimation = (containerRef) => {
  if (!containerRef.current) return;
  
  const tl = gsap.timeline();
  
  tl.from(containerRef.current, {
    opacity: 0,
    duration: 0.4,
  }).from(
    containerRef.current.querySelectorAll('.animate-in'),
    {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
    }
  );
};

// Stagger animation helper
export const staggerAnimation = (selector, delay = 0.1) => ({
  from: {
    y: 20,
    opacity: 0,
  },
  to: {
    y: 0,
    opacity: 1,
    stagger: delay,
    duration: 0.6,
    ease: 'power3.out',
  },
});
