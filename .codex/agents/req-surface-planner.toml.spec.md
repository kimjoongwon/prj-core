# req-surface-planner.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/req-surface-planner.toml

## 역할

Surface planner agent가 페이지/레이아웃/기능 사이의 시각적 표면 소유권을 확정하도록 기준을 정의합니다.
구조 컴포넌트와 표현 컴포넌트를 혼동하지 않도록 `Page owns Surface` 원칙을 문서화합니다.

## 운영 규칙

- 페이지 고유 title/description/actions와 `PageSurface`는 `page.tsx` 또는 `_client.tsx`에서 소유합니다.
- `layout.tsx`는 공유 네비게이션과 구조만 담당하며 페이지 고유 Surface를 소유하지 않습니다.
- 검색/필터/DataGrid/폼과 같이 시각적으로 묶이는 블록은 `SectionSurface` 또는 명시적 예외 근거가 필요합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | Surface ownership과 elevation 배치를 전담하는 planner role 신규 생성 | codex |
