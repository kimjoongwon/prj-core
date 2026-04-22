# req-screen-planner.toml 기획서

> 생성일: 2026-03-28
> 타입: agent-config
> 위치: .codex/agents/req-screen-planner.toml

## 역할

`req-screen-planner`를 L3-L4 기능/화면 구조 planner로 정의합니다.
이 role은 도메인 기능과 화면 목록, 라우팅, 초기 `page.spec.md` 초안을 만들고, 상세 화면 기획은 `orch-screen-planner`로 넘깁니다.

## 운영 규칙

- 출력 경로는 반드시 `apps/[app]/web/src/app/**/page.spec.md`를 사용합니다.
- 기본 화면 초안은 `page.tsx` 중심 CSR/thin route container를 전제로 작성합니다.
- page 단위 `useSuspenseQuery`는 기본 전제가 아니며, 기본 조회는 `useQuery`/`useInfiniteQuery`를 전제로 기록합니다.
- `_client.tsx`, `_prefetch.ts`, `HydrationBoundary`, 서버 prefetch는 기본 체크리스트에 넣지 않습니다.
- 초기 `page.spec.md`에도 `## Consumed Layout Contract`, `## Rendering Decision`을 포함합니다.
- `Rendering Decision`에는 `page role`, `reusable target`, `page component path`, `SSR/prefetch 예외 승인 여부`를 기록합니다.
- `page component path`는 `packages/fe-ui/src/page/[PageName]/[PageName].tsx` 형식을 사용합니다.
- route skeleton, named slot topology, Surface ownership은 후속 `orch-screen-planner`와 `req-route-layout-planner`가 정교화합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | page-level `SuspenseQuery` 지양 정책에 맞춰 초기 화면 초안 기본값을 `useQuery` 중심 CSR로 정리 | codex |
| 2026-03-28 | L3-L4 화면 초안 role로 재정의하고 CSR/thin-container 기본 규칙을 문서화 | codex |
