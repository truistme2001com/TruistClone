# Truist Bank Website Replica

## Overview
This is a pixel-perfect replica of the Truist bank website (https://www.truist.com/), featuring their signature purple branding (#5F259F), comprehensive banking product showcase, and modern financial services interface.

## Project Purpose
Create an exact replica of the Truist bank website with:
- Identical Truist purple color scheme and branding
- All major sections: Hero, Login, Products, Promotions, Mobile App, Video, NFL Partnership, Money & Mindset
- Professional banking imagery and layout
- Responsive design matching the original

## Recent Changes
- **October 30, 2025**: Profile Avatar System Update
  - **Cute Avatar Images**: Replaced emoji avatars with 12 adorable kawaii-style profile pictures
    - Available avatars: Teddy Bear, Cat, Dog, Panda, Bunny, Fox, Unicorn, Robot, Penguin, Koala, Owl, Sloth
    - All avatars stored in `attached_assets/generated_images/`
    - Images display in header, avatar selection dialog, and settings panel
    - Avatar selection updates in real-time and persists to database
    - Default avatar: Teddy Bear (for new users or legacy emoji IDs)
  - **Improved Avatar UI**:
    - Circular profile pictures with proper sizing and overflow handling
    - Avatar selection dialog shows all 12 options in a 4-column grid
    - Hover effects and purple border highlights for selected avatar
    - Smooth transitions and scale animations on selection

- **October 30, 2025**: Card Management & Interactive Features (PERMANENT CHANGES)
  - **Card Lock/Unlock System**:
    - Added database fields: `debitCardLocked` and `creditCardLocked` in `shared/schema.ts`
    - Implemented `/api/cards/toggle-lock` endpoint in `server/routes.ts`
    - Toggle switches for each card with real-time status updates
    - Visual feedback: Lock/Unlock icons and dynamic card status badges
    - Toast notifications for lock/unlock actions
    - Locked cards show red "Locked" badge, unlocked show green "Active" badge
  - **Card Enlargement Feature**:
    - Click any card to view enlarged version in dialog modal
    - Enlarged view shows full card details with lock/unlock toggle
    - Scale animation and enhanced visual presentation
    - Easy access to card limits and status from enlarged view
  - **Professional Card Management**:
    - Report Lost button shows toast with 1-800-TRUIST number
    - Set PIN button shows toast directing to ATM or customer service
    - View Transactions button navigates to transactions tab
    - All interactions use toast notifications instead of alerts
  - Updated permanent user account data in `server/init-accounts.ts`:
    - Business name: "M. Lowry Vocal Band" (auto-updates on every server restart)
    - Account type: "business checkings"
    - User: Mark Lowry (marklowry748@gmail.com / marklowry748)
    - Password: lowry123
    - Debit Card (Visa): 4444 1703 8692 6095 | Exp: 03/29 | CVV: 531
    - Credit Card (Mastercard): 5284 1705 4571 6179 | Exp: 08/28 | CVV: 480
  - Enhanced User Dashboard with real-time greeting:
    - "Good morning M. Lowry" (before 12pm)
    - "Good afternoon M. Lowry" (12pm-6pm)
    - "Good evening M. Lowry" (after 6pm)
  - All notifications bell and settings icons fully functional
  - Cards properly display CVV and expiry dates
  
- **October 29, 2025**: Initial project setup
  - Configured Truist purple design tokens (#5F259F primary)
  - Generated all hero and promotional images
  - Built complete frontend: Header, Hero with Login, Product Carousel, Promotional Cards, Mobile App Section, Video Player, NFL Partnership, Money & Mindset Blog, Footer
  - Implemented responsive design with mobile/desktop layouts
  - Added fixed login form on desktop (right side)

## Project Architecture

### Frontend Structure
- **Header**: Navigation with Personal, Small Business, Commercial, Wealth, About Truist
- **Hero Section**: Full-width image with Truist One Checking promotion and overlay
- **Login Form**: Fixed position (desktop) with User ID, Password, security links
- **Product Carousel**: 8 products with purple icons (Checking, Savings, Credit Card, etc.)
- **Promotional Sections**: 
  - Money Market Account
  - LightStream unsecured loans
  - Truist One Checking (with image)
  - Home Equity Lending (with image)
  - Credit card offers
  - Fraud and Security
- **Mobile App Section**: App mockup, QR code, store badges
- **Video Section**: "Let your light shine" promotional content with play button
- **NFL Partnership**: Bradley Chubb and Bijan Robinson community spotlight
- **Money & Mindset**: Blog cards for savings tips and side hustles
- **Footer**: Comprehensive links, disclaimers, FDIC info

### Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Routing**: Wouter
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS with custom Truist purple tokens
- **Icons**: Lucide React

### Design System
- **Primary Color**: #5F259F (Truist signature purple) - HSL: 273 61% 38%
- **Typography**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Spacing**: Consistent padding/margins (p-4, py-12, py-16, py-20)
- **Components**: Shadcn UI (Card, Button, Input, Label, Checkbox)
- **Layout**: Max-width 7xl containers, responsive grid layouts
- **Shadows**: Subtle elevation for cards and interactive elements

### Key Features
- Responsive design (mobile-first approach)
- Fixed login form on desktop (slides to inline on mobile)
- Interactive product carousel
- Video player with play button
- App download section with QR code
- Professional imagery throughout
- Comprehensive footer with disclaimers

## User Preferences
- Exact replica of Truist.com required
- All colors must match (#5F259F purple theme)
- Same layout and sections as original
- Professional banking aesthetic

## Images
All images generated and stored in `attached_assets/generated_images/`:
- Kids jumping in lake (hero)
- Kids trick-or-treating (Truist One Checking promo)
- Banking mobile app mockup
- NFL players (Bradley Chubb, Bijan Robinson)
- Woman with savings jars (Money & Mindset)
- Side hustle workspace (Money & Mindset)
- Modern family home (Home Equity promo)

## Environment
- Node.js 20
- Vite dev server
- Express backend (minimal, for future login functionality)
