# req-mo-page-planner.toml 기획서

> 생성일: 2026-04-13
> 타입: agent-config
> 위치: .codex/agents/mobile/req-mo-page-planner.toml

## 역할

`req-mo-page-planner`를 Expo route screen `index.spec.md` 전용 planner로 정의합니다.
이 planner는 화면 시나리오, 상호작용, 데이터 의존성, route-level ownership을 모바일 기준으로 명세합니다.

## 운영 규칙

- 출력 대상은 `apps/mobile/src/app/**/index.spec.md` 입니다.
- `Consumed Layout Contract`에는 참조하는 `_layout.spec.md`와 navigation shell 제약을 기록합니다.
- `Rendering Decision`에는 `route kind`, `ui owner`, `shared ui target`, `참조한 구현 role`을 함께 기록합니다.
- 웹용 pure page 경로(`packages/fe-ui/src/page/**`)를 기본값으로 쓰지 않고, v1은 route file 자체를 화면 owner로 간주합니다.
- 모바일 화면 spec은 gesture, keyboard, safe-area, bottom sheet, modal presentation 같은 RN UX 제약을 함께 적습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | Expo route screen `index.spec.md` 전용 planner 신규 추가 | codex |
