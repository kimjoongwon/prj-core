/**
 * 디자인 토큰 정의
 * 프로젝트 전체에서 사용되는 색상, 간격, 타이포그래피 등을 중앙 관리합니다.
 */

/**
 * 색상 팔레트
 * HeroUI의 semantic 색상 시스템과 호환됩니다.
 */
export const colors = {
  // 브랜드 색상
  brand: {
    primary: "#006FEE",
    secondary: "#7828C8",
    success: "#17C964",
    warning: "#F5A524",
    danger: "#F31260",
  },
  // 중립 색상
  neutral: {
    50: "#FAFAFA",
    100: "#F4F4F5",
    200: "#E4E4E7",
    300: "#D4D4D8",
    400: "#A1A1AA",
    500: "#71717A",
    600: "#52525B",
    700: "#3F3F46",
    800: "#27272A",
    900: "#18181B",
  },
  // 시맨틱 색상
  semantic: {
    background: {
      light: "#FFFFFF",
      dark: "#000000",
    },
    foreground: {
      light: "#11181C",
      dark: "#ECEDEE",
    },
    divider: {
      light: "rgba(17, 17, 17, 0.15)",
      dark: "rgba(255, 255, 255, 0.15)",
    },
  },
} as const;

/**
 * 간격 시스템
 * Tailwind CSS 기본 스케일과 호환됩니다.
 */
export const spacing = {
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
} as const;

/**
 * 타이포그래피 스케일
 */
export const typography = {
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    base: ["1rem", { lineHeight: "1.5rem" }],
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    "2xl": ["1.5rem", { lineHeight: "2rem" }],
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
  },
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

/**
 * 반응형 브레이크포인트
 */
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

/**
 * 테두리 반경
 */
export const borderRadius = {
  none: "0",
  sm: "0.125rem",
  DEFAULT: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
} as const;

/**
 * 그림자
 */
export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
} as const;

/**
 * Z-index 레이어
 */
export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

/**
 * 애니메이션 duration
 */
export const duration = {
  fastest: "50ms",
  faster: "100ms",
  fast: "150ms",
  normal: "200ms",
  slow: "300ms",
  slower: "400ms",
  slowest: "500ms",
} as const;

/**
 * 모든 토큰을 하나의 객체로 export
 */
export const tokens = {
  colors,
  spacing,
  typography,
  breakpoints,
  borderRadius,
  shadows,
  zIndex,
  duration,
} as const;

export type Tokens = typeof tokens;
export type Colors = typeof colors;
export type Spacing = typeof spacing;
