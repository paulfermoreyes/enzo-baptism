---
name: Celestial Cherub
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#43474d'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#73777d'
  outline-variant: '#c3c7cd'
  surface-tint: '#486179'
  primary: '#132e44'
  on-primary: '#ffffff'
  primary-container: '#2b445b'
  on-primary-container: '#97b1cc'
  inverse-primary: '#afc9e5'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#182e3c'
  on-tertiary: '#ffffff'
  tertiary-container: '#2f4452'
  on-tertiary-container: '#9ab1c2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cee5ff'
  primary-fixed-dim: '#afc9e5'
  on-primary-fixed: '#001d33'
  on-primary-fixed-variant: '#304960'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#cfe6f8'
  tertiary-fixed-dim: '#b3cadb'
  on-tertiary-fixed: '#061e2b'
  on-tertiary-fixed-variant: '#344958'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  headline-display:
    fontFamily: Playfair Display
    fontSize: 3.25rem
    fontWeight: '400'
    lineHeight: 3.75rem
  headline-display-mobile:
    fontFamily: Playfair Display
    fontSize: 2.25rem
    fontWeight: '400'
    lineHeight: 2.75rem
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
  headline-md:
    fontFamily: Playfair Display
    fontSize: 1.5rem
    fontWeight: '500'
    lineHeight: 2rem
  body-lg:
    fontFamily: EB Garamond
    fontSize: 1.25rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: EB Garamond
    fontSize: 1.0625rem
    fontWeight: '400'
    lineHeight: 1.6rem
  body-sm:
    fontFamily: EB Garamond
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.4rem
  label-lg:
    fontFamily: Nunito Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.05em
  label-md:
    fontFamily: Nunito Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1.25rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
---

## Brand & Style

This design system embodies a tender, whimsical, and heartwarming stationery aesthetic created for baby milestones, christenings, and sacramental celebrations. It marries classical storybook charm with refined heirloom elegance.

### Emotional Tone & Character
- **Reverent yet Tender:** Evoking soft warmth, blessed beginnings, and gentle parental love.
- **Storybook Elegance:** Inspired by classic vintage storybooks, delicate watercolor cloudscapes, softly painted teddy bears, and starlight.
- **Heirloom Quality:** Styled with gilded double-line architectural borders, subtle champagne linework, and soft parchment stationery textures.

### Design Movement
- **Refined Romantic / Neo-Classic Stationery:** A blend of soft tactile surfaces, subtle gilded borders, expansive breathing space, and high-elegance editorial typography.

## Colors

The palette revolves around serene heavenly blues, warm illuminated parchments, gilded accents, and gentle twilight slate typography.

### Role & Usage
- **Primary (`#2B445B` / `#3A4D62`):** Gentle Slate Navy used for prominent titling, key invitations, and critical text. It provides accessible contrast while remaining significantly softer than pure black.
- **Secondary (`#C5A059` / `#D4AF37`):** Warm Gilded Champagne. Applied to decorative filigree rules, delicate inner border arches, star icons, and focal script accents.
- **Tertiary (`#C9E0F2` / `#E2EEF8`):** Whispering Baby Blue. Forms ambient sky backdrops, frosted secondary tags, and soft atmospheric edge glows.
- **Neutral Surface (`#FDFBF7` / `#F7F3EA`):** Warm Pressed Cotton Canvas. The primary reading surface mimics high-end wedding and christening deckle cardstock.
- **Cloud Pure (`#FFFFFF`):** Highlighting celestial clouds, button surfaces, and crisp pill elements.

## Typography

The typographic hierarchy pairs classical high-contrast calligraphic serifs with an approachable, clean humanist companion for micro-details and interaction labels.

- **Focal Headline (`Playfair Display`):** Used in italic weights to mimic the fluid grace of traditional christening script. Emphasizes milestone names, titles like *Godparent*, *Christening*, and commemorative moments.
- **Narrative & Details (`EB Garamond`):** Clean, bookish, and legible. Handles locations, schedules, biblical verses, and addresses with timeless poise.
- **Controls & UI Metadata (`Nunito Sans`):** Soft, rounded grotesque used in uppercase small-caps or tracking-spaced labels for timestamps, RSVP actions, and form inputs.

