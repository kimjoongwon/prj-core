// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    files: ["e2e/**/*.js"],
    languageOptions: {
      globals: {
        beforeAll: "readonly",
        by: "readonly",
        describe: "readonly",
        device: "readonly",
        element: "readonly",
        expect: "readonly",
        it: "readonly",
        waitFor: "readonly",
      },
    },
  },
  {
    ignores: ["dist/*"],
  }
]);
