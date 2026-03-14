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
- `tags-split` 산출물은 후처리 없이 직접 사용합니다.
- 태그 배럴은 전체 `model` 인덱스를 재export하지 않고, 현재 소비처 호환에 필요한 최소 DTO/enum만 노출합니다.
- generated React Query 훅은 `useQuery`, `useMutation`, `prefetchQuery` 중심으로 유지하고, 현재 소비처가 없는 Suspense 전용 훅은 생성하지 않습니다.
- 로컬 서버가 없으면 원격 스펙으로 fallback 하되, 생성 실패 시 기존 산출물을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-13 | `output.mode=tags-split`와 `src/core`, `src/idp` 기준 target 구조로 재정렬 | codex |
| 2026-03-14 | `tags-split` 산출물을 직접 사용하도록 명시하고 후처리 스크립트 의존을 제거 | codex |
| 2026-03-14 | 태그 배럴의 전체 model 재export를 제거하고 최소 DTO/enum만 노출하도록 정리 | codex |
| 2026-03-14 | 미사용 generated Suspense 훅 생성을 비활성화하고 query/mutation/prefetch 중심으로 정리 | codex |
