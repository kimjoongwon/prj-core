# orch-stage.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/orch-stage.toml

## 역할

Stage 오케스트레이터가 route layout skeleton과 named slot topology 기획부터 페이지 통합까지 contract를 빠뜨리지 않도록 흐름을 정의합니다.
Stage 4의 route layout / slot / Surface 결정이 Stage 6의 `layout.tsx` + `@slot/default.tsx` + `page.tsx/@slot page.tsx` 구현과 리뷰 기준으로 이어지게 하는 운영 규칙을 문서화합니다.

## 운영 규칙

- Stage 4 완료 조건에는 `layout.spec.md`의 route skeleton / slot topology / Surface ownership 결정과 `page.spec.md`의 Consumed Layout Contract가 포함됩니다.
- Stage 4-6은 `page role`과 `reusable target` 계약을 함께 다루며, `master/detail/form` 분류를 명시해야 합니다.
- Stage 4의 Cell 기획 산출물은 `packages/fe-ui/src/cell/**` 경로를 기준으로 기록합니다.
- `master/detail/form`은 `packages/fe-ui/src` 루트에서 `feature`와 같은 위계의 전용 재사용 계층으로 관리합니다.
- Stage 5는 Stage 4에서 확정한 재사용 Layout primitive contract와 메뉴 contract를 그대로 소비해야 하며, `fe-master-builder`/`fe-detail-builder`/`fe-form-builder`를 조건부로 호출합니다.
- Stage 6에서 pure page는 `packages/fe-ui/src/page/[PageName]/[PageName].tsx`와 동일 폴더 sidecar 구조로 관리합니다.
- Stage 6의 `/fe-review`는 route-layout-owned skeleton/surface, slot fallback, page content-only 계약과 `page role/reusable target` 일치 여부를 함께 검증해야 합니다.
- 문서에서는 `.codex/config.toml` 항목을 `role`, 실행 주체를 `agent`로 구분합니다.
- Stage 1과 Stage 4의 호출 구조는 flat list가 아니라 `orch-requirement`와 `orch-screen-planner` 하위 호출 트리로 기록합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-28 | Stage별 호출 role 트리와 `web/src/app` 경로, role/agent 용어를 정정 | codex |
| 2026-03-28 | Stage 4 Cell 기획 경로를 `packages/fe-ui/src/cell/**` 기준으로 정정 | codex |
| 2026-03-26 | Stage 6 pure page 산출물을 folder-based sidecar 경로로 명시 | codex |
| 2026-03-25 | `master/detail/form`을 `feature`와 같은 위계의 `src` 루트 전용 계층으로 명시 | codex |
| 2026-03-21 | `master/detail/form` 전용 builder 분기와 `page role/reusable target` 검증 규칙을 추가 | codex |
| 2026-03-21 | Stage 4-6 흐름을 route layout skeleton ownership 기준으로 재정의 | codex |
| 2026-03-21 | parallel routes / slots topology와 default fallback 검증 규칙을 추가 | codex |
