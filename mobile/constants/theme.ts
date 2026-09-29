/**
 * Design Tokens & Theme for Mobile
 * Recreated from app/globals.css
 */

export const Colors = {
  // Brand tokens from app/globals.css
  ink: "#16241f",
  teal: "#0e5c56",
  tealDark: "#0a413d",
  sand: "#f6f2e9",
  coral: "#e85c3f",
  gold: "#c89b3c",
  cloud: "#dce3de",
  white: "#ffffff",

  // Extended slate palette for UI backgrounds & text
  slate50: "#f8fafc",
  slate100: "#f1f5f9",
  slate200: "#e2e8f0",
  slate300: "#cbd5e1",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1e293b",
  slate900: "#0f172a",

  // Feedback
  success: "#15803d",
  successBg: "#dcfce7",
  error: "#b91c1c",
  errorBg: "#fef2f2",
  warning: "#b45309",
  warningBg: "#fef3c7",
} as const;

export const Typography = {
  // System fallbacks with font mapping support
  display: "System",
  body: "System",
  mono: "SpaceMono",
} as const;

export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
} as const;

export const theme = {
  colors: Colors,
  typography: Typography,
  shadows: Shadows,
};

export default theme;
