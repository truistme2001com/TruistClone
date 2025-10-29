# Truist Bank Website - Exact Replica Design Guidelines

## Design Approach
**Reference-Based Approach**: Create a pixel-perfect replica of the Truist bank website (https://www.truist.com/). All design decisions, colors, layouts, and content must match the original exactly.

## Brand Colors (Truist Official Palette)
- **Primary Purple**: #5F259F (Truist signature purple)
- **Secondary Purple**: #430F6C (darker purple for depth)
- **Light Purple**: #F5F0FA (backgrounds and subtle accents)
- **White**: #FFFFFF (primary background)
- **Text Colors**: 
  - Primary text: #1A1A1A
  - Secondary text: #4A4A4A
  - Link purple: #5F259F

## Typography
- **Primary Font**: Truist Sans (fallback to system fonts: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)
- **Headings**: Bold weights (700), purple color
- **Body**: Regular weight (400), dark gray
- **Hierarchy**:
  - H1: 48px desktop, 36px mobile
  - H2: 36px desktop, 28px mobile
  - H3: 24px desktop, 20px mobile
  - Body: 16px

## Layout System
- **Spacing Units**: Use Tailwind spacing of 2, 4, 6, 8, 12, 16, 20, 24 units
- **Container**: max-w-7xl with px-4 md:px-8
- **Section Padding**: py-12 md:py-16 lg:py-20
- **Grid System**: 12-column grid for desktop, single column for mobile

## Core Components

### Hero Section
- Full-width background image (kids jumping in lake)
- Overlay gradient (purple tint at 30% opacity)
- Centered content with Truist One Checking promotion
- Two CTAs: "Learn more" (outline) and "Open now" (solid purple)
- Height: 600px desktop, 500px mobile

### Login Form (Sidebar)
- Fixed position on right side (desktop only)
- White background with subtle shadow
- Purple "Sign in" button
- Links styled in purple
- "Need a user ID?" and security links below form

### Product Navigation Carousel
- 8 items: Checking, Savings, Credit Card, Small Business, Loans, Mortgage, Premier Banking, Investments
- Purple 2XL decorative icons above each label
- Horizontal scroll on mobile
- Grid layout on desktop (4 columns)
- "View all products" link below

### Promotional Cards
- White cards with subtle shadow (shadow-lg)
- Left-aligned content
- Purple headings
- Two-button layout: "Open now" and "Learn more"
- 2-column grid on desktop, stack on mobile
- Rounded corners (rounded-xl)

### Video Section
- Background image with play button overlay
- "Let your light shine" heading
- Wistia video embed
- Transcript accordion below
- Full-width layout

### NFL Partnership Section
- NFL + Truist logo lockup
- "See the power of care" heading
- Player photos (Bradley Chubb, Bijan Robinson)
- Purple CTA button

### Money & Mindset Section
- Blog-style card layout
- 2 featured articles with images
- Purple text links
- Light purple background section

## Images
1. **Hero Image**: Large landscape photo of kids jumping in lake (joyful, summery vibe) - full-width, 600px height
2. **Promotional Images**: 
   - Kids trick-or-treating for Truist One Checking
   - Professional home/lifestyle images for home equity, credit cards
3. **Mobile App Screenshot**: iPhone/Android mockup showing Truist app interface
4. **QR Code**: App download QR code
5. **NFL Players**: Professional headshots/action shots of Bradley Chubb and Bijan Robinson
6. **Money Mindset**: Lifestyle images related to savings and side hustles

## Interactive Elements
- **Buttons**: 
  - Primary: Solid purple (#5F259F) with white text, rounded-lg, px-6 py-3
  - Secondary: Outline purple border, purple text, rounded-lg, px-6 py-3
  - Buttons on images: Blurred white/light background with dark text
- **Carousel**: Horizontal scroll with arrow navigation
- **Form Inputs**: Rounded borders, focus state with purple outline
- **Video Player**: Custom play button (purple circle with white triangle)

## Footer
- Multiple columns with links (Personal Banking, Business Banking, About Us, Legal)
- Purple links
- Disclaimer section with footnote references
- FDIC member logo
- Copyright information
- Light gray background (#F8F8F8)

## Accessibility
- All form inputs with proper labels
- Focus states with purple outline (2px)
- Sufficient color contrast (WCAG AA compliant)
- Alt text for all images
- Keyboard navigation support

## Responsive Behavior
- Mobile: Single column, stacked layout, horizontal carousel scroll
- Tablet: 2-column grid for cards
- Desktop: Multi-column layouts, fixed login form, full navigation
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)