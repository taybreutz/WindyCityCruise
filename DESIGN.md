# Design Token System Guide for AI Agents

This document explains how to use the Chicago Boating Hub design token system when generating code, making design decisions, or assisting with UI development.

## Core Principle: Semantic First

**Never use primitive tokens directly in components.** Always use semantic tokens that describe the purpose, not the color.

```css
/* WRONG */
background-color: var(--primitive-color-teal-blue);
color: var(--primitive-color-gray-900);

/* CORRECT */
background-color: var(--color-fill-accent);
color: var(--color-text-primary);
```

## Token Reference Path

```
app.css
├── --primitive-*     → Raw values (DO NOT use directly)
└── --color-*, --typography-*, --spacing-*, etc. → Use these in all components
```

---

## Color Token Selection Guide

### Text Colors

| Use Case | Token | When to Use |
|----------|-------|-------------|
| `color.text.primary` | Main body text, headings | Default for all readable content |
| `color.text.secondary` | Subtitles, descriptions, metadata | Supporting text, less emphasis |
| `color.text.tertiary` | Placeholders, hints, timestamps | Lowest emphasis text |
| `color.text.inverse` | Text on dark/filled backgrounds | Buttons with `fill.primary`, dark cards |
| `color.text.disabled` | Disabled form fields, inactive items | Any disabled state |
| `color.text.link` | Clickable text links | Hyperlinks, inline actions |
| `color.text.success` | Success messages | Confirmation text |
| `color.text.warning` | Warning messages | Caution text |
| `color.text.error` | Error messages, validation | Form errors, alerts |

### Surface Colors

| Use Case | Token | When to Use |
|----------|-------|-------------|
| `color.surface.background` | Page background | Root-level background |
| `color.surface.primary` | Main content areas | Cards, sections on background |
| `color.surface.secondary` | Nested containers | Cards within cards, sidebars |
| `color.surface.elevated` | Floating elements | Dropdowns, popovers, modals |
| `color.surface.grouped` | Grouped list backgrounds | Settings lists, table rows |
| `color.surface.overlay` | Backdrop behind modals | Modal/dialog overlays |
| `color.surface.inverse` | Dark sections | Hero sections, footers |

### Fill Colors

| Use Case | Token | When to Use |
|----------|-------|-------------|
| `color.fill.primary` | Primary buttons, key actions | Main CTA buttons |
| `color.fill.secondary` | Secondary buttons, tags | Less prominent actions |
| `color.fill.tertiary` | Subtle backgrounds | Hover states, badges |
| `color.fill.accent` | Brand accent elements | Icons, highlights, progress |
| `color.fill.accentSubtle` | Accent backgrounds | Selected states, notifications |
| `color.fill.success` | Success indicators | Checkmarks, completed states |
| `color.fill.successSubtle` | Success backgrounds | Success banners |
| `color.fill.warning` | Warning indicators | Warning icons |
| `color.fill.warningSubtle` | Warning backgrounds | Warning banners |
| `color.fill.destructive` | Delete buttons, errors | Destructive actions |
| `color.fill.destructiveSubtle` | Error backgrounds | Error banners |
| `color.fill.disabled` | Disabled elements | Disabled buttons/inputs |

### Border Colors

| Use Case | Token | When to Use |
|----------|-------|-------------|
| `color.border.subtle` | Dividers, separators | Light visual separation |
| `color.border.default` | Input borders, cards | Standard component borders |
| `color.border.strong` | Emphasized borders | Active tabs, selected items |
| `color.border.focus` | Focus rings | Keyboard focus indicators |
| `color.border.error` | Error state borders | Invalid form fields |
| `color.border.disabled` | Disabled borders | Disabled inputs |

### Interactive Colors

For buttons and interactive elements, use the state-based tokens:

```css
.button-primary {
  background: var(--color-interactive-primary-default);
}
.button-primary:hover {
  background: var(--color-interactive-primary-hover);
}
.button-primary:active {
  background: var(--color-interactive-primary-active);
}
```

Available variants: `primary`, `secondary`, `destructive`

---

## Typography Selection Guide

| Style | Use Case |
|-------|----------|
| `typography.largeTitle` | Hero headings, splash screens |
| `typography.title1` | Page titles |
| `typography.title2` | Section headings |
| `typography.title3` | Card titles, subsections |
| `typography.headline` | List item titles, emphasized labels |
| `typography.body` | Default body text |
| `typography.bodyEmphasized` | Bold body text, key information |
| `typography.callout` | Callout boxes, featured text |
| `typography.subheadline` | Subtitles, secondary headings |
| `typography.footnote` | Fine print, disclaimers |
| `typography.caption1` | Image captions, timestamps |
| `typography.caption2` | Smallest text, badges |

---

## Elevation Selection Guide

| Token | Use Case | Examples |
|-------|----------|----------|
| `elevation.flat` | Inline elements | Text, inline badges |
| `elevation.raised` | Subtle lift | Cards, buttons |
| `elevation.floating` | Floating UI | Dropdowns, tooltips, FABs |
| `elevation.modal` | Top-level overlays | Modals, dialogs, drawers |

---

## Spacing Guidelines

### Component Spacing

- `spacing.component.button.paddingX/Y` — Button internal padding
- `spacing.component.input.paddingX/Y` — Input field padding
- `spacing.component.card.padding` — Card internal padding
- `spacing.component.card.gap` — Gap between card children

### Layout Spacing

