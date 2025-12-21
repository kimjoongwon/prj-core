/**
 * HeroUI 테마 설정
 * 커스텀 테마, 컬러, 컴포넌트 기본값을 정의합니다.
 */

import type { ThemeColors } from "@heroui/react";

/**
 * 라이트 테마 색상
 */
export const lightThemeColors: Partial<ThemeColors> = {
  background: "#FFFFFF",
  foreground: "#11181C",
  divider: "rgba(17, 17, 17, 0.15)",
  focus: "#006FEE",
  content1: "#FFFFFF",
  content2: "#F4F4F5",
  content3: "#E4E4E7",
  content4: "#D4D4D8",
  default: {
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
    foreground: "#11181C",
    DEFAULT: "#D4D4D8",
  },
  primary: {
    50: "#E6F1FE",
    100: "#CCE3FD",
    200: "#99C7FB",
    300: "#66AAF9",
    400: "#338EF7",
    500: "#006FEE",
    600: "#005BC4",
    700: "#004493",
    800: "#002E62",
    900: "#001731",
    foreground: "#FFFFFF",
    DEFAULT: "#006FEE",
  },
  secondary: {
    50: "#F2EAFA",
    100: "#E4D4F4",
    200: "#C9A9E9",
    300: "#AE7EDE",
    400: "#9353D3",
    500: "#7828C8",
    600: "#6020A0",
    700: "#481878",
    800: "#301050",
    900: "#180828",
    foreground: "#FFFFFF",
    DEFAULT: "#7828C8",
  },
  success: {
    50: "#E8FAF0",
    100: "#D1F4E0",
    200: "#A2E9C1",
    300: "#74DFA2",
    400: "#45D483",
    500: "#17C964",
    600: "#12A150",
    700: "#0E793C",
    800: "#095028",
    900: "#052814",
    foreground: "#FFFFFF",
    DEFAULT: "#17C964",
  },
  warning: {
    50: "#FEFCE8",
    100: "#FDEDD3",
    200: "#FBDBA7",
    300: "#F9C97C",
    400: "#F7B750",
    500: "#F5A524",
    600: "#C4841D",
    700: "#936316",
    800: "#62420E",
    900: "#312107",
    foreground: "#000000",
    DEFAULT: "#F5A524",
  },
  danger: {
    50: "#FEE7EF",
    100: "#FDD0DF",
    200: "#FAA0BF",
    300: "#F871A0",
    400: "#F54180",
    500: "#F31260",
    600: "#C20E4D",
    700: "#920B3A",
    800: "#610726",
    900: "#310413",
    foreground: "#FFFFFF",
    DEFAULT: "#F31260",
  },
};

/**
 * 다크 테마 색상
 */
export const darkThemeColors: Partial<ThemeColors> = {
  background: "#000000",
  foreground: "#ECEDEE",
  divider: "rgba(255, 255, 255, 0.15)",
  focus: "#006FEE",
  content1: "#18181B",
  content2: "#27272A",
  content3: "#3F3F46",
  content4: "#52525B",
  default: {
    50: "#18181B",
    100: "#27272A",
    200: "#3F3F46",
    300: "#52525B",
    400: "#71717A",
    500: "#A1A1AA",
    600: "#D4D4D8",
    700: "#E4E4E7",
    800: "#F4F4F5",
    900: "#FAFAFA",
    foreground: "#ECEDEE",
    DEFAULT: "#3F3F46",
  },
  primary: {
    50: "#001731",
    100: "#002E62",
    200: "#004493",
    300: "#005BC4",
    400: "#006FEE",
    500: "#338EF7",
    600: "#66AAF9",
    700: "#99C7FB",
    800: "#CCE3FD",
    900: "#E6F1FE",
    foreground: "#FFFFFF",
    DEFAULT: "#006FEE",
  },
  // 나머지 색상은 lightTheme과 동일하게 유지
  secondary: lightThemeColors.secondary,
  success: lightThemeColors.success,
  warning: lightThemeColors.warning,
  danger: lightThemeColors.danger,
};

/**
 * 테마 설정 타입
 */
export interface ThemeConfig {
  defaultTheme: "light" | "dark" | "system";
  disableBaseline: boolean;
}

/**
 * 기본 테마 설정
 */
export const defaultThemeConfig: ThemeConfig = {
  defaultTheme: "light",
  disableBaseline: false,
};

/**
 * HeroUI heroui() 함수에 전달할 테마 옵션
 */
export const heroUIThemeConfig = {
  themes: {
    light: {
      colors: lightThemeColors,
    },
    dark: {
      colors: darkThemeColors,
    },
  },
  layout: {
    disabledOpacity: "0.5",
    radius: {
      small: "4px",
      medium: "6px",
      large: "8px",
    },
    borderWidth: {
      small: "1px",
      medium: "2px",
      large: "3px",
    },
  },
};
