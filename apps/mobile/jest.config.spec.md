# apps/mobile Jest 설정 기획서

## 대상 파일

- `jest.config.js`

## 목적

Expo 기반 모바일 앱 단위 테스트가 Jest 환경에서 안정적으로 실행되도록 프로젝트 루트, 테스트 매칭, 모듈 별칭, CSS mock, 커버리지 대상, 런타임 setup 파일을 정의합니다.

## 핵심 동작

- `jest-expo` preset을 사용합니다.
- `src/**/*.test.ts`, `src/**/*.test.tsx`를 테스트 대상으로 삼습니다.
- `@/` 별칭을 `src/`로 연결합니다.
- CSS import는 `test/styleMock.js`로 대체합니다.
- `test/jestExpoRuntimeSetup.js`를 `setupFilesAfterEnv`로 로드해 Expo/Jest 런타임에서 부족한 Web API shim을 보강합니다.