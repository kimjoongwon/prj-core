module.exports = {
  preset: "jest-expo",
  rootDir: ".",
  globals: {
    __DEV__: true,
  },
  testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/src/**/*.test.tsx"],
  setupFilesAfterEnv: ["<rootDir>/test/jestExpoRuntimeSetup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!.*((jest-)?react-native|@react-native|expo|@expo|heroui-native|react-native-reanimated|react-native-worklets|react-native-svg|uniwind))",
  ],
  collectCoverageFrom: [
    "src/**/*.ts",
    "src/**/*.tsx",
    "!src/**/*.test.ts",
    "!src/**/*.test.tsx",
  ],
};