## Layout & Spacing

The layout is structured around an elegant stationery card container anchored inside a responsive canvas.

- **Grid Model:** A centered 12-column structure on desktop (constrained to a maximum content container of 680px for invitation sheets or 960px for event landing pages).
- **Rhythm:** Generous vertical pacing evokes bespoke letterpress printing. Section gaps utilize `space-xl` and `space-2xl` to allow floral vignettes and cloud formations to breathe.
- **Mobile Reflow:** Outer margins contract gracefully from `margin-desktop` (2.5rem) to `margin` (1.25rem), while decorative architectural frames collapse their internal padding from `space-xl` to `space-md` to preserve readability.

## Elevation & Depth

This system avoids dark, heavy industrial drop shadows in favor of luminous atmospheric depth and crisp gilded frame insets.

- **Atmospheric Glow:** Cards sit atop baby blue and cloud-white radial gradient bursts (`box-shadow: 0 20px 45px -10px rgba(43, 68, 91, 0.08), 0 0 60px 10px rgba(201, 224, 242, 0.45)`).
- **Stationery Foil Borders:** Hierarchy is established through nested hairline borders: an outer 1px solid rule in `#C5A059` at 40% opacity, paired with an inner inset rule (inset 6px to 10px) with scalloped corner accents.
- **Floating Modals & Sheets:** Floating elements use a pure white core with a feathered translucent sky-blue diffusion (`rgba(226, 238, 248, 0.7)` blur radius 24px) paired with an ultra-thin 1px pale champagne stroke.

## Shapes

The design incorporates softly rounded structural corners combined with ceremonial arches and pill-shaped interactive components.

- **Primary Cards & Invitation Panels:** Use standard rounded corners (`rounded-lg`, 1rem) or classical cathedral arch heads (`border-top-left-radius: 9999px; border-top-right-radius: 9999px`).
- **Interactive Badges & Buttons:** Expressed via full pill contours (`rounded-full`) to complement the soft organic nature of clouds and plush teddy bear themes.
- **Framing Geometry:** Inner gilded frames echo the rounded corners with a parallel inset margin, producing a vintage pressed foil appearance.

## Components

### Buttons & Interactive Controls
- **Primary Button (The Gilded Ribbon):** Background of warm gold `#C5A059` transitioning to a soft honey tint on hover, overlaid with white or deep navy text (`#2B445B`), pill-shaped, with a subtle golden glow.
- **Secondary Button (Parchment Feather):** Translucent paper white (`rgba(253, 251, 247, 0.9)`) bordered by a 1px solid gold hairline (`#C5A059`), deep slate text, and pill rounding.

### Invitation Cards & Surface Panels
- **Structure:** Dual-surface system consisting of a soft baby blue cloud foundation backing a central cotton parchment sheet (`#FDFBF7`).
- **Ornaments:** Double-lined gold frame borders with ornate scooped corner notches, embellished with small 4-point star clusters and cloud base caps.

### Dividers & Filigree
- **Ceremonial Rule:** A horizontal line tapering from transparent to gold `#C5A059` and back to transparent, centered around a delicate icon motif (a small heart, golden cross, or twinkling star).

### Input Fields & RSVP Elements
- **Fields:** Rounded-lg inputs in crisp white with a soft champagne border (`#E5D3AF`). Active state transitions border color to `#C5A059` with a delicate sky-blue aura (`rgba(201, 224, 242, 0.5)`).
- **Checkbox & Radio Controls:** Circular gilded rings with smooth inner gold pill fills, accompanied by serif descriptive labels.

### Badges & Chips
- **Chips:** Soft sky-blue fills (`#E2EEF8`) accented by navy lettering (`#2B445B`) and subtle starlight icons for time stamps, dress code recommendations, and program milestones.
