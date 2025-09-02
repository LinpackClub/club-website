'use client';
import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from '@studio-freight/lenis';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const images = [
    {
      src: "/images/hero-image.jpg",
      position: "object-center"
    },
    {
      src: "/images/hero-image-2.jpg", 
      position: "object-center"
    },
    {
      src: "/images/hero-image-31.jpg",
      position: "object-center"
    }
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Refs for GSAP animations
  const heroRef = useRef<HTMLDivElement>(null);
  const mainTitleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const animationInitialized = useRef(false);
  const lenisRef = useRef<any>(null);
  const imageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTriggerRef = useRef<any>(null);

  // Initialize client-side only features
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (imageTimerRef.current) {
        clearInterval(imageTimerRef.current);
      }
      // Clean up ScrollTrigger
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      // Clean up all ScrollTriggers
      ScrollTrigger.getAll().forEach(st => st.kill());
      // Clean up Lenis
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  // Initialize animations only once
  const initializeAnimations = useCallback(() => {
    if (animationInitialized.current || !isClient || !heroRef.current) return;
    animationInitialized.current = true;

    // Ensure GSAP plugins are registered
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Add syncTouch to work better with ScrollTrigger
      syncTouch: true,
    });
    lenisRef.current = lenis;

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    
    // Tell ScrollTrigger to use Lenis as the scroller
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop: (value?: number) => {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value as number);
          return value as number;
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
      },
      pinType: document.documentElement.style.transform ? "transform" : "fixed"
    });

    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update(); // Update ScrollTrigger on each frame
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Track scroll for effects
    lenis.on('scroll', (args: { scroll: number }) => {
      if (args.scroll > 50 && !hasScrolled) {
        setHasScrolled(true);
      }
    });

    // GSAP Timeline for entrance animations - with reduced initial delay for better UX
    const tl = gsap.timeline({ delay: 0.1 }); // Reduced delay from 0.5 to 0.1

    // Set initial states
    gsap.set([badgeRef.current, mainTitleRef.current, subtitleRef.current, statsRef.current, ctaRef.current], {
      opacity: 0,
      y: 80,
      clipPath: 'inset(100% 0 0 0)'
    });

    gsap.set(imageRef.current, {
      scale: 1.4,
      opacity: 0
    });

    gsap.set(overlayRef.current, {
      opacity: 0
    });

    // Entrance animations with sophisticated stagger
    tl.to(imageRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.5, // Reduced from 2
      ease: "power3.out"
    })
    .to(overlayRef.current, {
      opacity: 1,
      duration: 1, // Reduced from 1.5
      ease: "power2.out"
    }, "-=1")
    .to(badgeRef.current, {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0% 0 0 0)',
      duration: 0.8, // Reduced from 1
      ease: "power3.out"
    }, "-=0.7")
    .to(mainTitleRef.current, {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0% 0 0 0)',
      duration: 0.9, // Reduced from 1.2
      ease: "power3.out"
    }, "-=0.6")
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0% 0 0 0)',
      duration: 0.8, // Reduced from 1
      ease: "power3.out"
    }, "-=0.7")
    .to(statsRef.current, {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0% 0 0 0)',
      duration: 0.8, // Reduced from 1
      ease: "power3.out"
    }, "-=0.6")
    .to(ctaRef.current, {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0% 0 0 0)',
      duration: 0.8, // Reduced from 1
      ease: "power3.out"
    }, "-=0.6");

    // Scroll-triggered zoom effect for magazine-style transition
    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      if (heroRef.current) {
        scrollTriggerRef.current = ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
          // Use document.scrollingElement for proper Lenis integration
          scroller: document.documentElement,
          onUpdate: (self) => {
            if (!imageRef.current || !mainTitleRef.current || !subtitleRef.current || 
                !badgeRef.current || !statsRef.current || !ctaRef.current) return;
                
            const progress = self.progress;
            const scale = 1 + (progress * 0.8); // Zoom from 1 to 1.8x
            const brightness = 1 - (progress * 0.3); // Darken as it zooms
            
            gsap.set(imageRef.current, {
              scale: scale,
              filter: `brightness(${brightness})`
            });
            
            // Parallax text movement
            gsap.set([mainTitleRef.current, subtitleRef.current], {
              y: -progress * 100,
              opacity: 1 - (progress * 1.2)
            });
            
            gsap.set([badgeRef.current, statsRef.current, ctaRef.current], {
              y: -progress * 60,
              opacity: 1 - (progress * 1.5)
            });
          }
        });
        
        // Refresh ScrollTrigger after creation
        ScrollTrigger.refresh();
      }
    }, 100); // Small delay to ensure DOM elements are ready

    // Image rotation effect - start only after initial animation completes
    setTimeout(() => {
      if (imageTimerRef.current) {
        clearInterval(imageTimerRef.current);
      }
      imageTimerRef.current = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 6000);
    }, 2000); // Start rotation after 2 seconds

  }, [isClient, hasScrolled, images.length]);

  // Initialize animations when client is ready
  useEffect(() => {
    if (isClient && heroRef.current) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        initializeAnimations();
      });
    }
    
    // Refresh ScrollTrigger when component mounts
    if (isClient) {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    }
  }, [isClient, initializeAnimations]);

  // Prevent rendering until client-side is ready
  if (!isClient) {
    return (
      <section 
        className="relative h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900 z-0"
      >
        <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse" />
      </section>
    );
  }

  return (
    <section 
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900 z-0"
    >
      {/* Full-screen background image with zoom effect */}
      <div 
        ref={imageContainerRef}
        className="absolute inset-0 w-full h-full"
      >
        {images.map((image, index) => (
          <div
            key={image.src}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentImage === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <div ref={index === currentImage ? imageRef : null} className="w-full h-full">
              <Image
                src={image.src}
                alt={`Club showcase ${index + 1}`}
                fill
                priority={index === 0}
                className={`object-cover ${image.position}`}
                sizes="100vw"
                quality={95}
              />
            </div>
          </div>
        ))}
        
        {/* Gradient overlay for text readability */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"
        />
      </div>

      {/* Magazine-style content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 md:px-12 py-8 md:py-16">
        
        {/* Badge */}
        <div ref={badgeRef} className="mb-6 md:mb-8">
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-8 py-4 border border-white/20 shadow-2xl">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-sm md:text-base font-medium tracking-wide uppercase">
              New Event Coming Soon
            </span>
          </div>
        </div>

        {/* Main heading - Magazine style typography */}
        <div ref={mainTitleRef} className="mb-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-light leading-[0.9] tracking-tight text-white">
            <span className="block md:inline font-extralight">We make </span>
            <span className="block md:inline font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-red-400 dark:via-red-500 dark:to-red-600">
              Creative
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div ref={subtitleRef} className="mb-12">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
            <span className="block">Things, </span>
            <span className="block">Everyday</span>
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full ml-2 animate-pulse" />
          </h2>
        </div>

        {/* Stats row */}
        <div ref={statsRef} className="mb-10 md:mb-12">
          <div className="flex items-center justify-center space-x-8 md:space-x-16">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">50+</div>
              <div className="text-xs md:text-sm text-white/60 uppercase tracking-wider">Members</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">10+</div>
              <div className="text-xs md:text-sm text-white/60 uppercase tracking-wider">Workshops</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">24/7</div>
              <div className="text-xs md:text-sm text-white/60 uppercase tracking-wider">Support</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div ref={ctaRef} className="mb-8 md:mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://forms.gle/KxZrPb5P1ySvwFQs7"
              className="group relative px-12 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="relative z-10">Join Our Community</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-red-600 dark:to-red-700" />
            </a>
            <div className="text-white/60 text-sm uppercase tracking-widest">
              Technical Excellence
            </div>
          </div>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-white/20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-white/20" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-white/20" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-white/20" />
    </section>
  );
}