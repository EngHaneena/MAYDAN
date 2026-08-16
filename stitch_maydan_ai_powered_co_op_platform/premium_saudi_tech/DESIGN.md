---
name: Premium Saudi Tech
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76767e'
  outline-variant: '#c6c6ce'
  surface-tint: '#565d79'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131a33'
  on-primary-container: '#7b83a0'
  inverse-primary: '#bec5e5'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#6df5e1'
  on-secondary-container: '#006f64'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#2c1603'
  on-tertiary-container: '#a07d5f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#bec5e5'
  on-primary-fixed: '#131a33'
  on-primary-fixed-variant: '#3e4660'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#ffdcc1'
  tertiary-fixed-dim: '#e8bf9d'
  on-tertiary-fixed: '#2c1603'
  on-tertiary-fixed-variant: '#5d4127'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  surface-white: '#FFFFFF'
  border-subtle: '#E2E8F0'
  text-muted: '#64748B'
  ai-tint: rgba(20, 184, 166, 0.1)
typography:
  headline-xl:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  headline-sm:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  section-gap: 64px
---

## Brand & Style

The design system is engineered to represent a premium, high-trust ecosystem for the Saudi professional landscape. It balances the authority of established institutions with the agility of a modern AI-driven startup. The visual narrative is defined by a "Premium Tech" aesthetic: high-end corporate reliability meets cutting-edge innovation.

The primary language is Arabic (RTL), which dictates the visual flow of the interface. English is integrated seamlessly for technical terminology. The overall style is **Minimalist** with **Glassmorphic** accents, characterized by:
- **Expansive Whitespace:** Emphasizing focus and reducing cognitive load for complex matching data.
- **Architectural Hierarchy:** Strong, clear headers in Deep Navy to anchor the user's journey.
- **Modern Professionalism:** Using light, airy backgrounds contrasted with sharp, high-intent action colors.

## Colors

The palette uses high-contrast intent to guide the user's eye toward critical path actions and intelligence-driven insights.

- **Primary (Deep Navy):** Represents stability and high-trust. Used for structural elements, navigation sidebars, and primary typography.
- **Secondary (Teal):** The "Intelligence" color. Reserved for AI matching indicators, primary calls to action, and active status updates.
- **Neutral (Off-White):** The foundational canvas color to ensure the UI feels modern and lightweight.
- **Surface (White):** Used for elevated cards and content containers to create a clear visual layer above the background.

## Typography

This is a dual-language system. **IBM Plex Sans Arabic** provides a structured, professional voice for headings, while **Manrope** offers a clean, geometric aesthetic for English technical terms and body copy.

- **RTL Balance:** Arabic text is weighted slightly heavier than Latin counterparts to ensure optical parity.
- **Hierarchy:** Deep Navy is the default color for all headlines to maintain authority. Body text uses a slightly softened slate to improve long-form readability.
- **Technical Terms:** When English terms appear within Arabic sentences, Manrope is used without changing the font size, maintaining a consistent x-height.

## Layout & Spacing

The layout is based on a **fixed-width container (1440px)** for desktop, centered on the screen, using a 12-column grid.

- **RTL First:** All spacing, margins, and column orders are mirrored for the Arabic interface. Navigation resides on the right for Arabic and the left for English contexts.
- **Vertical Rhythm:** An 8px base unit governs all dimensions. Elements should be spaced in increments of 8px (e.g., 8, 16, 24, 32, 48, 64).
- **Floating Navigation:** The top navbar uses a fixed position with high-z-index to maintain accessibility during long scrolls.

## Elevation & Depth

Hierarchy is established through **tonal layers** and **glassmorphism** rather than traditional heavy shadows.

- **Level 0 (Base):** Off-White (#F8FAFC) background.
- **Level 1 (Surface):** Pure White cards with a subtle 1px border (#E2E8F0).
- **Level 2 (Floating):** Reserved for the floating navbar. Utilizes a **Glassmorphic** effect: `backdrop-blur(12px)`, `rgba(255, 255, 255, 0.8)` background, and a razor-thin white border.
- **Level 3 (Interactive):** On hover, cards receive a soft, tinted ambient shadow: `0px 10px 30px rgba(11, 19, 43, 0.04)`.

## Shapes

The design system uses **Rounded (8px/0.5rem)** as the default for a friendly yet professional profile.

- **Standard Elements:** Buttons, inputs, and small cards use 8px.
- **Large Containers:** Main dashboard sections and primary cards use `rounded-lg` (16px) to create a distinct soft frame.
- **Interactive Badges:** Status chips and AI tags use `rounded-xl` (24px) or full pill shapes to distinguish them from actionable rectangular buttons.

## Components

### Floating Navbar
The centerpiece of the UI. It must feature a semi-transparent white background with a backdrop-blur effect. The border is a thin 1px line in white (inner) and subtle gray (outer) to give it a "glass" appearance floating over the content.

### Buttons
- **Primary:** Teal background, White text. High-contrast, no shadow.
- **Secondary:** Deep Navy background, White text. Used for global actions.
- **Tertiary/Ghost:** Transparent with a Teal or Navy text and a 1px border.

### Rounded Cards
Every content block is housed in a card with a 16px corner radius. Borders are mandatory (#E2E8F0) to maintain the "Modern Professional" look without relying on shadows.

### AI Matching Indicators
- **Match Chips:** A pill-shaped badge with a light Teal background (10% opacity) and bold Teal text.
- **AI Focus:** Use a subtle Teal vertical accent line (2px) on the leading edge (right side in RTL) of any card containing AI-generated insights.

### Inputs & Forms
Inputs use a white background with a 1px border. On focus, the border transitions to Teal with a 2px outer glow in 10% Teal. Labels are always Deep Navy for maximum legibility.