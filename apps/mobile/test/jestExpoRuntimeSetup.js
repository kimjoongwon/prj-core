const { TextDecoder, TextEncoder } = require("node:util");
const { URL, URLSearchParams } = require("node:url");

jest.mock("react-native-worklets", () => {
  const createSharedValue = (initialValue) => ({
    value: initialValue,
    get() {
      return this.value;
    },
    set(nextValue) {
      this.value =
        typeof nextValue === "function" ? nextValue(this.value) : nextValue;
    },
  });

  return {
    __esModule: true,
    createWorkletRuntime: () => ({}),
    makeMutable: createSharedValue,
    makeShareable: (value) => value,
    runOnRuntime: (_runtime, callback) => callback,
    runOnUI: (callback) => callback,
    runOnUISync: (callback) => callback,
    scheduleOnRN: (callback, ...args) => callback?.(...args),
    scheduleOnRuntime: (_runtime, callback, ...args) => callback?.(...args),
  };
});

jest.mock("react-native-reanimated", () => {
  const ReactNative = require("react-native");
  const identity = (value) => value;
  const createSharedValue = (initialValue) => ({
    value: initialValue,
    get() {
      return this.value;
    },
    set(nextValue) {
      this.value =
        typeof nextValue === "function" ? nextValue(this.value) : nextValue;
    },
  });
  const createAnimationBuilder = () => {
    const builder = {};
    const proxy = new Proxy(builder, {
      get(target, property) {
        if (property in target) {
          return target[property];
        }
        return () => proxy;
      },
    });
    return proxy;
  };
  class Keyframe {
    constructor(value) {
      this.value = value;
    }

    delay() {
      return this;
    }

    duration() {
      return this;
    }

    easing() {
      return this;
    }
  }
  const Animated = {
    Image: ReactNative.Image,
    Pressable: ReactNative.Pressable,
    ScrollView: ReactNative.ScrollView,
    Text: ReactNative.Text,
    View: ReactNative.View,
    createAnimatedComponent: (Component) => Component,
  };

  return {
    __esModule: true,
    default: Animated,
    ...Animated,
    Easing: {
      back: () => identity,
      bezier: () => identity,
      bounce: identity,
      circle: identity,
      cubic: identity,
      ease: identity,
      elastic: () => identity,
      exp: identity,
      in: (easing) => easing,
      inOut: (easing) => easing,
      linear: identity,
      out: (easing) => easing,
      poly: () => identity,
      quad: identity,
      sin: identity,
    },
    Extrapolation: {
      CLAMP: "clamp",
      EXTEND: "extend",
      IDENTITY: "identity",
    },
    FadeIn: createAnimationBuilder(),
    FadeInDown: createAnimationBuilder(),
    FadeInLeft: createAnimationBuilder(),
    FadeInUp: createAnimationBuilder(),
    FadeOut: createAnimationBuilder(),
    FadeOutRight: createAnimationBuilder(),
    FlipInXDown: createAnimationBuilder(),
    FlipOutXDown: createAnimationBuilder(),
    Keyframe,
    LinearTransition: createAnimationBuilder(),
    ReduceMotion: {
      Always: "always",
      Never: "never",
      System: "system",
    },
    SlideInDown: createAnimationBuilder(),
    SlideOutUp: createAnimationBuilder(),
    ZoomIn: createAnimationBuilder(),
    cancelAnimation: () => undefined,
    interpolate: (_value, _inputRange, outputRange) => outputRange[0],
    runOnJS: (callback) => callback,
    runOnUI: (callback) => callback,
    useAnimatedProps: (updater) => updater(),
    useAnimatedReaction: () => undefined,
    useAnimatedScrollHandler: (handler) => handler,
    useAnimatedStyle: (updater) => updater(),
    useComposedEventHandler: (handler) => handler,
    useDerivedValue: (updater) => createSharedValue(updater()),
    useReducedMotion: () => false,
    useSharedValue: createSharedValue,
    withDecay: (config, callback) => {
      callback?.(true);
      return config?.velocity ?? 0;
    },
    withDelay: (_delay, value) => value,
    withRepeat: (value) => value,
    withSequence: (...values) => values[values.length - 1],
    withSpring: (value) => value,
    withTiming: (value) => value,
  };
});

const { Uniwind } = require("uniwind");
const testThemeVariables = {
  "--color-accent": "#2563eb",
  "--color-accent-foreground": "#ffffff",
  "--color-accent-hover": "#2563eb",
  "--color-danger": "#dc2626",
  "--color-danger-hover": "#dc2626",
  "--color-danger-soft": "#fee2e2",
  "--color-danger-soft-foreground": "#dc2626",
  "--color-danger-soft-hover": "#fee2e2",
  "--color-default": "#e4e4e7",
  "--color-default-hover": "#e4e4e7",
  "--color-foreground": "#18181b",
  "--color-muted": "#71717a",
  "--color-success": "#16a34a",
  "--color-warning": "#ca8a04",
};

Uniwind.updateCSSVariables("light", testThemeVariables);
Uniwind.updateCSSVariables("dark", testThemeVariables);

Object.defineProperties(globalThis, {
  TextDecoder: {
    configurable: true,
    value: TextDecoder,
    writable: true,
  },
  TextDecoderStream: {
    configurable: true,
    value: class TextDecoderStream {},
    writable: true,
  },
  TextEncoderStream: {
    configurable: true,
    value: class TextEncoderStream {},
    writable: true,
  },
  TextEncoder: {
    configurable: true,
    value: TextEncoder,
    writable: true,
  },
  URL: {
    configurable: true,
    value: URL,
    writable: true,
  },
  URLSearchParams: {
    configurable: true,
    value: URLSearchParams,
    writable: true,
  },
  structuredClone: {
    configurable: true,
    value: (value) => JSON.parse(JSON.stringify(value)),
    writable: true,
  },
});

Object.defineProperty(globalThis, "__ExpoImportMetaRegistry", {
  configurable: true,
  enumerable: false,
  value: {
    get url() {
      return "";
    },
  },
  writable: true,
});
