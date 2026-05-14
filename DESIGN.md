# Design Brief

## Concept
Professional inventory management tool—clean, data-centric interface for single operators. Every pixel serves function. Inspired by specialized instruments (Logic Pro, Linear). No decoration.

## Tone
Refined minimalism. Industrial-utilitarian. Precise, trustworthy, dense.

## Palette
| Role | OKLCH |
|------|-------|
| Background | 0.12 0.01 265 (deep slate) |
| Card | 0.16 0.01 270 (slate) |
| Foreground | 0.97 0.01 275 (near-white) |
| Primary | 0.48 0.17 176 (teal) |
| Accent | 0.52 0.21 117 (green—positive/in-stock) |
| Warning | 0.65 0.22 25 (amber—low-stock) |
| Border | 0.22 0.01 268 (subtle dark slate) |

## Typography
- **Display/Body:** General Sans — modern, neutral, legible at density
- **Mono:** Geist Mono — technical authentication for SKU, codes, quantities
- **Scale:** 3-tier (h1 32px, h2 20px, body 14px, sm 12px)

## Shape Language
- **Radius:** 3px (minimal, data-driven feel)
- **Shadows:** None on cards; depth via borders and background tones only
- **Spacing:** 12px baseline grid; tight density for data rows

## Structural Zones
| Zone | Treatment |
|------|----------|
| Header | bg-card, border-b border-border, tight p-3 |
| Sidebar | bg-sidebar, border-r border-sidebar-border, nav links with hover state |
| Main Content | bg-background |
| Data Tables | rows with border-b, hover state via bg-muted/50 |
| Cards (Metrics) | bg-card, border border-border, p-4, no shadow |
| Footer | bg-muted/30, border-t border-border |

## Key Patterns
- **Badges:** .badge-success (green), .badge-warning (amber), .badge-neutral (grey) for stock status
- **Data Cells:** .data-cell for table rows; .data-cell-mono for SKU/code fields
- **Search/Filter:** Inline, above table, light input styling
- **Inline Actions:** Edit/Delete buttons compact, icon-based where possible
- **Dashboard Metrics:** 4-up grid (responsive), each is a card with a label, value, and delta indicator

## Motion
- **Transitions:** Default 0.3s cubic-bezier(0.4, 0, 0.2, 1) on interactive elements
- **Hover:** Subtle background shift (bg-muted/50), no animation bounce
- **Loading:** Minimal spinner centered, no color cycling

## Constraints
- No gradients, no gloss, no glow effects
- No decorative illustrations or icons beyond functional UI
- All text contrast ≥ AA+
- Dense layout; use vertical space for content, not breathing room

## Signature Detail
Monospace SKU codes rendered with subtle tracking (letter-spacing) and muted foreground color; on hover, promoted to primary color with full opacity. Creates visual rhythm in data rows while maintaining technical authenticity.

