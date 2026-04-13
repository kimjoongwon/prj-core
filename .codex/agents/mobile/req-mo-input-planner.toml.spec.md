# req-mo-input-planner.toml 기획서

> 생성일: 2026-04-13
> 타입: agent-config
> 위치: .codex/agents/mobile/req-mo-input-planner.toml

## 역할

`req-mo-input-planner`를 모바일 입력 컴포넌트 sidecar spec planner로 정의합니다.
이 planner는 `packages/fe-mo-ui/src/control/**`의 상호작용 contract와 form 입력 제약을 RN 기준으로 정리합니다.

## 운영 규칙

- 출력 대상은 `packages/fe-mo-ui/src/control/**/index.spec.md` 입니다.
- 입력 spec에는 keyboard, focus, disabled/readOnly, validation feedback, touch target 제약이 포함되어야 합니다.
- 웹 DOM 이벤트 문맥 대신 RN `onPress`, `onChangeText`, accessibility role/label 문맥을 사용합니다.
- Storybook/web preview 가정은 기본값으로 쓰지 않습니다.
- 공용 form 조합 규칙이 필요하면 별도 reserved role 또는 route spec과 연결합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | 모바일 control sidecar spec planner 신규 추가 | codex |
