# fe-master-builder.toml 기획서

> 생성일: 2026-03-21
> 타입: agent-config
> 위치: .codex/agents/fe-master-builder.toml

## 역할

`feature/master/{table,list,grid}` 재사용 계층 전용 builder입니다.
특히 `MetaDataGrid` 기반 목록 화면을 `feature/master/table` 표준 엔트리로 승격하는 규칙을 담당합니다.

## 운영 규칙

- 컬렉션 탐색 중심 page는 먼저 `master` 계층으로 분류합니다.
- `MetaDataGrid` 기반 구현은 복제하지 않고 `feature/master/table` 경유로 공개합니다.
- 관련 barrel/spec 갱신을 함께 수행합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | master 재사용 계층 전용 builder 신규 추가 | codex |
