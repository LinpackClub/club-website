'use client'

import { FiSun, FiMoon } from "react-icons/fi"
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from "next/image"
import { useStairs } from '@/components/stairs/StairsContext'

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  const { startTransition, endTransition } = useStairs()
  const [isChangingTheme, setIsChangingTheme] = useState(false)

  useEffect(() =>  setMounted(true), [])

  const aggressiveCleanup = () => {
    try {
      // Kill ALL GSAP animations and reset everything
      if (typeof window !== 'undefined' && (window as any).gsap) {
        const gsap = (window as any).gsap
        
        // Kill all tweens on all elements
        gsap.killTweensOf("*")
        
        // Clear global timeline completely
        gsap.globalTimeline.clear()
        gsap.globalTimeline.kill()
        
        // Destroy all ScrollTrigger instances
        if (gsap.ScrollTrigger) {
          gsap.ScrollTrigger.killAll(true) // Kill with immediate flag
          gsap.ScrollTrigger.clearMatchMedia()
          gsap.ScrollTrigger.clearScrollMemory()
          gsap.ScrollTrigger.reset()
        }
        
        // Clear all GSAP inline styles and cached values
        gsap.set("*", { 
          clearProps: "all",
          // Force reset common GSAP properties
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: '',
          transform: '',
          filter: ''
        })
        
        // Kill any remaining animation frames or timers
        gsap.ticker.kill()
      }
      
      // Clear Lenis if it exists
      if (typeof window !== 'undefined') {
        const lenisInstances = (window as any).lenis || []
        if (Array.isArray(lenisInstances)) {
          lenisInstances.forEach((lenis: any) => {
            if (lenis && typeof lenis.destroy === 'function') {
              lenis.destroy()
            }
          })
        }
        // Clear lenis reference
        ;(window as any).lenis = []
      }
      
      // Clear all timeouts and intervals more aggressively
      if (typeof window !== 'undefined') {
        // Clear all possible timeouts (higher range)
        for (let i = 0; i < 10000; i++) {
          clearTimeout(i)
          clearInterval(i)
        }
        
        // Cancel all animation frames
        let lastFrameId = requestAnimationFrame(() => {})
        for (let i = 0; i < lastFrameId + 100; i++) {
          cancelAnimationFrame(i)
        }
      }
      
      // Clear any cached DOM measurements
      if (typeof window !== 'undefined') {
        // Force reflow
        document.body.offsetHeight
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        window.scrollTo(0, 0)
      }
      
    } catch (error) {
      console.log('Aggressive cleanup completed')
    }
  }

  const handleThemeChange = (newTheme: string) => {
    if (isChangingTheme) return // Prevent multiple clicks
    
    setIsChangingTheme(true)
    
    // Start the stairs transition
    startTransition()
    
    // Change the theme immediately
    setTheme(newTheme)
    
    // Store the theme change in sessionStorage for page reload
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pendingThemeChange', newTheme)
      sessionStorage.setItem('themeChangeInProgress', 'true')
      sessionStorage.setItem('forceHomePageLoad', 'true')
      
      // Clear any cached animation states
      sessionStorage.removeItem('animationStates')
      sessionStorage.removeItem('scrollPosition')
      localStorage.removeItem('gsapCache')
      localStorage.removeItem('lenisCache')
    }
    
    // Aggressive cleanup and force reload to home page after stairs transition
    setTimeout(() => {
      aggressiveCleanup()
      
      // Force hard reload to home page (not current page) to start fresh
      if (typeof window !== 'undefined') {
        // Clear browser cache and force reload to home
        const baseUrl = window.location.origin
        
        // Use replace to force go to home page instead of current page
        setTimeout(() => {
          window.location.replace(baseUrl + '/?nocache=' + Date.now())
        }, 50)
      }
    }, 650) // Slightly longer to ensure stairs animation completes
  }

  // Check for pending theme change on mount (after page reload)
  useEffect(() => {
    if (typeof window !== 'undefined' && mounted) {
      const pendingTheme = sessionStorage.getItem('pendingThemeChange')
      const themeChangeInProgress = sessionStorage.getItem('themeChangeInProgress')
      const forceHomePageLoad = sessionStorage.getItem('forceHomePageLoad')
      
      if (pendingTheme && themeChangeInProgress === 'true') {
        // Clear the flags immediately
        sessionStorage.removeItem('pendingThemeChange')
        sessionStorage.removeItem('themeChangeInProgress')
        sessionStorage.removeItem('forceHomePageLoad')
        
        // Ensure we're on the home page and scroll to top
        if (window.location.pathname !== '/') {
          window.location.replace('/?theme=' + pendingTheme)
          return
        }
        
        // Force scroll to top for fresh start
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        window.scrollTo(0, 0)
        
        // Apply theme correctly after reload
        setTheme(pendingTheme)
        
        // Clear any residual animation artifacts
        if ((window as any).gsap) {
          const gsap = (window as any).gsap
          // One final cleanup on load
          gsap.set("*", { clearProps: "transform,opacity,filter" })
        }
        
        // End transition and force fresh animation initialization
        setTimeout(() => {
          endTransition()
          
          // Trigger a resize event to reinitialize animations
          window.dispatchEvent(new Event('resize'))
          
          // Force DOM reflow for fresh start
          document.body.offsetHeight
        }, 200)
      }
    }
  }, [mounted, setTheme, endTransition])

  if (!mounted) return (
    <Image
      src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
      width={36}
      height={36}
      sizes="36x36"
      alt="Loading Light/Dark Toggle"
      priority={false}
      title="Loading Light/Dark Toggle"
      className="w-9 h-9 px-2"
    />
  )

  if (resolvedTheme === 'dark') {
    return <FiSun onClick={() => handleThemeChange('light')} className="cursor-pointer" />
  }

  if (resolvedTheme === 'light') {
    return <FiMoon onClick={() => handleThemeChange('dark')} className="cursor-pointer" />
  }

}