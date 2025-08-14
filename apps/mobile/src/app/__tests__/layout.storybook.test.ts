/**
 * Verifies that initialRouteName switches to `storybook` when EXPO_PUBLIC_STORYBOOK=1
 */

describe("_layout.tsx initial route via env", () => {
  const origEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...origEnv };
    // Mocks to prevent native side effects during module import
    jest.doMock("expo-splash-screen", () => ({
      preventAutoHideAsync: jest.fn(),
      hideAsync: jest.fn(),
    }));
    jest.doMock("react-native-reanimated", () => ({}));
    jest.doMock("expo-router", () => ({
      ErrorBoundary: () => null,
      Stack: {
        Screen: () => null,
        Protected: ({ children }: any) => children,
      },
    }));
    jest.doMock("@expo/vector-icons/FontAwesome", () => ({ font: {} }));
    jest.doMock("expo-font", () => ({ useFonts: () => [true, undefined] }));
    jest.doMock("@react-navigation/native", () => ({ ThemeProvider: ({ children }: any) => children }));
    jest.doMock("@/src/components/useColorScheme", () => ({ useColorScheme: () => "light" }));
    jest.doMock("@/src/components/providers/theme-provider", () => ({
      ThemeProvider: ({ children }: any) => children,
      useTheme: () => ({ isDark: false, theme: {
        colors: {
          primary: { DEFAULT: "#000" },
          background: "#fff",
          content1: { DEFAULT: "#fff" },
          foreground: "#000",
          content3: { DEFAULT: "#eee" },
          danger: { DEFAULT: "#f00" },
        }
      }})
    }));
  });

  afterEach(() => {
    process.env = origEnv;
    jest.dontMock("expo-splash-screen");
    jest.dontMock("react-native-reanimated");
    jest.dontMock("expo-router");
    jest.dontMock("@expo/vector-icons/FontAwesome");
    jest.dontMock("expo-font");
  });

  test("routes to storybook when EXPO_PUBLIC_STORYBOOK=1", async () => {
    process.env.EXPO_PUBLIC_STORYBOOK = "1";
    const mod = await import("../_layout");
    expect(mod.unstable_settings.initialRouteName).toBe("storybook");
  });

  test("routes to (tabs) when env is not set", async () => {
    delete process.env.EXPO_PUBLIC_STORYBOOK;
    const mod = await import("../_layout");
    expect(mod.unstable_settings.initialRouteName).toBe("(tabs)");
  });
});
