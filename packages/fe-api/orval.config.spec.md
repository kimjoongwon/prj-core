# Orval Config 기획서

> 위치: `packages/fe-api/orval.config.js`

## 역할

- core API와 idp API의 Orval 생성 구성을 관리합니다.
- 환경별 OpenAPI 스펙 URL 선택과 React Query 생성 옵션을 정의합니다.
- 향후 `tags-split` 생성 시 `src/core`, `src/idp`를 target root로 사용하도록 강제합니다.

## 현재 규칙

- `store` 출력은 `src/core/index.ts`를 기준으로 분할됩니다.
- `idp` 출력은 `src/idp/index.ts`를 기준으로 분할됩니다.
- 공통 query 옵션과 custom axios mutator는 기존 설정을 유지합니다.
- 로컬 서버가 없으면 원격 스펙으로 fallback 하되, 생성 실패 시 기존 산출물을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-13 | `output.mode=tags-split`와 `src/core`, `src/idp` 기준 target 구조로 재정렬 | codex |
