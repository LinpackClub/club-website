# MATLAB & Overleaf Club Website

## Overview

This is a modern, responsive website for the MATLAB & Overleaf Club at VIT Bhopal University. The platform serves as a comprehensive hub for students to access educational resources, register for events, generate certificates, and engage with the club community. Built with Next.js 15 and TypeScript, the website features sophisticated animations, interactive tutorials, QR code functionality, and a chatbot integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with App Router for server-side rendering and optimized performance
- **Language**: TypeScript for type safety and better development experience
- **Styling**: Tailwind CSS for utility-first styling with custom animations and responsive design
- **Animation Libraries**: 
  - Framer Motion for React-based animations and page transitions
  - GSAP with ScrollTrigger for complex scroll-based animations and smooth interactions
  - Lenis for smooth scroll implementation
- **State Management**: React Context API for global state (theme, navigation transitions)
- **UI Components**: Custom components with Radix UI primitives and shadcn/ui patterns
- **Theme System**: Next-themes for dark/light mode with system preference detection

### Backend Architecture
- **API Layer**: Hybrid approach using both Next.js API routes and FastAPI (Python)
- **Next.js API Routes**: Handle Google Sheets integration for event entry tracking
- **FastAPI Backend**: Manages certificate generation, QR code creation, and ticket validation
- **Middleware**: Custom Next.js middleware for visitor tracking using Vercel KV
- **File Structure**: App Router architecture with organized component hierarchy

### Data Storage Solutions
- **Static Data**: JSON files for user credentials, ticket information, and certificate data
- **Visitor Analytics**: Vercel KV (Redis) for real-time visitor count tracking
- **Google Sheets Integration**: For event entry logging and team management
- **File Storage**: Static assets including images, videos, and fonts stored in public directory

### Authentication and Authorization
- **QR Code Verification**: Hash-based authentication system for tickets and certificates
- **Google Sheets Authentication**: Service account-based authentication for Google Sheets API
- **Data Validation**: Server-side validation for registration numbers and team assignments
- **Security Headers**: CSP and permission policies configured via Vercel deployment

### External Dependencies
- **Vercel KV**: Redis-compatible database for visitor analytics and caching
- **Google Sheets API**: For real-time event entry tracking and team management
- **Google Service Account**: Authentication for Google Sheets integration
- **Hugging Face**: External chatbot API endpoint for AI-powered assistance
- **QR Code Libraries**: 
  - html5-qrcode for scanning functionality
  - qrcode (Python) for QR code generation
- **Image Processing**: Pillow (Python) for certificate and ticket image generation
- **Google Maps**: Embedded maps for location display