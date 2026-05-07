/**
 * TarifApp — Design System
 * ─────────────────────────────────────────────
 * Single source of truth for all visual tokens.
 * Import as:  import ds from './design.js';
 * Then use:   style={{ ...ds.card }}
 *             style={{ color: ds.colors.accent }}
 */

// ─── Color Palette ───────────────────────────────────────────────────────────
export const colors = {
  // Backgrounds
  bg:           '#f8fafc',   // page background
  surface:      '#ffffff',   // card / panel surface
  surfaceMuted: '#f8fafc',   // inset / muted area
  surfaceHover: '#f1f5f9',   // hover tint on surfaces

  // Borders
  border:       '#e2e8f0',   // default border
  borderSubtle: '#f1f5f9',   // divider / subtle separator

  // Text
  textPrimary:   '#0f172a',
  textSecondary: '#475569',
  textMuted:     '#94a3b8',
  textDisabled:  '#cbd5e1',

  // Accent – violet (primary actions)
  accent:      '#7c3aed',
  accentHover: '#6d28d9',
  accentLight: '#f5f3ff',
  accentText:  '#5b21b6',

  // Semantic
  success:      '#16a34a',
  successLight: '#dcfce7',
  warning:      '#d97706',
  warningLight: '#fef9c3',
  danger:       '#dc2626',
  dangerLight:  '#fee2e2',
};

// ─── Spacing – 8 px grid ─────────────────────────────────────────────────────
export const space = {
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  8:  32,
  10: 40,
  12: 48,
};

// ─── Border Radius ────────────────────────────────────────────────────────────
export const radius = {
  sm:   6,
  md:   8,
  lg:   12,
  xl:   16,
  '2xl': 20,
  full: 9999,
};

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const shadow = {
  xs: '0 1px 2px rgba(0,0,0,0.05)',
  sm: '0 1px 3px rgba(0,0,0,0.06)',
  md: '0 2px 8px rgba(0,0,0,0.06)',
  lg: '0 4px 16px rgba(0,0,0,0.08)',
};

// ─── Typography Scale ─────────────────────────────────────────────────────────
// Each entry is a partial style object — spread it into your style prop.
export const text = {
  xs:   { fontSize: '0.72rem',  lineHeight: 1.4 },
  sm:   { fontSize: '0.8rem',   lineHeight: 1.5 },
  base: { fontSize: '0.875rem', lineHeight: 1.6 },
  md:   { fontSize: '1rem',     lineHeight: 1.5 },
  lg:   { fontSize: '1.125rem', lineHeight: 1.4 },
  xl:   { fontSize: '1.35rem',  lineHeight: 1.3 },
  '2xl':{ fontSize: '1.6rem',   lineHeight: 1.2 },
};

// ─── Compound Style Objects ───────────────────────────────────────────────────

/** Standard card (12 px radius) */
export const card = {
  background:   colors.surface,
  borderRadius: radius.lg,
  border:       `1px solid ${colors.border}`,
  boxShadow:    shadow.sm,
};

/** Large card (16 px radius) */
export const cardLg = {
  background:   colors.surface,
  borderRadius: radius.xl,
  border:       `1px solid ${colors.border}`,
  boxShadow:    shadow.md,
};

/** Text input / select */
export const input = {
  width:        '100%',
  padding:      '10px 14px',
  border:       `1.5px solid ${colors.border}`,
  borderRadius: radius.md,
  fontSize:     text.base.fontSize,
  fontFamily:   'inherit',
  outline:      'none',
  background:   colors.surface,
  color:        colors.textPrimary,
  transition:   'border-color 0.15s, box-shadow 0.15s',
};

/** Primary / accent button */
export const btnPrimary = {
  padding:      '9px 20px',
  borderRadius: radius.md,
  fontSize:     text.base.fontSize,
  fontWeight:   600,
  border:       'none',
  cursor:       'pointer',
  fontFamily:   'inherit',
  background:   colors.accent,
  color:        '#fff',
  boxShadow:    '0 2px 8px rgba(99,102,241,0.2)',
  transition:   'background 0.15s, box-shadow 0.15s',
};

/** Secondary / outline button */
export const btnSecondary = {
  padding:      '9px 20px',
  borderRadius: radius.md,
  fontSize:     text.base.fontSize,
  fontWeight:   600,
  border:       `1px solid ${colors.border}`,
  cursor:       'pointer',
  fontFamily:   'inherit',
  background:   colors.surface,
  color:        colors.textSecondary,
  transition:   'background 0.15s',
};

/** Ghost / text button */
export const btnGhost = {
  padding:      '8px 16px',
  borderRadius: radius.md,
  fontSize:     text.base.fontSize,
  fontWeight:   500,
  border:       'none',
  cursor:       'pointer',
  fontFamily:   'inherit',
  background:   'none',
  color:        colors.textSecondary,
};

/** Small pill badge */
export const badge = {
  display:        'inline-flex',
  alignItems:     'center',
  borderRadius:   radius.full,
  padding:        '3px 10px',
  fontSize:       text.xs.fontSize,
  fontWeight:     600,
  lineHeight:     1.4,
};

/** Difficulty-level badge colors */
export const difficultyColors = {
  kolay: { background: colors.successLight, color: colors.success },
  orta:  { background: colors.warningLight, color: colors.warning },
  zor:   { background: colors.dangerLight,  color: colors.danger  },
};

/** Page section title */
export const pageTitle = {
  fontSize:      text.xl.fontSize,
  fontWeight:    800,
  color:         colors.textPrimary,
  letterSpacing: '-0.4px',
  marginBottom:  space[8],
};

/** Horizontal rule / divider */
export const divider = {
  borderTop: `1px solid ${colors.borderSubtle}`,
};

// ─── Default export (convenience) ────────────────────────────────────────────
const ds = {
  colors,
  space,
  radius,
  shadow,
  text,
  card,
  cardLg,
  input,
  btnPrimary,
  btnSecondary,
  btnGhost,
  badge,
  difficultyColors,
  pageTitle,
  divider,
};
export default ds;
