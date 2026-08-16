---
name: Vibrant Professionalism
colors:
  surface: '#0e1513'
  surface-dim: '#0e1513'
  surface-bright: '#343b39'
  surface-container-lowest: '#090f0e'
  surface-container-low: '#161d1b'
  surface-container: '#1a211f'
  surface-container-high: '#252b2a'
  surface-container-highest: '#2f3634'
  on-surface: '#dde4e1'
  on-surface-variant: '#bbcac6'
  inverse-surface: '#dde4e1'
  inverse-on-surface: '#2b3230'
  outline: '#859490'
  outline-variant: '#3c4947'
  surface-tint: '#4fdbc8'
  primary: '#4fdbc8'
  on-primary: '#003731'
  primary-container: '#14b8a6'
  on-primary-container: '#00423b'
  inverse-primary: '#006b5f'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#ffb2b7'
  on-tertiary: '#67001b'
  tertiary-container: '#ff7b88'
  on-tertiary-container: '#7a0022'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#71f8e4'
  primary-fixed-dim: '#4fdbc8'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005048'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#0e1513'
  on-background: '#dde4e1'
  surface-variant: '#2f3634'
  vibrant-purple: '#8B5CF6'
  energy-orange: '#F59E0B'
  success-emerald: '#10B981'
  surface-dark: '#020617'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  container-max: 1440px
---

## Brand & Style

This design system evolves into a **Vibrant Corporate** aesthetic—a fusion of high-end SaaS precision and energetic, modern color theory. It maintains its status as a premium marketplace for Saudi career opportunities while introducing a more dynamic, optimistic visual language.

The style is characterized by **Modern Minimalism** infused with **High-Contrast** accents. By pairing a deep, sophisticated dark mode with vivid teal and energetic supplemental tones, the UI feels both authoritative and cutting-edge. The interaction model is crisp and responsive, ensuring that the "lively" aspects of the brand never compromise the professional integrity required for high-stakes recruitment and career development.

## Colors

The palette is anchored by a sophisticated **Dark Navy/Black** foundation to evoke depth and premium quality, contrasted against a high-energy **Teal** primary color. 

- **Primary (Teal):** The energetic engine of the system. Used for core calls-to-action and critical AI highlights.
- **Secondary (Dark Navy):** The structural anchor. Used for deep surfaces and navigation in light mode, or the primary background in dark mode.
- **Vibrant Accents:** We introduce **Rose (#F43F5E)** and **Violet (#8B5CF6)** as tertiary and named accents to categorize different user flows or high-importance notifications, adding the requested "vibrancy."
- **Dark Mode Strategy:** Surfaces use a layered approach starting from `#020617` (Background) to `#1E293B` (Container High), ensuring accessible contrast for text and maintaining a "deep-space" premium feel.

## Typography

This system utilizes a dual-font strategy to balance regional requirements and modern SaaS aesthetics. **IBM Plex Sans Arabic** (referenced here as IBM Plex Sans) provides the structural authority for headlines, while **Manrope** handles the functional body text and interface labels.

To maintain vibrancy, headlines are allowed to use primary or tertiary colors when appropriate for impact. Body text maintains high readability with generous line heights. In RTL contexts, ensure font weights for Arabic are slightly increased to match the optical weight of English technical terms.

## Layout & Spacing

The design system follows a **12-column fluid grid** with a maximum container width of 1440px. The spacing rhythm is strictly based on an **8px base unit**, ensuring mathematical harmony across all components.

- **Desktop:** 24px gutters with 40px outer margins. Sidebars are fixed at 280px for a stable navigation experience.
- **Mobile:** 16px gutters and margins. Content reflows to a single column, with cards occupying the full width minus margins.
- **RTL Support:** All layouts are built to be mirrored. Spacing units remain identical, but directionality flips, with sidebars docking to the right.

## Elevation & Depth

In the dark mode environment, depth is established through **Tonal Layering** rather than traditional shadows. 

- **Surface Levels:** As elements rise in hierarchy (e.g., from background to card to modal), the surface color becomes lighter/brighter (e.g., `#020617` → `#0F172A` → `#1E293B`).
- **Luminescent Outlines:** High-priority cards and interactive elements use 1px subtle borders (low-opacity teal) to create a "glow" effect that defines boundaries without the need for heavy shadows.
- **Glassmorphism:** Modals and navigation overlays use a backdrop blur (20px) with a semi-transparent dark navy tint to maintain context of the underlying content.

## Shapes

The design uses a **Rounded** language to soften the high-contrast technical aesthetic. This creates a more approachable, human-centric feel within a professional context.

- **Standard Elements:** Buttons, inputs, and list items use a **0.5rem (8px)** radius.
- **Content Containers:** Dashboard cards and modular sections use a **1rem (16px)** radius to create distinct visual groups.
- **Interactive Pill:** Actionable chips and status badges use a full pill radius to separate them from the more rigid structural elements.

## Components

### Buttons
Primary buttons use the high-contrast **Teal** background with a dark navy text for maximum pop. Secondary buttons utilize a ghost style with a vibrant outline. All buttons feature a subtle 0.2s transition on hover, slightly increasing in saturation.

### Avatars & Illustrations
Adhere to a **Featureless Illustration** guideline for all user representations.
- **Style:** Flat, geometric shapes with a vibrant color palette derived from the system's accent colors.
- **Representation:** Ensure diverse character silhouettes, including a woman in a hijab and a man with various hairstyles, to reflect the Saudi professional landscape.
- **Facelessness:** No facial features (eyes, nose, mouth) should be present, emphasizing professional roles over individual identity.

### Cards & Surfaces
Cards in dark mode should have a subtle 1px border. For AI-featured content, use a **Violet-to-Teal gradient border** to distinguish "intelligent" sections from standard data.

### Input Fields
Inputs use a deep navy background with a 1px border that shifts to Teal on focus. Error states use the Rose accent for both the border and the supportive text.

### Chips & Badges
Use high-saturation backgrounds with 10% opacity for the container, and 100% saturation for the text and icons to ensure WCAG accessibility on dark backgrounds.