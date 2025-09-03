'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Stairs from './index';
import { useStairs } from './StairsContext';

interface StairsWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

export default function StairsWrapper({ children, backgroundColor }: StairsWrapperProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isTransitioning, startTransition, endTransition } = useStairs();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Create a string representation of the current route
  const currentRoute = `${pathname}?${searchParams?.toString() || ''}`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const prevRoute = sessionStorage.getItem('lastRoute');
        const hasInitialized = sessionStorage.getItem('stairsInitialized') === 'true';
        
        // Check if this is a real route change (not initial load)
        const isRealRouteChange = hasInitialized && prevRoute !== null && currentRoute !== prevRoute;
        
        if (isRealRouteChange) {
          // Start transition for real navigation
          startTransition();
          
          // Update children after a delay to allow transition to complete
          const timer = setTimeout(() => {
            setDisplayChildren(children);
            endTransition();
          }, 600);
          
          // Save the new route
          sessionStorage.setItem('lastRoute', currentRoute);
          
          return () => {
            clearTimeout(timer);
          };
        } else {
          // For initial load or first visit, just update children without transition
          setDisplayChildren(children);
          setIsInitialLoad(false);
          
          // Mark as initialized and save the route
          sessionStorage.setItem('lastRoute', currentRoute);
          sessionStorage.setItem('stairsInitialized', 'true');
        }
      } catch (e) {
        // Fallback if sessionStorage fails
        setDisplayChildren(children);
        setIsInitialLoad(false);
      }
    } else {
      // Server-side rendering fallback
      setDisplayChildren(children);
      setIsInitialLoad(false);
    }
  }, [currentRoute, children, startTransition, endTransition]);

  return (
    <Stairs backgroundColor={backgroundColor}>
      {displayChildren}
    </Stairs>
  );
}