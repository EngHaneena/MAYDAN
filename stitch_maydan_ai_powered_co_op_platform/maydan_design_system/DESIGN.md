---
name: Maydan Design System
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
  tertiary-container: '#0b1c30'
  on-tertiary-container: '#75859d'
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
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 48px
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
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 24px
  margin-page: 40px
  section-gap: 64px
  element-gap: 16px
---

## Brand & Style
The design system for this platform is built on a "Corporate Modern" aesthetic with a high-performance SaaS feel. It balances the precision of AI technology with the professional reliability required for a Saudi career-focused co-op marketplace.

The brand personality is **authoritative yet accessible**, emphasizing trust through structured layouts and a premium finish. The visual language utilizes heavy whitespace, crisp borders, and a refined color palette to ensure the user feels they are in a high-stakes, high-quality environment. The UI must accommodate a seamless RTL-first experience for Arabic users while maintaining clarity for English technical terminology.

## Colors
This design system utilizes a high-contrast palette to distinguish between structural hierarchy and actionable intelligence.

*   **Primary (Deep Navy):** Used for core navigation, high-level headers, and establishing an authoritative presence.
*   **Accent (Teal):** Reserved for primary actions, success states, and AI-driven highlights. It represents the "energy" of the platform.
*   **Background (Off-White):** A soft, cool-toned neutral that reduces eye strain and makes surface elements pop.
*   **Surface (Pure White):** Used for cards, modals, and input areas to define clear work zones.
*   **Secondary Text/Borders:** Utilizing a range of neutral grays (#94A3B8 to #E2E8F0) to maintain subtle separation without visual clutter.

## Typography
The typography system is a hybrid of **IBM Plex Sans Arabic** for structural integrity and **Manrope** for modern SaaS aesthetics. 

Arabic text should always take precedence in weight and size to ensure optical balance with Latin characters. For technical terms or numbers within Arabic sentences, Manrope is used to maintain a clean, geometric feel. 

Headlines use semi-bold weights to anchor the page, while body text maintains a generous line height (1.5x+) to ensure legibility during long sessions of reviewing project descriptions or student profiles.

## Layout & Spacing
The system employs a **fixed-fluid hybrid grid**. On desktop, content is constrained to a 1440px container with a 12-column structure. 

*   **Sidebars:** Fixed at 280px to provide a stable anchor for the navigation.
*   **RTL Consideration:** All horizontal spacing, padding, and margins are mirrored. Gutters remain consistent at 24px to provide enough breathing room for dense data tables.
*   **Vertical Rhythm:** Uses an 8px base unit. All component heights and padding increments must be multiples of 8 to maintain a strict professional grid.

## Elevation & Depth
Depth is communicated through **low-contrast outlines** and **ambient shadows**. 

1.  **Level 0 (Background):** #F8FAFC.
2.  **Level 1 (Cards/Surface):** Pure white with a 1px solid border (#E2E8F0).
3.  **Level 2 (Hover/Active):** A soft, diffused shadow (0px 4px 20px rgba(11, 19, 43, 0.05)) to indicate interactivity.
4.  **Level 3 (Modals/Popovers):** Deeper shadows with a slight Deep Navy tint to create a physical sense of "overlay."

Avoid heavy drop shadows; the goal is a flat, layered look inspired by modern engineering tools.

## Shapes
The design system uses a **Rounded** language to soften the corporate atmosphere. 

*   **Standard Components:** Buttons and input fields use a 0.5rem (8px) radius.
*   **Container Elements:** Main dashboard cards and project modules use a 1rem (16px) radius to create a distinct, friendly boundary.
*   **Badges/Chips:** Utilize the `rounded-xl` or full pill shape to differentiate them from actionable buttons.

## Components

### Buttons
*   **Primary:** Teal (#14B8A6) background with White text. No shadow on rest; subtle lift on hover.
*   **Secondary:** Deep Navy (#0B132B) background for high-level administrative actions.
*   **Ghost:** Transparent background with 1px gray border for secondary dashboard actions.

### AI-Specific UI
*   **AI Badges:** Use a subtle gradient or a "Sparkle" icon alongside Teal text. Background should be a 10% opacity Teal tint.
*   **Match Percentages:** Expressed as a circular progress ring or a bold Teal label. High matches (>80%) should have a slight outer glow.
*   **AI Prompt Inputs:** Text areas should have a distinctive border treatment (e.g., a subtle 2px left-border in Teal in LTR, right-border in RTL) to signify the AI interaction zone.

### Navigation
*   **Sidebar:** Deep Navy (#0B132B) background. Active states use a Teal vertical bar and a low-opacity Teal background tint for the menu item.
*   **Top Nav:** Minimalist White surface with a 1px bottom border. Breadcrumbs are essential for deep navigation within project tiers.

### Data Display
*   **Tables:** Header rows in #F8FAFC with semi-bold labels. Rows use a 1px bottom divider. No vertical borders.
*   **Status Badges:** 
    *   *Open:* Blue tint.
    *   *Reviewing:* Amber tint.
    *   *Shortlisted:* Teal tint.
    *   *Accepted:* Green tint.
    All badges use low-saturation backgrounds with high-saturation text for WCAG compliance.