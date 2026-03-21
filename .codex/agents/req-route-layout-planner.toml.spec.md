# req-route-layout-planner.toml 기획서

> 생성일: 2026-03-21
> 타입: agent-config
> 위치: .codex/agents/req-route-layout-planner.toml

## 역할

`req-route-layout-planner`를 route `layout.spec.md` 전용 planner로 정의합니다.
이 planner는 서버 `layout.tsx`가 소유할 화면 skeleton, named slot topology, child page 콘텐츠 계약을 명세합니다.

## 운영 규칙

- `layout.spec.md`는 `Server Skeleton`, `Page Composition`, `Surface Ownership`, `Slot Topology`, `Slot URL Mapping`, `Slot Fallbacks`, `Independent Navigation Policy`, `Child Content Contract`를 반드시 포함합니다.
- route-level `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` owner는 layout spec에서 먼저 결정합니다.
- slot은 예외 패턴으로만 계획하고, 사용 시 `default.tsx` fallback 정책을 같이 명세합니다.
- child `page.spec.md`는 layout spec을 소비하는 문서로 정렬됩니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | route `layout.spec.md` 전용 planner 신규 추가 | codex |
| 2026-03-21 | parallel routes / slots topology와 fallback 계획 규칙을 추가 | codex |
