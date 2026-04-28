---
name: Elite Athletic Minimalism
colors:
  surface: '#00142b'
  surface-dim: '#00142b'
  surface-bright: '#1e3a5d'
  surface-container-lowest: '#000e22'
  surface-container-low: '#001c3a'
  surface-container: '#002040'
  surface-container-high: '#0b2b4d'
  surface-container-highest: '#193658'
  on-surface: '#d4e3ff'
  on-surface-variant: '#c2c7d0'
  inverse-surface: '#d4e3ff'
  inverse-on-surface: '#143154'
  outline: '#8c919a'
  outline-variant: '#42474f'
  surface-tint: '#9dcaff'
  primary: '#9dcaff'
  on-primary: '#003257'
  primary-container: '#4377ac'
  on-primary-container: '#fbfbff'
  inverse-primary: '#2a6195'
  secondary: '#ffce56'
  on-secondary: '#3f2e00'
  secondary-container: '#e7b101'
  on-secondary-container: '#5d4600'
  tertiary: '#f3be61'
  on-tertiary: '#422c00'
  tertiary-container: '#976c14'
  on-tertiary-container: '#fffaf9'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#9dcaff'
  on-primary-fixed: '#001d35'
  on-primary-fixed-variant: '#01497c'
  secondary-fixed: '#ffdf9a'
  secondary-fixed-dim: '#f6be1d'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5a4300'
  tertiary-fixed: '#ffdeab'
  tertiary-fixed-dim: '#f3be61'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5f4100'
  background: '#00142b'
  on-background: '#d4e3ff'
  surface-variant: '#193658'
typography:
  display-lg:
    fontFamily: Lexend
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Lexend
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Lexend
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style

The design system is anchored in a professional, athletic aesthetic that mirrors the premium nature of modern football jersey collections. It balances the high-energy excitement of the sport with a sophisticated, minimalist framework. The goal is to create an immersive, gallery-like experience where the vibrant colors and intricate patterns of the jerseys remain the focal point.

The style is **Corporate / Modern** with a strong mobile-first orientation. It utilizes deep, saturated backgrounds to make product imagery pop, conveying a sense of exclusivity and quality. The interface is intentionally restrained, using whitespace (or "dark space") to guide the user through the catalog without visual clutter. The emotional response should be one of trust, speed, and passion for the game.

## Colors

The palette is dominated by the **Deep Navy (#002244)** background, establishing a premium dark mode environment. The **Primary Blue (#4377AC)** acts as the structural anchor for secondary UI elements and branding moments. 

**Gold (#FDC425)** is reserved strictly for high-priority actions, badges, and pricing highlights to ensure maximum "pop" against the dark base. The **Ternary Indigo (#5335E6)** provides a modern, digital depth for hover states and subtle gradients. Green is strictly prohibited across the interface to maintain brand purity, appearing only within the specialized WhatsApp contact components to ensure immediate platform recognition.

## Typography

The design system utilizes **Lexend** exclusively. Chosen for its athletic readability and clean, geometric structure, it bridges the gap between a performance sports brand and a modern e-commerce platform.

Headlines use heavier weights (600-700) with slight negative letter spacing to create a high-impact, editorial feel similar to sports journalism. Body text is kept at a comfortable 16px or 18px to ensure legibility on mobile devices under various lighting conditions. Labels utilize uppercase styling with increased letter spacing to differentiate metadata (like SKU or League names) from descriptive content.

## Layout & Spacing

This design system employs a **Fluid Grid** approach optimized for mobile viewports. On mobile, a 2-column grid is the standard for jersey cards to allow for a scan-heavy browsing experience, transitioning to a 4 or 6-column layout on desktop.

The spacing rhythm is based on an **8px linear scale**. Margins are generous to ensure the product images breathe. A 20px safe area (container-margin) is maintained on mobile edges to prevent accidental touches and improve thumb-reach comfort. Section spacing uses larger increments (48px+) to clearly delineate between "New Arrivals," "Leagues," and "Featured Kits."

## Elevation & Depth

Depth is achieved through **Tonal Layers** rather than traditional shadows, keeping the look clean and professional. The base background is the deepest navy (#002244).

1.  **Level 0 (Base):** Global background.
2.  **Level 1 (Surface):** Cards and navigation bars use a slightly lighter tint of navy or a subtle 1px border (#4377AC at 20% opacity) to define boundaries.
3.  **Level 2 (Overlay):** Modals and dropdowns use a semi-transparent backdrop blur (Glassmorphism) with a 10% white tint to create separation from the content below.
4.  **Accents:** Interactive elements use the Secondary Gold (#FDC425) to "lift" visually through color contrast rather than physical elevation.

## Shapes

The shape language is **Rounded**, utilizing a 0.5rem (8px) base radius. This provides a friendly, modern feel that softens the high-contrast color palette.

Product cards and main action buttons use the standard `rounded` (8px) setting. Smaller elements like category chips or "Sale" badges use `rounded-lg` (16px) or full pill shapes to create a visual distinction between containers and informative tags. This subtle variation helps users quickly identify what is a clickable category vs. a static product container.

## Components

### Buttons
- **Primary:** Solid Gold (#FDC425) with Black text for maximum visibility. Used for "Comprar" or "Añadir".
- **Secondary:** Outlined Blue (#4377AC) with White text.
- **WhatsApp CTA:** Solid Green (#25D366) with a white icon; always fixed or pinned for easy access.

### Cards (Jersey Showcase)
Cards are the heart of the catalog. They feature a full-bleed product image at the top, followed by a content area in a slightly lighter navy. The team name is H3 Bold, followed by the price in Gold. A small flag or league icon should be placed in the top-right corner as an overlay.

### Badges
Small, pill-shaped tags used for "Nuevo," "Retro," or "Oferta." Use the Ternary Indigo (#5335E6) for "Retro" and the Secondary Gold for "Oferta."

### Input Fields
Dark-themed inputs with a 1px border. On focus, the border transitions to Primary Blue (#4377AC) with a subtle outer glow of the same color.

### Navigation
A bottom-bar navigation is preferred for the mobile-first approach, using clear icons and Spanish labels (Inicio, Catálogo, Ligas, Perfil). The active state is indicated by a Primary Blue icon and a small dot below.