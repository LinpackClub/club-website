
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface EventImage {
  src: string;
  alt: string;
}

interface Event {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  category: string;
  description: string;
  highlights: string[];
  images: EventImage[];
  stats: {
    participants: number;
    duration: string;
    projects?: number;
  };
}

const Gallery: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState({ src: '', alt: '' });
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<any>(null);
  const animationInitialized = useRef(false);

  // Initialize client-side only features
  useEffect(() => {
    setIsClient(true);
    
    const checkMobile = () => {
      const isTouchDevice = (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      );
      setIsMobile(isTouchDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize smooth scroll animations
  const initializeAnimations = useCallback(() => {
    if (animationInitialized.current || !isClient) return;
    animationInitialized.current = true;

    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      syncTouch: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop: function(value?: number) {
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
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      requestAnimationFrame(() => {
        initializeAnimations();
      });
    }
  }, [isClient, initializeAnimations]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  // Modal handlers
  const handleImageClick = (e: React.MouseEvent, image: EventImage) => {
    e.preventDefault();
    setModalImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Enhanced event data with detailed descriptions
  const events: Event[] = [
    {
      id: 1,
      title: "VITB Got Latent Season 2",
      subtitle: "The Ultimate Fun Experience",
      date: "February 22, 2025",
      location: "VIT University Campus",
      category: "Entertainment",
      description: "Join us for an unforgettable experience with exciting activities and surprises that will make this event the highlight of your semester. This special gathering features engaging entertainment options including mystery challenges, creative competitions, and interactive fun activities designed to build community connections. Participants enjoy a variety of themed experiences that encourage teamwork, creativity, and memorable moments with fellow students.",
      highlights: [
        "Murder Mystery event",
        "Lip Sync Battle competition",
        "Face Painting activities",
        "Ice Cream Fight fun",
        "Community building experiences"
      ],
      images: [
        { src: "/gallery/1.jpg", alt: "VITB Got Latent Opening" },
        { src: "/gallery/2.jpg", alt: "Murder Mystery Scene" },
        { src: "/gallery/3.jpg", alt: "Lip Sync Battle" },
        { src: "/gallery/4.jpg", alt: "Face Painting Activity" },
        { src: "/gallery/5.jpg", alt: "Ice Cream Fight" },
        { src: "/gallery/6.jpg", alt: "Group Photo Session" },
        { src: "/gallery/7.jpg", alt: "Awards Ceremony" },
        { src: "/gallery/8.jpg", alt: "Closing Celebration" }
      ],
      stats: {
        participants: 400,
        duration: "1 Day"
      }
    },
    {
      id: 2,
      title: "MatlabVerse A NextWave Hackathon",
      subtitle: "Innovating with MATLAB",
      date: "Date Not Specified",
      location: "VIT University Campus",
      category: "Competition",
      description: "The Linpack Club hosted a hackathon titled 'MATLABVerse: A NextWave Hackathon,' which was open to all students. The event aimed to provide students with a platform to showcase their skills and creativity in MATLAB programming. Participants were required to submit their projects, which were evaluated by a panel of judges. The hackathon featured a range of projects, including image processing, data analysis, and machine learning applications. This competitive event encouraged innovation and technical excellence among student participants.",
      highlights: [
        "Open to all students",
        "Image processing projects",
        "Data analysis applications",
        "Machine learning solutions",
        "Expert judging panel"
      ],
      images: [
        { src: "/gallery/1.jpg", alt: "Hackathon Opening" },
        { src: "/gallery/2.jpg", alt: "Coding Session" },
        { src: "/gallery/3.jpg", alt: "Project Development" },
        { src: "/gallery/4.jpg", alt: "Team Collaboration" },
        { src: "/gallery/5.jpg", alt: "Project Presentation" },
        { src: "/gallery/6.jpg", alt: "Judging Panel" },
        { src: "/gallery/7.jpg", alt: "Winner Announcement" },
        { src: "/gallery/8.jpg", alt: "Prize Distribution" }
      ],
      stats: {
        participants: 120,
        duration: "2 Days",
        projects: 35
      }
    },
    {
      id: 3,
      title: "VIT Got Talent - I",
      subtitle: "Showcasing Student Talents",
      date: "Date Not Specified",
      location: "VIT University Campus",
      category: "Entertainment",
      description: "An exciting talent show event that featured multiple rounds of entertainment competitions. The event began with each participant receiving unique hashed code tickets through their mail IDs. Music systems were installed, and all participants were provided with event details. The competition included various rounds such as Blind Fold Race, Pop the Balloons, Karaoke Battle, Lip Sync Battle, and Face Painting. Each round was designed to showcase different talents and provide an engaging experience for both participants and spectators.",
      highlights: [
        "Blind Fold Race competition",
        "Pop the Balloons challenge",
        "Karaoke Battle performances",
        "Lip Sync Battle round",
        "Face Painting creativity contest"
      ],
      images: [
        { src: "/gallery/1.jpg", alt: "VIT Got Talent Opening" },
        { src: "/gallery/2.jpg", alt: "Blind Fold Race" },
        { src: "/gallery/3.jpg", alt: "Pop the Balloons" },
        { src: "/gallery/4.jpg", alt: "Karaoke Battle" },
        { src: "/gallery/5.jpg", alt: "Lip Sync Battle" },
        { src: "/gallery/6.jpg", alt: "Face Painting" },
        { src: "/gallery/7.jpg", alt: "Talent Show Performances" },
        { src: "/gallery/8.jpg", alt: "Event Winners" }
      ],
      stats: {
        participants: 200,
        duration: "1 Day"
      }
    },
    {
      id: 4,
      title: "Inaugural Event",
      subtitle: "Embarking on the Basics of MATLAB",
      date: "Date Not Specified",
      location: "VIT University Campus",
      category: "Educational",
      description: "The Linpack Club hosted its inaugural event titled 'Embarking on the Basics of MATLAB: A Primer to Unlocking Its Potential.' The event started with distribution of unique hashed event tickets through college mail IDs to registered students. It featured an engaging workshop on MATLAB, designed to provide participants with a comprehensive understanding of the software. The workshop included hands-on sessions and quizzes to explore new technologies and enhance participants' skills. The event concluded with prize distribution and unique participation certificates for all attendees.",
      highlights: [
        "MATLAB basics workshop",
        "Hands-on learning sessions",
        "Interactive quizzes",
        "Prize distribution ceremony",
        "Participation certificates for all"
      ],
      images: [
        { src: "/gallery/1.jpg", alt: "Inaugural Event Opening" },
        { src: "/gallery/2.jpg", alt: "MATLAB Workshop Session" },
        { src: "/gallery/3.jpg", alt: "Hands-on Learning" },
        { src: "/gallery/4.jpg", alt: "Interactive Quiz" },
        { src: "/gallery/5.jpg", alt: "Prize Distribution" },
        { src: "/gallery/6.jpg", alt: "Certificate Distribution" },
        { src: "/gallery/7.jpg", alt: "Group Photo" },
        { src: "/gallery/8.jpg", alt: "Event Closing" }
      ],
      stats: {
        participants: 150,
        duration: "1 Day"
      }
    }
  ];

  // Create multiple duplicates for seamless infinite scroll on desktop
  const getInfiniteImages = (images: EventImage[]) => {
    if (isMobile) return images;
    return [...images, ...images, ...images];
  };

  if (!isClient) {
    return (
      <main className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 md:hidden">
        <div className="gallery-header dark:text-white text-center py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main ref={galleryRef} className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Gallery Header with Magazine Style - Hidden on desktop, visible only on mobile */}
      <div className="gallery-header relative overflow-hidden py-12 md:py-16 bg-gradient-to-br from-white via-gray-50 to-white md:hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full object-cover bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/hero-image.jpg')" }}
          />
          
          {/* Overlay for text readability - Reduced opacity */}
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px]"></div>
          
          {/* Gradient overlay for enhanced contrast - Lighter */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20"></div>
        </div>
        
        {/* Decorative Background Pattern - Reduced opacity since we have image */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-red-100 dark:bg-red-900/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-50 dark:bg-red-800/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          {/* Magazine-style badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-white/20">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium uppercase tracking-widest">
              Event Gallery
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-[-0.03em] text-white mb-8 leading-[0.85] font-serif">
            <span className="inline-block md:inline">Moments of</span>
            <span className="inline-block md:inline font-thin italic bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent ml-0 md:ml-8">
              Innovation
            </span>
          </h1>
          
        </div>
      </div>

      {/* Enhanced Events Section */}
      <div className="events py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {events.map((event, index) => (
            <div key={event.id} className="event-section mb-16 md:mb-24 last:mb-12">
              {/* Event Header - Only the heading part appears above images on desktop */}
              <div className="event-header mb-10 md:mb-12">
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
                  {/* Left Column - Event Info */}
                  <div className="space-y-4 md:space-y-6">
                    {/* Category Badge */}
                    <div className="inline-flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 rounded-full px-4 py-2 border border-red-100 dark:border-red-800/30">
                      <span className="text-red-600 dark:text-red-400 text-xs font-semibold uppercase tracking-widest">
                        {event.category}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <div>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-[-0.02em] text-black dark:text-white mb-3 leading-tight font-serif">
                        {event.title}
                      </h2>
                      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light italic">
                        {event.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Images - Appears after heading */}
              <div className={`event-images-container mb-12 md:mb-16 ${!isMobile ? 'infinite-scroll-container' : ''}`}>
                {!isMobile ? (
                  // Desktop Infinite Scroll
                  <div className={`infinite-scroll-wrapper ${index % 2 === 0 ? 'scroll-left' : 'scroll-right'}`}>
                    <div className="infinite-scroll-track">
                      {getInfiniteImages(event.images).map((image, imgIndex) => (
                        <div 
                          key={`${event.id}-${imgIndex}`} 
                          className="image-container-infinite"
                          onClick={(e) => handleImageClick(e, image)}
                        >
                          <img 
                            src={image.src} 
                            alt={image.alt} 
                            className="gallery-image"
                            loading="lazy"
                          />
                          <div className="image-overlay">
                            <div className="overlay-content">
                              <div className="overlay-text">View Image</div>
                              <div className="overlay-subtitle">{image.alt}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Mobile Grid Layout
                  <div className="event-images-grid">
                    {event.images.map((image, imgIndex) => (
                      <div 
                        key={imgIndex} 
                        className="image-container"
                        onClick={(e) => handleImageClick(e, image)}
                      >
                        <img 
                          src={image.src} 
                          alt={image.alt} 
                          className="gallery-image"
                          loading="lazy"
                        />
                        <div className="image-overlay">
                          <div className="overlay-content">
                            <div className="overlay-text">View Image</div>
                            <div className="overlay-subtitle">{image.alt}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Event Details - Appears after images on desktop, same on mobile */}
              <div className="event-details mb-10 md:mb-12">
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
                  {/* Left Column - Event Info (without heading) */}
                  <div className="space-y-4 md:space-y-6">
                    {/* Event Meta */}
                    <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    {/* Stats - Horizontal Layout */}
                    <div className="flex flex-col items-start justify-start py-3 md:py-4 border-t border-b border-gray-100 dark:border-gray-800">
                      <div className="flex flex-wrap gap-4 md:gap-6 mb-2">
                        <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full border border-red-100 dark:border-red-800/30">
                          <div className="text-lg md:text-xl font-light text-red-600 dark:text-red-400">
                            {event.stats.participants}
                          </div>
                          <div className="text-xs md:text-sm text-red-500 dark:text-red-300 uppercase tracking-wide">
                            Participants
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full border border-red-100 dark:border-red-800/30">
                          <div className="text-lg md:text-xl font-light text-red-600 dark:text-red-400">
                            {event.stats.duration}
                          </div>
                          <div className="text-xs md:text-sm text-red-500 dark:text-red-300 uppercase tracking-wide">
                            Duration
                          </div>
                        </div>
                      </div>
                      {event.stats.projects && (
                        <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full border border-red-100 dark:border-red-800/30">
                          <div className="text-lg md:text-xl font-light text-red-600 dark:text-red-400">
                            {event.stats.projects}
                          </div>
                          <div className="text-xs md:text-sm text-red-500 dark:text-red-300 uppercase tracking-wide">
                            Projects
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Guest Members Section */}
                    <div className="guest-members-section py-4 md:py-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                        <h3 className="text-base md:text-lg font-semibold text-black dark:text-white tracking-wide">
                          Guest Members
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                          <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12" />
                          <div>
                            <div className="font-medium text-black dark:text-white text-sm">Dr. Alex Morgan</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Keynote Speaker</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                          <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12" />
                          <div>
                            <div className="font-medium text-black dark:text-white text-sm">Prof. Sarah Johnson</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Industry Expert</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                          <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12" />
                          <div>
                            <div className="font-medium text-black dark:text-white text-sm">Mr. James Wilson</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Tech Innovator</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Quote Section - Visible only on desktop */}
                    <div className="hidden md:block mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                      <div className="pl-4 border-l-2 border-red-500">
                        <p className="text-xl md:text-2xl font-light italic text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide">
                          &ldquo;Innovation distinguishes between a leader and a follower.&rdquo;
                        </p>
                        <p className="mt-3 text-base font-medium text-gray-800 dark:text-gray-200">
                          - Steve Jobs
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Reflecting on the spirit of {event.title}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Description */}
                  <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                      <div className="flex items-center mb-5">
                        <div className="w-1 h-4 bg-red-500 rounded-full mr-3"></div>
                        <h3 className="text-xl font-semibold text-black dark:text-white tracking-wide font-serif">
                          About The Event
                        </h3>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 leading-relaxed font-light text-base md:text-lg tracking-wide font-sans space-y-4">
                        {event.description.split('. ').map((sentence, idx, arr) => (
                          <p key={idx} className="mb-3 last:mb-0">
                            {sentence}{idx !== arr.length - 1 ? '.' : ''}
                          </p>
                        ))}
                      </div>
                    </div>
                    
                    {/* Event Highlights */}
                    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                      <div className="flex items-center mb-5">
                        <div className="w-1 h-4 bg-red-500 rounded-full mr-3"></div>
                        <h3 className="text-xl font-semibold text-black dark:text-white tracking-wide font-serif">
                          Event Highlights
                        </h3>
                      </div>
                      <ul className="space-y-4">
                        {event.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start space-x-4 group">
                            <div className="mt-1.5 flex-shrink-0">
                              <div className="w-2 h-2 bg-red-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                            </div>
                            <span className="font-light text-base leading-relaxed tracking-wide text-gray-700 dark:text-gray-300">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="modal-close">×</button>
            <img 
              src={modalImage.src} 
              alt={modalImage.alt}
              className="modal-image"
            />
            <div className="modal-caption">
              {modalImage.alt}
            </div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        /* Lenis smooth scroll */
        html.lenis, html.lenis body {
          height: auto;
        }
        
        .lenis.lenis-smooth {
          scroll-behavior: auto;
        }
        
        .lenis.lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }
        
        .lenis.lenis-stopped {
          overflow: hidden;
        }

        /* Infinite Scroll Wrapper */
        .infinite-scroll-wrapper {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          height: 400px;
          overflow: hidden;
          position: relative;
          margin: 2rem 0;
          width: 100%;
        }
        
        .infinite-scroll-track {
          display: flex;
          width: fit-content;
          gap: 32px;
          align-items: center;
          height: 100%;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        /* Scrolling animations */
        .scroll-left .infinite-scroll-track {
          animation-name: scroll-left-animation;
          animation-duration: 50s;
        }

        .scroll-right .infinite-scroll-track {
          animation-name: scroll-right-animation;
          animation-duration: 55s;
        }

        @keyframes scroll-left-animation {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333333%);
          }
        }

        @keyframes scroll-right-animation {
          0% {
            transform: translateX(-33.333333%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .image-container-infinite {
          position: relative;
          width: 350px;
          height: 350px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          flex-shrink: 0;
          background: #f8f9fa;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .image-container-infinite:hover {
          transform: scale(1.05) translateY(-12px);
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15);
          z-index: 20;
        }
        
        .image-container-infinite:hover .image-overlay {
          opacity: 1;
        }
        
        .image-container-infinite:hover .gallery-image {
          transform: scale(1.1);
        }

        /* Pause animation on hover */
        .infinite-scroll-wrapper:hover .infinite-scroll-track {
          animation-play-state: paused;
        }
        
        .event-images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          width: 100%;
        }
        
        .image-container {
          position: relative;
          width: 100%;
          height: 0;
          padding-bottom: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.4s ease;
          cursor: pointer;
          background: #f8f9fa;
        }
        
        .image-container:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
        }
        
        .gallery-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%);
          opacity: 0;
          transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }
        
        .overlay-content {
          text-align: center;
          transform: translateY(20px);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .overlay-text {
          color: white;
          font-size: 1.25rem;
          font-weight: 500;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        
        .overlay-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
          font-weight: 300;
        }
        
        .image-container-infinite:hover .overlay-content,
        .image-container:hover .overlay-content {
          transform: translateY(0);
        }
        
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          opacity: 0;
          animation: modalFadeIn 0.3s forwards;
          backdrop-filter: blur(10px);
        }
        
        .modal-content {
          position: relative;
          max-width: 90%;
          max-height: 90%;
          animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .modal-close {
          position: absolute;
          top: -60px;
          right: 0;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 10000;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .modal-close:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }
        
        .modal-image {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 12px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        }
        
        .modal-caption {
          position: absolute;
          bottom: -50px;
          left: 0;
          right: 0;
          text-center;
          color: white;
          font-size: 1rem;
          font-weight: 300;
          opacity: 0.8;
        }
        
        @keyframes modalFadeIn {
          to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
          from {
            transform: scale(0.8) translateY(20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        
        /* Custom dark mode styles */
        .dark main,
        .dark .events {
          background-color: #101010 !important;
        }
        
        .dark .gallery-header {
          background: linear-gradient(to bottom right, #101010, #101010, #101010) !important;
        }
        
        @media (max-width: 768px) {
          .event-images-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important;
            gap: 16px !important;
          }
          
          .image-container {
            transform: none !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
          }
          
          .image-overlay {
            display: none !important;
          }
          
          .modal-content {
            max-width: 95% !important;
            max-height: 85vh !important;
          }
          
          .infinite-scroll-wrapper {
            display: none !important;
          }
          
          .event-header .grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          
          .gallery-header {
            padding: 2rem 0 !important;
          }
          
          .events {
            padding: 2rem 0 !important;
          }
          
          .event-section {
            margin-bottom: 2rem !important;
          }
          
          .event-header {
            margin-bottom: 1.5rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .event-images-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          .modal-image {
            max-height: 70vh !important;
          }
          
          .modal-close {
            top: -50px !important;
            width: 40px !important;
            height: 40px !important;
            font-size: 1.2rem !important;
          }
        }
        
        /* Performance optimizations */
        .infinite-scroll-track {
          backface-visibility: hidden;
          perspective: 1000px;
          transform-style: preserve-3d;
        }
        
        .image-container-infinite {
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
      `}</style>
    </main>
  );
};

export default Gallery;
