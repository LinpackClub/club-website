'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

// Register ScrollTrigger plugin only on client side
gsap.registerPlugin(ScrollTrigger)

const ProjectScroller: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const photosRef = useRef<HTMLDivElement[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const scrollTriggerRef = useRef<any>(null)
  const isDesktopRef = useRef(false)
  const initRef = useRef(false)

  // Updated with club members and faculty coordinator details
  const projects = [
    {
      brand: "Faculty Coordinator",
      title: "DR. BENEVATHO JAISON",
      tags: "Guiding our club with expertise and vision, fostering innovation and academic excellence",
      contact: {
        email: "benevatho.jaison@vitbhopal.ac.in",
        phone: "+91 98765 43210",
        registration: "FC-001"
      },
      image: "/images/scroller1.webp",
      color: "#7781D9",
      socialLinks: {
        linkedin: "#",
        github: "#",
        instagram: "#",
        whatsapp: "#"
      }
    },
    {
      brand: "President",
      title: "Abhyanand Sharma",
      tags: "Leading the club with passion and dedication, driving initiatives and community growth",
      contact: {
        email: "abhyanand.sharma2023@vitbhopal.ac.in",
        phone: "+91 98765 43211",
        registration: "23BAI11047"
      },
      image: "/images/scroller2.webp",
      color: "#E67FB4",
      socialLinks: {
        linkedin: "#",
        github: "#",
        instagram: "#",
        whatsapp: "#"
      }
    },
    {
      brand: "Vice President",
      title: "Amit Bankey",
      tags: "Supporting leadership and driving initiatives, ensuring smooth operations and execution",
      contact: {
        email: "amit.bankey2023@vitbhopal.ac.in",
        phone: "+91 98765 43212",
        registration: "23BCG10132"
      },
      image: "/images/scroller3.webp",
      color: "#F1AB79",
      socialLinks: {
        linkedin: "#",
        github: "#",
        instagram: "#",
        whatsapp: "#"
      }
    },
    {
      brand: "General Secretary",
      title: "Aastha Patel",
      tags: "Managing operations and communications, coordinating events and member engagement",
      contact: {
        email: "aastha.patel2023@vitbhopal.ac.in",
        phone: "+91 98765 43213",
        registration: "23BCE10398"
      },
      image: "/images/scroller4.webp",
      color: "#77A9D9",
      socialLinks: {
        linkedin: "#",
        github: "#",
        instagram: "#",
        whatsapp: "#"
      }
    },
    {
      brand: "Joint Secretary",
      title: "Om Kumar Singh",
      tags: "Assisting in coordination and event planning, supporting administrative functions",
      contact: {
        email: "om.singh2023@vitbhopal.ac.in",
        phone: "+91 98765 43214",
        registration: "23BAI10076"
      },
      image: "/images/scroller5.webp",
      color: "#FFB08C",
      socialLinks: {
        linkedin: "#",
        github: "#",
        instagram: "#",
        whatsapp: "#"
      }
    }
  ]

  const bgColors = ["#D3D6F0", "#FAE1ED", "#FFEDE0", "#E0F0FF", "#FFEAE1"]
  const bgColorsDark = ["#181818", "#3F2A37", "#3F362A", "#2A3A3F", "#181818"]

  // Check for theme changes
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark')
      setIsDarkMode(isDark)
    }

    // Check theme on mount
    checkTheme()

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  // Handle scroll trigger refresh on theme change
  useEffect(() => {
    if (!initRef.current) return;
    
    // Refresh ScrollTrigger when theme changes to prevent distortion
    if (ScrollTrigger && isDesktopRef.current) {
      // Kill existing scroll trigger to prevent conflicts
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
        scrollTriggerRef.current = null
      }
      
      // Reinitialize desktop animations after a short delay
      setTimeout(() => {
        initDesktopAnimations()
        ScrollTrigger.refresh()
      }, 100)
    }
  }, [isDarkMode])

  // Initialize desktop animations
  const initDesktopAnimations = () => {
    const gallery = galleryRef.current
    const rightSection = rightRef.current
    
    if (!gallery || !rightSection) return

    // Kill existing scroll trigger to prevent conflicts
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
      scrollTriggerRef.current = null
    }

    // Set initial positions for all images except the first one
    const photos = photosRef.current.slice(1)
    gsap.set(photos, { yPercent: 101 })

    // Ensure first image is visible
    if (photosRef.current[0]) {
      gsap.set(photosRef.current[0], { yPercent: 0, opacity: 1 })
    }

    // Create scroll-triggered animation for desktop
    scrollTriggerRef.current = gsap.to(photos, {
      yPercent: 0,
      stagger: 1,
      duration: 1,
      ease: "linear.inOut",
      scrollTrigger: {
        trigger: gallery,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        pin: rightSection,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Calculate the index of the current image and update background color
          let index = Math.floor(self.progress * (bgColors.length))
          if (gallery) {
            const colors = isDarkMode ? bgColorsDark : bgColors
            gallery.style.backgroundColor = colors[index] || colors[colors.length - 1]
          }
        }
      }
    })

    // Button hover animations for desktop
    const buttons = gallery.querySelectorAll('.project-button')
    buttons.forEach((btn) => {
      const button = btn as HTMLElement
      const projectIndex = parseInt(button.dataset.index || '0')
      const borderColor = projects[projectIndex].color

      const handleMouseEnter = () => {
        gsap.to(button, {
          background: borderColor,
          color: "#ffffff",
          duration: 0.3,
        })
      }

      const handleMouseLeave = () => {
        gsap.to(button, {
          background: "transparent",
          color: isDarkMode ? "#ffffff" : "#000000",
          duration: 0.3,
        })
      }

      // Create properly typed event listeners
      const createMouseListener = (handler: () => void) => {
        return (e: Event) => handler();
      };
      
      const mouseEnterListener = createMouseListener(handleMouseEnter);
      const mouseLeaveListener = createMouseListener(handleMouseLeave);
      
      button.addEventListener('mouseenter', mouseEnterListener);
      button.addEventListener('mouseleave', mouseLeaveListener);

      // Store event listeners for cleanup
      (button as any)._listeners = { mouseEnterListener, mouseLeaveListener }
    })

    return () => {
      // Clean up event listeners
      buttons.forEach((btn) => {
        const button = btn as HTMLElement
        const listeners = (button as any)._listeners
        if (listeners) {
          button.removeEventListener('mouseenter', listeners.mouseEnterListener)
          button.removeEventListener('mouseleave', listeners.mouseLeaveListener)
        }
      })
    }
  }

  // Cleanup function for desktop animations
  const cleanupDesktopAnimations = () => {
    // Clean up event listeners
    if (galleryRef.current) {
      const buttons = galleryRef.current.querySelectorAll('.project-button')
      buttons.forEach((btn) => {
        const button = btn as HTMLElement
        const listeners = (button as any)._listeners
        if (listeners) {
          button.removeEventListener('mouseenter', listeners.mouseEnterListener)
          button.removeEventListener('mouseleave', listeners.mouseLeaveListener)
        }
      })
    }

    // Kill scroll trigger
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
      scrollTriggerRef.current = null
    }
  }

  useEffect(() => {
    const gallery = galleryRef.current
    const rightSection = rightRef.current
    
    if (!gallery || !rightSection) return

    // Check if we're on desktop
    isDesktopRef.current = window.innerWidth >= 768
    
    if (isDesktopRef.current) {
      // Initialize desktop animations
      const cleanup = initDesktopAnimations()
      initRef.current = true
      
      // Handle window resize
      const handleResize = () => {
        const isNowDesktop = window.innerWidth >= 768
        if (isNowDesktop !== isDesktopRef.current) {
          isDesktopRef.current = isNowDesktop
          
          if (!isNowDesktop) {
            // Switching to mobile, cleanup desktop animations
            cleanupDesktopAnimations()
            initRef.current = false
          } else {
            // Switching to desktop, initialize animations
            initDesktopAnimations()
            initRef.current = true
          }
        }
      }
      
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('resize', handleResize)
        if (cleanup) cleanup()
        cleanupDesktopAnimations()
        ScrollTrigger.getAll().forEach(st => st.kill())
        initRef.current = false
      }
    } else {
      // Simple mobile interactions - just basic button hover effects
      const buttons = gallery.querySelectorAll('.project-button')
      buttons.forEach((btn) => {
        const button = btn as HTMLElement
        const projectIndex = parseInt(button.dataset.index || '0')
        const borderColor = projects[projectIndex].color

        const handleTouchStart = () => {
          button.style.background = borderColor
          button.style.color = "#ffffff"
        }

        const handleTouchEnd = () => {
          setTimeout(() => {
            button.style.background = "transparent"
            button.style.color = isDarkMode ? "#ffffff" : "#000000"
          }, 150)
        }

        // Create properly typed event listeners
        const createTouchListener = (handler: () => void) => {
          return (e: Event) => handler();
        };
        
        const touchStartListener = createTouchListener(handleTouchStart);
        const touchEndListener = createTouchListener(handleTouchEnd);
        
        button.addEventListener('touchstart', touchStartListener);
        button.addEventListener('touchend', touchEndListener);

        // Store event listeners for cleanup
        (button as any)._mobileListeners = { touchStartListener, touchEndListener }
      })

      return () => {
        // Clean up event listeners
        buttons.forEach((btn) => {
          const button = btn as HTMLElement
          const listeners = (button as any)._mobileListeners
          if (listeners) {
            button.removeEventListener('touchstart', listeners.touchStartListener)
            button.removeEventListener('touchend', listeners.touchEndListener)
          }
        })
      }
    }
  }, [bgColors, bgColorsDark, projects, isDarkMode])

  return (
    <>
      {/* Desktop Version */}
      <div 
        ref={galleryRef}
        className="gallery hidden md:flex justify-center bg-[#f8f8f8] dark:bg-[#181818] min-w-full transition-colors duration-500"
      >
        {/* Left Section - Member Details */}
        <div className="left w-[30%] overflow-y-auto">
          <div className="detailsWrapper pl-8">
            {projects.map((project, index) => (
              <div key={index} className="details h-screen flex flex-col justify-center items-start w-full">
                <p 
                  className="text-xs md:text-sm mb-3 font-medium tracking-widest uppercase"
                  style={{ color: project.color }}
                >
                  {project.brand}
                </p>
                <h1 className="text-3xl md:text-4xl mb-4 leading-[3.5rem] font-light tracking-[-0.02em] text-gray-900 dark:text-white whitespace-pre-line">
                  {project.title}
                </h1>
                <p className="text-sm md:text-base md:text-xl mb-4 text-gray-600 dark:text-gray-300 font-light leading-relaxed max-w-md">
                  {project.tags}
                </p>
                {/* Contact Details */}
                <div className="flex flex-col space-y-3 mb-6">
                  <div className="flex items-center text-gray-700 dark:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 md:h-6 md:w-6 md:mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-sm md:text-base font-medium">{project.contact.email}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 md:h-6 md:w-6 md:mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-sm md:text-base font-medium">{project.contact.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 md:h-6 md:w-6 md:mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base font-medium">Reg: {project.contact.registration}</span>
                  </div>
                </div>
                {/* Social Media Icons */}
                <div className="flex space-x-4">
                  <a href={project.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ borderColor: project.color, color: project.color }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a href={project.socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ borderColor: project.color, color: project.color }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a href={project.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ borderColor: project.color, color: project.color }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href={project.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ borderColor: project.color, color: project.color }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Images */}
        <div 
          ref={rightRef}
          className="right w-[40%] h-screen flex justify-center items-center"
        >
          <div className="imgWrapper w-[400px] h-[400px] relative rounded-[50px] overflow-hidden shadow-2xl dark:shadow-gray-800/50">
            {projects.map((project, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) photosRef.current[index] = el
                }}
                className="images absolute w-full h-full transition-opacity duration-500"
              >
                <Image
                  src={project.image}
                  alt={project.brand}
                  fill
                  className="object-cover"
                  sizes="400px"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Version - Simple Stack Layout */}
      <div className="md:hidden bg-[#f8f8f8] dark:bg-[#181818] py-8 px-4">
        <div className="max-w-sm mx-auto space-y-8">
          {projects.map((project, index) => (
            <div key={index} className="mobile-project-card bg-white dark:bg-[#181818] rounded-2xl p-6 shadow-lg dark:shadow-gray-900/50">
              {/* Member Image */}
              <div className="w-full h-48 relative rounded-xl overflow-hidden mb-4">
                <Image
                  src={project.image}
                  alt={project.brand}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
              
              {/* Member Details */}
              <div className="space-y-3">
                <p 
                  className="text-sm font-medium tracking-widest uppercase"
                  style={{ color: project.color }}
                >
                  {project.brand}
                </p>
                <h2 className="text-2xl font-light tracking-[-0.02em] leading-tight whitespace-pre-line text-gray-900 dark:text-white">
                  {project.title}
                </h2>
                <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                  {project.tags}
                </p>
                {/* Contact Details */}
                <div className="flex flex-col space-y-3 mt-4">
                  <div className="flex items-center text-gray-700 dark:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 md:h-6 md:w-6 md:mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-sm md:text-base font-medium">{project.contact.email}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 md:h-6 md:w-6 md:mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-sm md:text-base font-medium">{project.contact.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 md:h-6 md:w-6 md:mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base font-medium">Reg: {project.contact.registration}</span>
                  </div>
                </div>
                {/* Social Media Icons */}
                <div className="flex space-x-4 mt-4">
                  <a href={project.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 active:scale-95" style={{ borderColor: project.color, color: project.color }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a href={project.socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 active:scale-95" style={{ borderColor: project.color, color: project.color }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a href={project.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 active:scale-95" style={{ borderColor: project.color, color: project.color }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href={project.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 active:scale-95" style={{ borderColor: project.color, color: project.color }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ProjectScroller