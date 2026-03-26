# fe-display-component-builder.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/fe-display-component-builder.toml

## 역할

Display component builder agent가 실제 레이아웃/페이지 구조 컴포넌트를 기준으로 재사용 판단을 하도록 규칙을 정의합니다.
페이지 셸과 헤더는 `Page`, `Section`, `PageTitleBar`를 기준으로 참조하고, 표현 레이어는 `surface/*`를 우선 재사용하도록 문맥을 고정합니다.

## 운영 규칙

- `surface/PageSurface`, `surface/SectionSurface`는 표현 레이어 재사용 대상으로 안내합니다.
- `rhythm/VStack`, `rhythm/HStack`, `layout/Page`, `layout/Section`, `widget/PageTitleBar`를 구조/리듬 재사용 대상으로 안내합니다.
- 신규 stack/spacer 조합에서는 semantic rhythm preset 사용을 우선하도록 문맥을 고정합니다.
- 새로운 display 컴포넌트는 페이지 래퍼나 제목 패널을 중복 생성하지 않고 기존 구조 컴포넌트와 조합되도록 설계합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | semantic rhythm preset 우선 사용 규칙을 추가 | codex |
| 2026-03-26 | `VStack`/`HStack` ownership을 `rhythm` 레이어 기준으로 정리 | codex |
| 2026-03-15 | `surface/*`를 실제 재사용 대상에 포함하고 layout 대체 금지 원칙을 반영 | codex |
| 2026-03-25 | primitive 명칭을 display로 재정의하고 builder 문서명을 동기화 | codex |
| 2026-03-15 | primitive builder의 구 Surface 경로/컴포넌트 설명을 실제 `Page`, `Section`, `PageTitleBar` 기준으로 교체 | codex |
