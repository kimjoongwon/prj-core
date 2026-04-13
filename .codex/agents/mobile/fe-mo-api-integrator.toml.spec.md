# fe-mo-api-integrator.toml 기획서

> 생성일: 2026-04-13
> 타입: agent-config
> 위치: .codex/agents/mobile/fe-mo-api-integrator.toml

## 역할

`fe-mo-api-integrator`를 모바일 데이터 조회/변경 연동 builder로 정의합니다.
이 role은 Expo/RN 화면에서 실제 API 런타임 전제 조건을 확인한 뒤 route screen 과 store 에 데이터 연동을 연결합니다.

## 운영 규칙

- 구현 전 `apps/mobile/package.json`에서 필요한 API/runtime 의존성 존재 여부를 먼저 확인합니다.
- 필수 전제가 없으면 임의 구현 대신 `BLOCKED: mobile API runtime missing`으로 종료합니다.
- 웹 `@cocrepo/api` thin container, React Query web page 패턴을 그대로 복제하지 않습니다.
- 실제 연동은 `apps/mobile/src/app/**` 또는 필요한 `packages/fe-store` wiring 에 한정합니다.
- 연동 계약은 mobile page spec 과 store spec 을 함께 참고합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | 모바일 API 연동 builder 를 active 로 승격하고 runtime prerequisite 검사 규칙을 추가 | codex |
