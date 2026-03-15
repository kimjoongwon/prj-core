# fe-page-builder.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/fe-page-builder.toml

## 역할

페이지 빌더 role이 CSR/SSR 판별과 함께 `Surface / Elevation` 결정을 실제 `page.tsx`, `_client.tsx` 코드로 구현하는 규칙을 정의합니다.

## 운영 규칙

- `page.spec.md`의 `Surface / Elevation` 섹션을 입력 계약으로 읽고 구현합니다.
- `PageSurface` owner는 항상 `page.tsx` 또는 `_client.tsx`이며, `layout.tsx`가 페이지 고유 Surface를 소유하면 실패입니다.
- `Layout`, `Page`, `Section`, `MetaDataGrid` 슬롯은 구조만 제공하므로 background/elevation을 자동 생성한다고 가정하면 안 됩니다.
- 검색/필터/DataGrid/폼/카드 등 시각 블록은 spec에 기록된 `SectionSurface`와 `padding` 정책을 그대로 반영합니다.
- flat 예외는 spec에 근거가 있을 때만 허용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | `Surface / Elevation` 입력 계약과 Page-owned Surface 구현 규칙을 추가 | codex |
