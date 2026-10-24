module.exports = {
  preset: "jest-expo",
  rootDir: ".",
  testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/src/**/*.test.tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.css$": "<rootDir>/test/styleMock.js",
    // MobX 7의 react-native 조건은 ESM 산출물을 가리켜 jest(CJS)가 해석하지 못한다.
    // 앱 번들은 metro가 ESM을 처리하므로 테스트에서만 mobile 의존성 트리의 CJS로 고정한다.
    // (루트 경로로 잡으면 react 19.3 변형 인스턴스를 물어와 React 이중 로딩이 생긴다)
    "^mobx$": "<rootDir>/node_modules/mobx/dist/index.js",
    "^mobx-react-lite$": "<rootDir>/node_modules/mobx-react-lite/dist/index.js",
    // 워크스페이스 카탈로그 react(19.3.1)와 모바일 고정 react(19.2.x)가 섞여
    // 훅 dispatcher가 null이 되는 이중 로딩을 막는다.
    "^react$": "<rootDir>/node_modules/react/index.js",
  },
  setupFilesAfterEnv: ["<rootDir>/test/jestExpoRuntimeSetup.js"],
  transformIgnorePatterns: [
		"node_modules/(?!.*(@cocrepo|(jest-)?react-native|@react-native|decode-uri-component|expo|@expo|heroui-native|react-native-reanimated|react-native-worklets|react-native-svg|uniwind))",
  ],
  collectCoverageFrom: [
    "src/**/*.ts",
    "src/**/*.tsx",
    "!src/**/*.test.ts",
    "!src/**/*.test.tsx",
  ],
};
