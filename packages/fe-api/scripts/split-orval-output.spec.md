# split-orval-output 스크립트 기획서

> 위치: `packages/fe-api/scripts/split-orval-output.mjs`

## 역할

- 기존 monolith Orval 산출물(`src/apis.ts`, `src/idp-apis.ts`)에서 tag 단위 파일을 생성합니다.
- `packages/fe-api/src/core/*/index.ts`, `packages/fe-api/src/idp/*/index.ts`를 재생성합니다.
- 중앙 barrel 대신 domain subpath import가 가능하도록 전환합니다.

## 동작 규칙

- JSDoc이 붙은 raw operation export를 기준으로 블록을 분리합니다.
- route pattern으로 tag를 판별합니다.
- model 타입은 중앙 `index.ts` barrel이 아니라 개별 model 파일 경로를 직접 import합니다.
- 생성 파일은 수동 수정하지 않고 스크립트 재실행으로 갱신합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-13 | 기존 monolith output을 core/idp tag 모듈로 쪼개는 생성 스크립트 추가 | codex |
