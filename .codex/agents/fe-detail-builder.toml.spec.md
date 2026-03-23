# fe-detail-builder.toml 기획서

> 생성일: 2026-03-21
> 타입: agent-config
> 위치: .codex/agents/fe-detail-builder.toml

## 역할

`feature/detail/view` 재사용 계층 전용 builder입니다.
상세 조회와 inspector 본문을 page 밖 재사용 feature로 정리하는 규칙을 담당합니다.

## 운영 규칙

- 읽기 전용 상세 화면은 `feature/detail/view`을 우선 목적지로 사용합니다.
- 입력/폼 책임은 `widget/form`으로 넘깁니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | detail 재사용 계층 전용 builder 신규 추가 | codex |
| 2026-03-23 | role 메타데이터(name/description)와 config 등록 기준을 반영해 경고 원인을 제거 | codex |
