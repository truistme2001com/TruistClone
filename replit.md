# Truist Bank Website Replica

## Overview
This project is a pixel-perfect replica of the Truist bank website (https://www.truist.com/). Its purpose is to showcase banking products and modern financial services with an identical Truist purple branding (#5F259F) and comprehensive layout, including all major sections like Hero, Login, Products, Promotions, Mobile App, Video, NFL Partnership, and Money & Mindset. The replica aims for a professional banking aesthetic and responsive design.

## User Preferences
- Exact replica of Truist.com required
- All colors must match (#5F259F purple theme)
- Same layout and sections as original
- Professional banking aesthetic

## System Architecture

### Frontend Structure
The frontend includes a Header, Hero Section with a fixed Login Form (desktop), Product Carousel, various Promotional Sections (Money Market, LightStream, Truist One Checking, Home Equity, Credit Cards, Fraud/Security), Mobile App Section, Video Section, NFL Partnership, Money & Mindset Blog, and a comprehensive Footer.

### Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Routing**: Wouter
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS with custom Truist purple tokens
- **Icons**: Lucide React

### Design System
- **Primary Color**: #5F259F (Truist signature purple)
- **Typography**: System fonts
- **Spacing**: Consistent padding/margins (e.g., p-4, py-12)
- **Components**: Shadcn UI (Card, Button, Input, Label, Checkbox)
- **Layout**: Max-width 7xl containers, responsive grid layouts
- **Shadows**: Subtle elevation for interactive elements

### Key Features
- Responsive design with a mobile-first approach.
- Fixed login form on desktop, becoming inline on mobile.
- Interactive product carousel and video player.
- App download section with QR code.
- Admin Dashboard with account application approval workflow, real-time notifications, and user editing capabilities.
- Dual-storage architecture supporting PostgreSQL and in-memory storage based on environment variables.
- Persistent user data and settings, including avatars and card lock/unlock statuses.
- Separate admin and user session management.
- Dynamic greeting based on time of day.

### Technical Implementations
- **Dual-Storage System**: Automatic detection of storage mode (PostgreSQL via `DATABASE_URL` or in-memory).
  - **With DATABASE_URL**: Uses PostgreSQL database + PostgreSQL session store
  - **Without DATABASE_URL**: Uses in-memory storage + MemoryStore for sessions
  - Seamless fallback - no code changes needed between deployment environments
  - **In-Memory Mode Limitations**:
    - **Non-Persistent**: All data lost on server restart
    - **Single-Instance Only**: Cannot scale horizontally
    - **Session Loss**: Sessions reset on restart
    - **Best For**: Development, testing, demos, temporary deployments
    - **Not For**: Production banking applications requiring data persistence
- **Account Application Approval**: Admin dashboard tab for approving/declining applications with detailed views, status updates, and historical records.
- **Real-Time Notifications**: Database-backed notification system with unread counts, status indicators, and immediate updates.
- **Permanent Account & Session Management**: 13-digit account numbers, persistent admin avatar ("owl"), and independent admin/user sessions using distinct cookies.
- **User Editing & Date Joined**: Admin interface for updating user details and a `dateJoined` field displayed on the account holder page.
- **Profile Avatar System**: 12 kawaii-style avatars replacing emojis, with real-time selection and persistence.
- **Card Management**: Lock/unlock debit and credit cards with real-time status, visual feedback, and an enlarged card view with full details.
- **Permanent User Data**: Pre-configured permanent user data for Mark Lowry, including business name, account type, and card details.

## External Dependencies
- **Database**: PostgreSQL (optional, for production environments)
- **Environment**: Node.js 20, Vite dev server, Express backend