# fe-form-builder.toml 기획서

> 생성일: 2026-03-21
> 타입: agent-config
> 위치: .codex/agents/fe-form-builder.toml

## 역할

`form` 재사용 계층 전용 builder입니다.
Create/Edit 페이지가 소비하는 입력 form 계층을 `feature`와 같은 위계의 page 밖 재사용 UI로 정리하는 규칙을 담당합니다.

## 운영 규칙

- 생성/수정 본문 입력 UI는 `form`이 소유합니다.
- `AiForm`은 상단 보조 feature이고, 실제 입력 필드 조합은 이 builder가 정리합니다.
- 도메인별 widget 폴더에 흩어진 폼 위젯은 `form`으로 통합합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-25 | agent 이름을 `fe-form-builder`로 단순화하고 `form`을 `feature`와 같은 위계의 루트 계층으로 승격 | codex |
| 2026-03-21 | form 재사용 계층 전용 builder 신규 추가 | codex |
| 2026-03-23 | role 메타데이터(name/description)와 config 등록 기준을 반영해 로컬 role 인식 조건을 명시 | codex |
