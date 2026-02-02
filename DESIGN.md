# Apple HIG–Aligned Design Token System
**Single Source of Truth for AI Agents, Engineers, and Designers**

This document defines a production-ready, Apple-first design token system aligned with Apple Human Interface Guidelines. It is intentionally restrained, semantic-first, and optimized for clarity, deference, and subtle depth.

---

## 📋 Table of Contents
- [1. Design Principles](#1-design-principles)
- [2. Semantic Token Rule](#2-semantic-token-rule)
- [3. Token Architecture](#3-token-architecture)
- [4. Color System](#4-color-system)
    - [4.1 Text Colors](#41-text-colors)
    - [4.2 Surface Colors](#42-surface-colors)
    - [4.3 Fill Colors](#43-fill-colors)
    - [4.4 Border Colors](#44-border-colors)
- [5. Interactive States](#5-interactive-states)
- [6. Typography](#6-typography)
- [7. Elevation & Depth](#7-elevation--depth)
- [8. Spacing System](#8-spacing-system)
- [9. Border Radius](#9-border-radius)
- [10. Z-Index Layers](#10-z-index-layers)
- [11. Motion & Animation](#11-motion--animation)
- [12. Common Patterns](#12-common-patterns)
- [13. Decision Rules for AI](#13-decision-rules-for-ai)

---

## 1. Design Principles

> [!IMPORTANT]
> These principles are non-negotiable and must guide every design decision.

- **Clarity:** UI exists to communicate content and actions with zero ambiguity. Hierarchy must be obvious.
- **Deference:** Interface elements step back. Content, data, and user intent lead.
- **Depth:** Communicated through layering, opacity, blur, and restrained shadow. Never heavy contrast.
- **Consistency:** All values MUST come from tokens. No one-off decisions or "magic numbers."
- **Accessibility:** Readable by default. Predictable focus. Motion respects user settings.

---

## 2. Semantic Token Rule

> [!WARNING]
> **Never use primitive tokens or raw values directly in components.**
> Always reference semantic tokens that describe the **intent** or **purpose**.

```css
/* ❌ Incorrect */
background-color: #0077b6;
color: var(--primitive-color-prussian-blue);

/* ✅ Correct */
background-color: var(--color-fill-accent);
color: var(--color-text-primary);
```

---

## 3. Token Architecture

All tokens are defined in `app.css` and follow a hierarchical structure:

```text
app.css
├── --primitive-*     → Raw values (INTERNALfoundation - do not use)
├── --color-*         → Semantic color roles (text, surface, border)
├── --typography-*    → Type styles (size, weight, line-height)
├── --spacing-*       → Spacing & layout (4px grid)
├── --radius-*        → Corner radii
├── --elevation-*     → Surface depth (shadows)
├── --motion-*        → Timing & easing
└── --zIndex-*        → Layering
```

---

## 4. Color System

> [!NOTE]
> This system is **Light Mode Only**. Neutrals dominate all surfaces, while accents are sparse and purposeful.

### 4.1 Text Colors

| Token | Use Case | When to Use |
| :--- | :--- | :--- |
| `var(--color-text-primary)` | Main Body & Headings | Default for all readable content |
| `var(--color-text-secondary)`| Subtitles & Descriptions | Supporting text, secondary labels |
| `var(--color-text-tertiary)` | Metadata & Placeholders | Lowest emphasis text, timestamps |
| `var(--color-text-inverse)`  | Contrast Text | Text on filled/accent surfaces (e.g., buttons) |
| `var(--color-text-link)`     | Inline Links | Clickable text within paragraphs |
| `var(--color-text-success)`  | Success State | Positive feedback or confirmation text |
| `var(--color-text-error)`    | Error State | Validation errors and critical alerts |

### 4.2 Surface Colors

| Token | Use Case | Implementation Rule |
| :--- | :--- | :--- |
| `var(--color-surface-background)` | Page Root | The primary background of the entire viewport |
| `var(--color-surface-primary)`    | Main Content Area | Cards or sections sitting on the background |
| `var(--color-surface-secondary)`  | Nested Containers | Inner cards, sidebar backgrounds |
| `var(--color-surface-elevated)`   | Floating UI | Popovers, dropdowns, and modal dialogs |
| `var(--color-surface-inverse)`    | Dark Sections | Rare, intentional dark areas (e.g., Footer) |

### 4.3 Fill Colors

| Token | Use Case | Examples |
| :--- | :--- | :--- |
| `var(--color-fill-primary)`   | Key Actions | Primary CTA buttons |
| `var(--color-fill-secondary)` | Supporting Actions | Secondary buttons, tag backgrounds |
| `var(--color-fill-accent)`    | Brand Emphasis | Icons, progress bars, highlights |
| `var(--color-fill-tertiary)`  | Subtle Fills | Hover states, muted badges |
| `var(--color-fill-error)`     | Destructive | Delete buttons, error indicators |

### 4.4 Border Colors

| Token | Use Case |
| :--- | :--- |
| `var(--color-border-subtle)`  | Dividers and separators |
| `var(--color-border-default)` | Standard component borders (inputs, cards) |
| `var(--color-border-strong)`  | Emphasized borders (active states) |
| `var(--color-border-focus)`   | Focus rings for accessibility |

---

## 5. Interactive States

Every interactive element must define styles for all states:

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
.button-primary:focus {
  outline: 2px solid var(--color-border-focus);
}
```

---

## 6. Typography

| Role | Token Usage |
| :--- | :--- |
| **Splash/Hero** | `typography.largeTitle` |
| **Page Title** | `typography.title1` |
| **Section Header** | `typography.title2` |
| **Sub-header** | `typography.title3` |
| **Labels** | `typography.headline` |
| **Body Text** | `typography.body` |
| **Fine Print** | `typography.footnote` |

---

## 7. Elevation & Depth

| Level | Token | Effect Usage |
| :--- | :--- | :--- |
| **Flat** | `elevation.flat` | Non-interactive items |
| **Raised** | `elevation.raised` | Standard buttons and cards |
| **Floating** | `elevation.floating` | Menus and tooltips |
| **Modal** | `elevation.modal` | Centered dialogs and sheets |

---

## 8. Spacing System

> [!TIP]
> All spacing follows a strict **4-point grid**. Avoid odd values (e.g., 7px, 13px).

| Token | Value | Intent |
| :--- | :--- | :--- |
| `spacing.1` | 4px | Tight micro-spacing |
| `spacing.2` | 8px | Compact internal padding |
| `spacing.4` | 16px | **Default** component spacing |
| `spacing.6` | 24px | Relaxed layout gaps |
| `spacing.12`| 48px | Section vertical spacing |

---

## 9. Border Radius

| Component | Token |
| :--- | :--- |
| **Buttons** | `radius.component.button` |
| **Inputs** | `radius.component.input` |
| **Cards** | `radius.component.card` |
| **Modals** | `radius.component.modal` |
| **Avatars** | `radius.component.avatar` (Circle) |

---

## 10. Z-Index Layers

| Layer | Value | Purpose |
| :--- | :--- | :--- |
| `base` | 0 | Standard layout |
| `sticky` | 200 | Navigation bars |
| `modal` | 400 | Overlay dialogs |
| `tooltip`| 700 | Highest priority labels |

---

## 11. Motion & Animation

- **Purpose:** Guides attention, never purely decorative.
- **Timing:** Use `motion.duration.fast` (120ms) for hovers and `motion.duration.default` (220ms) for transitions.
- **Curves:** Prefer `motion.easing.standard` (Cubic Bezier). No bounce or playful easing.

---

## 12. Common Patterns

### Primary Button
```css
.btn-primary {
  background: var(--color-fill-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-component-button);
  min-height: var(--tap-target-min);
  padding: 0 var(--space-5);
  font: var(--typography-headline);
  transition: background var(--motion-duration-fast) var(--motion-easing-standard);
}
```

### Content Card
```css
.card {
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-component-card);
  padding: var(--spacing-6);
  box-shadow: var(--elevation-raised);
}
```

---

## 13. Decision Rules for AI

1. **Hierarchy:** One `largeTitle` or `title1` per view. Use `body` for 90% of content.
2. **Surfaces:** Nest surfaces in order: `background` → `primary` → `secondary` → `elevated`.
3. **Colors:** Never use accent colors for body text. Neutrals are your friend.
4. **Interaction:** Always include hover and active states for every clickable element.
5. **Accessibility:** Ensure buttons have a minimum tap target of 44px.
6. **Simplicity:** If choosing between a "cool" design and a "clear" design, always choose **clear**.