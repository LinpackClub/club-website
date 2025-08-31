'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './InfiniteScroll.module.css';

const InfiniteScroll = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices on component mount
  useEffect(() => {
    // Check if it's a touch device
    const checkMobile = () => {
      const isTouchDevice = (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
      setIsMobile(isTouchDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Sample items for the infinite scroll with club-related content
  const items = [
    { id: 1, name: 'Workshops', image: '/apple-touch-icon.png' },
    { id: 2, name: 'Hackathons', image: '/images/hero-image-2.jpg' },
    { id: 3, name: 'Tech Talks', image: '/images/image2.jpg' },
    { id: 4, name: 'Projects', image: '/images/image3.jpg' },
    { id: 5, name: 'Mentorship', image: '/images/image4.jpg' },
    { id: 6, name: 'Networking', image: '/images/image5.jpg' },
    { id: 7, name: 'Competitions', image: '/images/image7.jpg' },
    { id: 8, name: 'Resources', image: '/images/image8.jpg' },
    { id: 9, name: 'Tutorials', image: '/images/tutorial2.jpg' },
    { id: 10, name: 'Webinars', image: '/images/image9.jpg' },
    { id: 11, name: 'Bootcamps', image: '/images/image10.jpg' },
    { id: 12, name: 'Challenges', image: '/images/image11.jpg' },
    { id: 13, name: 'Showcases', image: '/images/image12.jpg' },
    { id: 14, name: 'Meetups', image: '/images/hero-image-3.jpg' },
    { id: 15, name: 'Seminars', image: '/images/matlab.png' },
    { id: 16, name: 'Labs', image: '/images/overleaf.png' },
  ];

  // Create multiple duplicates for smoother infinite scroll
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="py-8 bg-white dark:bg-[#131313]">
      <div className={styles.wrapper}>
        <div 
          className={`${styles.track} ${isMobile ? styles.noInterrupt : ''}`}
          onTouchStart={(e) => {
            // Prevent touch events from causing scroll pauses on mobile
            if (isMobile) {
              e.stopPropagation();
            }
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className={styles.item}
              onTouchStart={(e) => isMobile && e.stopPropagation()}
            >
              <div className={styles.imageContainer}>
                <Image 
                  src={item.image} 
                  alt={item.name}
                  fill
                  sizes="200px"
                  className={styles.itemImage}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteScroll;