"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ThemeSwitch from "../toggle/toggleSwitch";
import { useStairs } from "../stairs/StairsContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Navbar2: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [isLinksHovered, setIsLinksHovered] = useState(false);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);
  const { startTransition } = useStairs();

  // Refs for GSAP animations
  const navRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement[]>([]);
  const contactRef = useRef<HTMLDivElement>(null);
  const topLineRef = useRef<HTMLSpanElement>(null);
  const bottomLineRef = useRef<HTMLSpanElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const iconTL = useRef<gsap.core.Timeline | null>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const isOpenRef = useRef(isOpen);

  // Update ref when isOpen changes
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // GSAP animations
  useGSAP(() => {
    // Set initial states
    if (navRef.current) {
      gsap.set(navRef.current, { xPercent: 100, display: 'none' });
    }
    
    const allLinks = gsap.utils.toArray(linksRef.current);
    const contactElement = contactRef.current;
    
    if (allLinks.length > 0 || contactElement) {
      gsap.set([allLinks, contactElement].filter(Boolean), {
        autoAlpha: 0,
        x: -20,
      });
    }

    // Slide in menu animation
    tl.current = gsap
      .timeline({ paused: true })
      .to(navRef.current, {
        display: 'flex',
        xPercent: 0,
        duration: 1,
        ease: "power3.out",
      })
      .to(
        allLinks,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1,
        },
        "<+0.6"
      )
      .to(
        contactElement,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "<+0.6"
      );

    // Hamburger icon animation
    if (topLineRef.current && bottomLineRef.current) {
      iconTL.current = gsap
        .timeline({
          paused: true,
        })
        .to(topLineRef.current, {
          rotation: 45,
          y: 4.5,
          duration: 0.8,
          ease: "power2.out",
        })
        .to(
          bottomLineRef.current,
          {
            rotation: -45,
            y: -4.5,
            duration: 0.8,
            ease: "power2.out",
          },
          "<"
        );
    }
  }, []);

  const toggleMenu = () => {
    if (isOpen) {
      if (tl.current) {
        tl.current.reverse().then(() => {
          if (navRef.current) {
            gsap.set(navRef.current, { display: 'none' });
          }
        });
      }
      if (iconTL.current) {
        iconTL.current.reverse();
      }
    } else {
      if (navRef.current) {
        gsap.set(navRef.current, { display: 'flex' });
      }
      if (tl.current) {
        tl.current.play();
      }
      if (iconTL.current) {
        iconTL.current.play();
      }
    }
    setIsOpen(!isOpen);
  };

  const burgerColor = (hovering: boolean) => {
    if (isOpen && topLineRef.current && bottomLineRef.current) {
      gsap.to([topLineRef.current, bottomLineRef.current], {
        background: hovering ? "#333" : "#666",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  // Add scroll handler function
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      
      // Special handling for home button
      if (href === '/#home') {
        // Check if we're on a different page
        if (window.location.pathname !== '/') {
          // Navigate to home page
          window.location.href = '/';
        } else {
          // If on same page, just scroll to top
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      } else {
        // Original behavior for other sections
        const element = document.querySelector(href.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setIsOpen(false); // Close mobile menu if open
    }
  };

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    // For internal navigation, let StairsWrapper handle the transition
    if (href.startsWith('/') && !href.startsWith('/#') && !href.startsWith('http')) {
      // Don't prevent default or manually trigger transition
      // Just let the normal navigation happen
      // The StairsWrapper will detect the route change and handle the transition
      if (href !== window.location.pathname) {
        // Allow navigation to proceed normally
        return;
      }
    }
  };

  const navItems = [
    { name: "Home", href: "/#home" },
    { name: "Leaderboard", href: "https://leaderboard-linpack.vercel.app/" },
    { name: "Expense", href: "https://linpack-expense-tracker.vercel.app/" },
    // { name: "About Us", href: "/#aboutus" },
    { name: "Certificate", href: "/certificate" },
    { name: "Ticket", href: "/ticket" },
    { name: "Gallery", href: "/gallery" },
  ];

  // Create a separate array for desktop nav items excluding Expense
  const desktopNavItems = navItems.filter(item => item.name !== "Expense");

  const getItemStyle = (itemName: string) => {
    return "hover:text-yellow-500 transition-all duration-300 ease-in-out bg-transparent shadow-none font-extralight tracking-wide bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent drop-shadow-sm";
  };

  return (
    <>
      <nav
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] transition-all duration-500 ease-out
          bg-white/80 dark:bg-gray-900/60 shadow-2xl rounded-full px-4 py-2
          flex items-center justify-between
          border border-gray-200/40 dark:border-gray-700/30 backdrop-blur-xl
          ${isNavbarHovered 
            ? 'w-[99vw] max-w-7xl md:w-[92vw] md:max-w-7xl' 
            : 'w-[97vw] max-w-6xl md:w-[88vw] md:max-w-6xl'
          }
        `}
        style={{ 
          transition: 'width 0.5s cubic-bezier(0.4, 0.2, 0.2, 1), max-width 0.5s cubic-bezier(0.4, 0.2, 0.2, 1), box-shadow 0.3s ease'
        }}
        onMouseEnter={() => {
          setIsLinksHovered(true);
          setIsNavbarHovered(true);
        }}
        onMouseLeave={() => {
          setIsLinksHovered(false);
          setIsNavbarHovered(false);
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/#home">
            <div className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 transition-colors duration-300 ease-out flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Club Logo"
                width={36}
                height={36}
                className="rounded-full shadow-md"
              />
              <span className="whitespace-nowrap font-bold tracking-wide bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent drop-shadow-sm text-lg md:text-xl dark:bg-gradient-to-r dark:from-white dark:via-gray-200 dark:to-white">
                MATLAB & LaTeX Club
              </span>
            </div>
          </Link>
        </div>
        {/* Spacer to prevent hover glitch */}
        <div className="hidden md:block" style={{ minWidth: 32, marginLeft: 16, marginRight: 16 }} />
        {/* Desktop Menu */}
        <div
          className="hidden md:flex items-center transition-all duration-500 ease-out space-x-2 md:space-x-6 lg:space-x-10"
          style={{
            minWidth: 350,
            maxWidth: isNavbarHovered ? 800 : 700,
            width: '100%',
            justifyContent: 'center',
          }}
        >
          {desktopNavItems.map((item) => (
            <div key={item.name} className="relative">
              {item.href.startsWith('http') ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-full text-sm font-semibold tracking-wider text-gray-800 dark:text-gray-300 px-4 py-2.5 ${getItemStyle(item.name)}
                    hover:bg-gray-100/70 dark:hover:bg-gray-800/70 hover:scale-110 transform transition-all duration-300
                  `}
                  aria-label={item.name}
                  style={{ cursor: 'pointer' }}
                >
                  {item.name}
                </a>
              ) : (
                <Link 
                  href={item.href}
                  onClick={(e) => {
                    handleScroll(e, item.href);
                    handleNavigation(e, item.href);
                  }}
                  className={`rounded-full text-sm font-semibold tracking-wider text-gray-800 dark:text-gray-300 px-4 py-2.5 ${getItemStyle(item.name)}
                    hover:bg-gray-100/70 dark:hover:bg-gray-800/70 hover:scale-110 transform transition-all duration-300
                  `}
                  aria-label={item.name}
                  style={{ cursor: 'pointer' }}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
          <span className="ml-4 flex items-center"><ThemeSwitch /></span>
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <ThemeSwitch />
          <button
            onClick={toggleMenu}
            className="ml-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 focus:outline-none"
            aria-label="Toggle menu"
            ref={burgerRef}
            onMouseEnter={() => burgerColor(true)}
            onMouseLeave={() => burgerColor(false)}
          >
            <div className="flex flex-col items-center justify-center gap-2 cursor-pointer">
              <span
                ref={topLineRef}
                className="block w-6 h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full origin-center"
              ></span>
              <span
                ref={bottomLineRef}
                className="block w-6 h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full origin-center"
              ></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu with Sliding Animation */}
      <nav
        ref={navRef}
        className="fixed z-50 flex flex-col justify-between w-[105vw] h-[100vh] px-5 sm:px-10 uppercase py-20 gap-y-10 md:w-1/2 md:left-1/2 md:hidden shadow-2xl border-l-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
      >
        {/* Add margin top to avoid navbar overlap */}
        <div className="mt-20"></div>
        
        <div className="flex flex-col text-3xl gap-y-2 md:text-4xl lg:text-5xl">
          {navItems.map((item, index) => {
            return (
              <div
                key={item.name}
                ref={(el) => {
                  if (el) {
                    linksRef.current[index] = el;
                  }
                }}
              >
                {item.href.startsWith('http') ? (
                  <a
                    className="transition-all duration-300 cursor-pointer hover:text-yellow-500 dark:hover:text-yellow-400"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    className="transition-all duration-300 cursor-pointer hover:text-yellow-500 dark:hover:text-yellow-400"
                    href={item.href}
                    onClick={(e) => {
                      handleScroll(e, item.href);
                      handleNavigation(e, item.href);
                      toggleMenu();
                    }}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
        <div
          ref={contactRef}
          className="flex flex-col flex-wrap justify-between gap-8 md:flex-row"
        >
          <div>
            <p className="tracking-wider text-gray-500 dark:text-gray-400">Contact</p>
            <a
              className="tracking-widest text-sm lg:text-xl lowercase text-pretty cursor-pointer transition-all duration-300 hover:text-yellow-500 dark:hover:text-yellow-400"
              href="mailto:contact@matlablatex.club"
            >
              contact@matlablatex.club
            </a>
          </div>
          <div>
            <p className="tracking-wider text-gray-500 dark:text-gray-400">Social Media</p>
            <div className="flex flex-col flex-wrap gap-x-4 md:flex-row">
              <a
                href="https://github.com/matlab-latex-club"
                target="_blank"
                className="tracking-widest leading-loose text-sm lg:text-xl uppercase text-pretty transition-all duration-300 cursor-pointer hover:text-yellow-500 dark:hover:text-yellow-400"
              >
                {"{ "}GitHub{" }"}
              </a>
              <a
                href="https://linkedin.com/company/matlab-latex-club"
                target="_blank"
                className="tracking-widest leading-loose text-sm lg:text-xl uppercase text-pretty transition-all duration-300 cursor-pointer hover:text-yellow-500 dark:hover:text-yellow-400"
              >
                {"{ "}LinkedIn{" }"}
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar2;