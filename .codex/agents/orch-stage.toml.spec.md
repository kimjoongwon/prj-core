# orch-stage.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/orch-stage.toml

## 역할

Stage 오케스트레이터가 route layout skeleton과 named slot topology 기획부터 페이지 통합까지 contract를 빠뜨리지 않도록 흐름을 정의합니다.
Stage 4의 route layout / slot / Surface 결정이 Stage 6의 `layout.tsx` + `@slot/default.tsx` + `page.tsx/@slot page.tsx` 구현과 리뷰 기준으로 이어지게 하는 운영 규칙을 문서화합니다.
또한 orch-stage 자체는 Stage 경계, 리뷰 gate, fan-out/fan-in, lock/merge 정책만 소유하고, 하위 호출 세부사항은 child role 문서를 source of truth로 참조하도록 유지합니다.

## 운영 규칙

- Stage 4 완료 조건에는 `layout.spec.md`의 route skeleton / slot topology / Surface ownership 결정과 `page.spec.md`의 Consumed Layout Contract가 포함됩니다.
- Stage 4-6은 `page role`과 `reusable target` 계약을 함께 다루며, `master/detail/form` 분류를 명시해야 합니다.
- Stage 4의 Cell 기획 산출물은 `packages/fe-ui/src/cell/**` 경로를 기준으로 기록합니다.
- Stage 4의 Columns 기획 산출물은 `packages/fe-ui/src/columns/master/**.spec.md` 경로를 기준으로 기록합니다.
- `master/detail/form`은 `packages/fe-ui/src` 루트에서 `feature`와 같은 위계의 전용 재사용 계층으로 관리합니다.
- Stage 5는 Stage 4에서 확정한 재사용 Layout primitive contract와 메뉴 contract를 그대로 소비해야 하며, `fe-master-builder`/`fe-detail-builder`/`fe-form-builder`와 `fe-columns-builder(조건부)`를 호출합니다.
- Stage 6에서 pure page는 `packages/fe-ui/src/page/[PageName]/[PageName].tsx`와 동일 폴더 sidecar 구조로 관리합니다.
- Stage 6의 `/fe-review`는 route-layout-owned skeleton/surface, slot fallback, page content-only 계약과 `page role/reusable target` 일치 여부를 함께 검증해야 합니다.
- 문서에서는 `.codex/config.toml` 항목을 `role`, 실행 주체를 `agent`로 구분합니다.
- Stage 1과 Stage 4의 exact child 호출 체인은 `orch-requirement`, `orch-screen-planner` 문서를 source of truth로 참조합니다.
- `orch-stage.toml`에는 child role 내부 규칙을 다시 복제하지 않고, Stage 계약과 위임 경계만 남깁니다.
- 병렬 실행 설명은 fan-out/fan-in 엔진 하나로 통합하고, 수동 지정과 자동 판단은 같은 실행 규칙 안에서 다룹니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | Stage 설명/호출 체인 중복을 제거하고 child role 참조 중심 구조로 `orch-stage.toml`을 전면 정리 | codex |
| 2026-03-28 | `req-columns-planner`/`fe-columns-builder`를 Stage 4-5 흐름과 호출 트리에 반영 | codex |
| 2026-03-28 | Stage별 호출 role 트리와 `web/src/app` 경로, role/agent 용어를 정정 | codex |
| 2026-03-28 | Stage 4 Cell 기획 경로를 `packages/fe-ui/src/cell/**` 기준으로 정정 | codex |
| 2026-03-26 | Stage 6 pure page 산출물을 folder-based sidecar 경로로 명시 | codex |
| 2026-03-25 | `master/detail/form`을 `feature`와 같은 위계의 `src` 루트 전용 계층으로 명시 | codex |
| 2026-03-21 | `master/detail/form` 전용 builder 분기와 `page role/reusable target` 검증 규칙을 추가 | codex |
| 2026-03-21 | Stage 4-6 흐름을 route layout skeleton ownership 기준으로 재정의 | codex |
| 2026-03-21 | parallel routes / slots topology와 default fallback 검증 규칙을 추가 | codex |
