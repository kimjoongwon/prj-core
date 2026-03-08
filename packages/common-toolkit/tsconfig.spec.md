# tsconfig.json 기획서

> 생성일: 2026-03-09
> 타입: config
> 위치: packages/common-toolkit/tsconfig.json

## 역할

`@cocrepo/toolkit` 패키지의 TypeScript 빌드 입력과 산출물 경계를 정의합니다.
배포용 라이브러리 소스와 Vitest 테스트 소스를 분리해 `tsc --build`가 라이브러리 산출물만 생성하도록 보장합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `include` | `src/**/*`, `index.ts`를 라이브러리 빌드 입력으로 포함 |
| `exclude` | `node_modules`, `dist`, `src/__tests__`, `src/**/*.test.ts`, `src/**/*.test.tsx` 제외 |
| `outDir` | `dist` 산출물 생성 |
| `references` | `../common-constant` 선행 빌드 참조 |

## 구현 체크리스트

- [x] 라이브러리 엔트리(`index.ts`) 포함
- [x] `src` 본문 소스 포함
- [x] 테스트 파일 및 테스트 디렉터리 제외
- [x] `dist` 산출물 디렉터리 제외

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | Docker/prune 환경의 `tsc --build`가 Vitest 테스트 파일을 컴파일하지 않도록 `src/__tests__` 및 `*.test.ts(x)`를 제외 대상으로 추가 | codex |
