# req-page-planner.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/req-page-planner.toml

## 역할

Page planner agent의 필수 기획 항목을 최신 페이지 구조 패턴에 맞춰 정의합니다.
페이지 설계 시 `Page`, `Section`, `PageTitleBar` 구조와 `PageSurface`, `SectionSurface` 표현 레이어의 배치 위치를 함께 기록하도록 강제합니다.

## 운영 규칙

- 페이지 기획은 서버 `page.tsx`, 클라이언트 `_client.tsx`, `_prefetch.ts` 구성과 함께 `Page + PageTitleBar` 구조와 `PageSurface`, `SectionSurface` 사용 여부를 포함해야 합니다.
- 페이지 헤딩/액션은 `PageTitleBar`를 기준으로 설계하고 인라인 반복 마크업을 허용하지 않습니다.
- Surface는 구조 대체가 아니라 표현 레이어라는 점을 기획서에 명시합니다.
- Surface를 생략하는 경우에는 page가 flat 배경을 의도한 이유를 기록해야 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | `req-surface-planner` 협업을 위해 Surface owner와 flat 예외 근거 기록 규칙을 추가 | codex |
| 2026-03-15 | Page/Section 구조와 Surface 표현 레이어를 함께 기록하는 기준으로 수정 | codex |
| 2026-03-15 | page planner의 필수 기획 항목을 `Page`, `Section`, `PageTitleBar` 기준으로 최신화 | codex |