- `spacing.layout.gutter` — Grid gutters (16px)
- `spacing.layout.sectionGap` — Between page sections (48px)
- `spacing.layout.pageMargin` — Page edge margins (16px)
- `spacing.layout.contentMaxWidth` — Max content width (1200px)

### Spacing Scale Reference

```
spacing.1  = 4px   (tight)
spacing.2  = 8px   (compact)
spacing.3  = 12px  (snug)
spacing.4  = 16px  (default)
spacing.6  = 24px  (relaxed)
spacing.8  = 32px  (loose)
spacing.12 = 48px  (section)
spacing.16 = 64px  (large section)
```

---

## Border Radius Guidelines

| Token | Use Case |
|-------|----------|
| `radius.component.button` | Buttons (12px) |
| `radius.component.input` | Form inputs (8px) |
| `radius.component.card` | Cards (16px) |
| `radius.component.modal` | Modals/dialogs (20px) |
| `radius.component.badge` | Badges/pills (full) |
| `radius.component.avatar` | Avatars (full) |
| `radius.component.tooltip` | Tooltips (8px) |

---

## Light/Dark Mode Implementation

The design tokens CSS file includes both `@media (prefers-color-scheme: dark)` for automatic system preference detection and a `.dark` class for manual toggle control.

### Usage

Simply import the CSS file and tokens will automatically adapt to system preferences:

```css
@import 'app.css';
```

### Manual Dark Mode Toggle (Svelte)

```svelte
<script>
  import { browser } from '$app/environment';

  let darkMode = $state(false);

  $effect(() => {
    if (browser) {
      darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });
</script>

<svelte:body class:dark={darkMode} />
```

Or apply the `.dark` class to your root element for manual control.

---

## Z-Index Layering

Always use z-index tokens to maintain consistent layering:

```
zIndex.base     = 0    (default flow)
zIndex.dropdown = 100  (dropdowns, selects)
zIndex.sticky   = 200  (sticky headers)
zIndex.overlay  = 300  (overlays, backdrops)
zIndex.modal    = 400  (modals, dialogs)
zIndex.popover  = 500  (popovers on modals)
zIndex.toast    = 600  (toast notifications)
zIndex.tooltip  = 700  (tooltips, highest)
```

---

## Motion/Animation Guidelines

### Duration

- `motion.duration.instant` (0ms) — No animation
- `motion.duration.fast` (100ms) — Micro-interactions, hovers
- `motion.duration.normal` (200ms) — Default transitions
- `motion.duration.slow` (300ms) — Larger state changes
- `motion.duration.slower` (400ms) — Complex animations

### Easing

- `motion.easing.default` — Standard transitions
- `motion.easing.easeIn` — Elements exiting
- `motion.easing.easeOut` — Elements entering
- `motion.easing.easeInOut` — Elements moving
- `motion.easing.spring` — Playful/bouncy effects

---

## Common Component Patterns

### Primary Button

```css
.btn-primary {
  background: var(--color-interactive-primary-default);
  color: var(--color-text-inverse);
  padding: var(--spacing-component-button-paddingY) var(--spacing-component-button-paddingX);
  border-radius: var(--radius-component-button);
  font: var(--typography-headline);
  transition: background var(--motion-duration-fast) var(--motion-easing-default);
}
.btn-primary:hover {
  background: var(--color-interactive-primary-hover);
}
.btn-primary:active {
  background: var(--color-interactive-primary-active);
}
.btn-primary:disabled {
  background: var(--color-fill-disabled);
  color: var(--color-text-disabled);
}
```

### Card

```css
.card {
  background: var(--color-surface-elevated);
  border: var(--border-width-thin) solid var(--color-border-subtle);
  border-radius: var(--radius-component-card);
  padding: var(--spacing-component-card-padding);
  box-shadow: var(--elevation-raised);
}
```

### Input Field

```css
.input {
  background: var(--color-surface-background);
  border: var(--border-width-default) solid var(--color-border-default);
  border-radius: var(--radius-component-input);
  padding: var(--spacing-component-input-paddingY) var(--spacing-component-input-paddingX);
  color: var(--color-text-primary);
  font: var(--typography-body);
}
.input:focus {
  border-color: var(--color-border-focus);
  outline: none;
}
.input::placeholder {
  color: var(--color-text-tertiary);
}
.input:disabled {
  background: var(--color-fill-disabled);
  border-color: var(--color-border-disabled);
  color: var(--color-text-disabled);
}
.input.error {
  border-color: var(--color-border-error);
}
```

---

## Decision Rules for AI Agents

1. **Text on backgrounds**: Use `text.primary` on `surface.background/primary/secondary`. Use `text.inverse` on `fill.primary` or `surface.inverse`.

2. **Interactive elements**: Always include hover, active, focus, and disabled states.

3. **Contrast**: Never use `fill.accent` or `fill.warning` for body text—only for icons or indicators.

4. **Nesting surfaces**: `background` → `primary` → `secondary` → `elevated` (from outer to inner).

5. **Destructive actions**: Use `interactive.destructive` for delete/remove buttons, `fill.destructive` for error states.

6. **Elevation matches z-index**: `floating` elements should use `zIndex.dropdown` or higher.

7. **Spacing rhythm**: Use the spacing scale consistently. Don't mix arbitrary pixel values.

8. **Typography hierarchy**: Only one `largeTitle` or `title1` per view. Use `body` for most content.

---

## File Reference

- **Token source**: `app.css`
- **Format**: CSS Custom Properties (CSS Variables)
- **Dark mode**: Automatic via `prefers-color-scheme` or manual via `.dark` class
