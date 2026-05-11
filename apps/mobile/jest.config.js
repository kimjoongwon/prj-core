module.exports = {
  preset: "jest-expo",
  rootDir: ".",
  testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/src/**/*.test.tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.css$": "<rootDir>/test/styleMock.js",
  },
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
