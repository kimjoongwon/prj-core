# fe-form-widget-builder.toml 기획서

> 생성일: 2026-03-21
> 타입: agent-config
> 위치: .codex/agents/fe-form-widget-builder.toml

## 역할

`widget/form` 재사용 계층 전용 builder입니다.
Create/Edit 페이지가 소비하는 입력 폼 위젯을 page 밖 재사용 UI로 정리하는 규칙을 담당합니다.

## 운영 규칙

- 생성/수정 본문 입력 UI는 `widget/form`이 소유합니다.
- `AiForm`은 상단 보조 feature이고, 실제 입력 필드 조합은 이 builder가 정리합니다.
- 도메인별 widget 폴더에 흩어진 폼 위젯은 `widget/form`으로 통합합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | form 재사용 계층 전용 builder 신규 추가 | codex |
