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
- **November 1, 2025**: Footer Links & Avatar Persistence Enhancement
  - **Privacy Policy, Terms of Service, and Contact Us Pages**:
    - Created three new professional pages: Privacy Policy, Terms of Service, and Contact Us
    - Each page features consistent layout with purple branding (#5F259F)
    - Professional content sections with clear hierarchy and organization
    - Dark mode support throughout all pages
    - "Back to Home" navigation button on each page
    - Contact Us page includes phone support, email, headquarters info, and emergency contacts
  - **Footer Link Updates**:
    - Updated footer to link to new internal pages (was linking to external Truist URLs)
    - Links now properly route within the application using wouter routing
    - Three main footer links: Privacy Policy, Terms of Service, Contact Us
    - All links functional and tested
  - **Avatar Persistence Verification**:
    - Confirmed and enhanced admin avatar persistence in `server/init-accounts.ts`
    - Code explicitly preserves avatar field during account initialization
    - Only password, isAdmin, and isBlocked fields are reset on restart for security
    - Avatar and all other customizations remain intact across imports and restarts
    - Updated console logging to clarify avatar preservation

- **October 31, 2025**: Admin Balance & Real-Time Notification System
  - **Admin Personal Balance**:
    - Created separate admin account ("Admin Operations") with $1,000,000 starting balance
    - Admin balance displayed in dedicated card on Admin Dashboard
    - "Add Funds" feature allows admin to add money to their account for sending to users
    - Balance separate from users' total balance - admin has their own personal funds
    - All balance updates persist across imports and restarts
  - **Real-Time Notifications**:
    - Added notifications table in database schema (`shared/schema.ts`)
    - Notifications automatically created when:
      - New user is created
      - Admin credits/debits user balance
    - Bell icon in admin header shows unread count badge (red circle)
    - Full notification dialog with:
      - List of all notifications (unread highlighted in purple)
      - Mark individual notifications as read
      - "Mark all as read" button
      - Timestamps in local format
    - Polling-based updates every 3 seconds for "real-time" feel
  - **Immediate Balance Updates**:
    - Implemented TanStack Query cache invalidation
    - When admin credits/debits user, both admin and user balances update immediately
    - No page refresh needed - all updates happen in real-time
  - **Data Persistence Improvements**:
    - Enhanced `server/init-accounts.ts` to only update security fields
    - All user customizations preserved: avatar, nickname, email, balance, etc.
    - Only password, isAdmin, and isBlocked fields reset on restart for security
    - Admin operations account created once and preserved forever

- **October 31, 2025**: Permanent Account & Session Fixes
  - **Account Number Update**: Changed from 10 to 13 digits (Truist standard)
    - Fixed Mark Lowry account number to permanent value: `4729186503421`
    - Updated `generateAccountNumber()` in `server/storage.ts` to generate 13-digit numbers for new accounts
    - All new users will receive random 13-digit account numbers
  - **Admin Avatar Fix**: Set admin avatar to permanent value "admin"
    - Avatar field now persists across imports and restarts
    - Admin avatar will not change when importing to new agent
  - **Separate Admin & User Sessions**: 
    - Implemented dual session system in `server/index.ts`
    - Admin sessions use cookie: `admin.sid` (path: `/api/admin`)
    - User sessions use cookie: `user.sid` (global path)
    - Admin and users can now be logged in simultaneously without conflicts
    - Each session is completely independent and secure

- **October 30, 2025**: User Date Joined & Admin Editing System
  - **Date Joined Field**:
    - Added `dateJoined` timestamp field to user schema in `shared/schema.ts`
    - Mark Lowry's account shows join date: **August 11, 2019**
    - Date displayed in USA format (MMMM d, yyyy) on Account Holder page
    - Automatically set for new user accounts upon creation
    - Database schema updated with proper timestamp handling
  - **Admin User Editing**:
    - Full admin interface for editing user details in Admin Dashboard
    - Edit dialog allows updating: Full Name, Email, Username, Password, Date Joined
    - New API endpoint: `/api/admin/users/:userId/update` with validation
    - `updateUser` function in storage layer with secure password hashing
    - Only changed fields are submitted to reduce overhead
    - Real-time cache invalidation after updates
    - Comprehensive validation using Zod schemas
  - **Account Holder Display**:
    - Date Joined shows below Username in Account Holder section
    - Formatted as "August 11, 2019" (USA format)
    - Accessible via user dashboard details tab
    - Uses date-fns for consistent formatting

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
