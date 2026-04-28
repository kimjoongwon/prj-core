# fe-mo-ui Jest 설정 기획서

## 대상 파일

- `jest.config.js`

## 목적

React Native UI 패키지의 단위 테스트가 Jest/Expo 환경에서 안정적으로 실행되도록 테스트 대상과 런타임 setup 파일을 정의합니다.

## 핵심 동작

- `jest-expo` preset을 사용합니다.
- `src/**/*.test.ts`, `src/**/*.test.tsx`를 테스트 대상으로 삼습니다.
- `test/jestExpoRuntimeSetup.js`를 `setupFilesAfterEnv`로 로드해 Expo/Jest 런타임에서 부족한 Web API shim을 보강합니다.
- `src/**/*.ts`, `src/**/*.tsx`를 커버리지 대상으로 유지합니다.

## 변경 이력

| 날짜 | 변경 내용 |
| --- | --- |
| 2026-04-29 | fe-mo-ui Jest 실행 시 Expo 런타임 shim을 로드하는 설정 의도를 문서화했습니다. |
