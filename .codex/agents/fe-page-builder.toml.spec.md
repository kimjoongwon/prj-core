# fe-page-builder.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/fe-page-builder.toml

## 역할

페이지 빌더 role을 route skeleton 소비자 기준으로 재정의합니다.
`layout.tsx`가 화면 뼈대를 소유하고, `fe-page-builder`는 `page.tsx`와 `@slot/**/page.tsx` 콘텐츠를 단일 CSR 기본값으로 구현합니다.

## 운영 규칙

- 기본 구현은 여전히 `page.tsx` 단일 CSR입니다.
- `fe-page-builder`는 작업 시작 전에 반드시 sibling `layout.spec.md`를 읽고 `Consumed Layout Contract`를 확인해야 합니다.
- named slot 콘텐츠 파일(`@slot/**/page.tsx`)도 같은 계약을 소비하며, `default.tsx`는 이 agent 범위가 아닙니다.
- route-level `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` 조합은 `page.tsx`에서 다시 만들지 않습니다.
- `_client.tsx`, `_prefetch.ts`, `HydrationBoundary` 기반 SSR/prefetch 패턴은 개발자 승인된 예외에서만 허용합니다.
- `page.spec.md`에는 반드시 `## Consumed Layout Contract`와 `## Rendering Decision` 섹션이 있어야 합니다.
- `Rendering Decision`에는 반드시 `page role`과 `reusable target`이 포함되어야 합니다.
- `MetaDataGrid` 기반 페이지는 `page role = master`, `reusable target = feature/master/table`로 분류합니다.
- Create/Edit 입력 화면은 `page role = form`, `reusable target = widget/form`으로 분류합니다.
- 읽기 전용 상세/inspector 화면은 `page role = detail`, `reusable target = feature/detail/view`으로 분류합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | `master/detail/form` 페이지 역할 분류와 `reusable target` 계약을 추가 | codex |
| 2026-03-21 | route layout ownership 기준에 맞게 page builder를 콘텐츠 전용으로 재정의 | codex |
| 2026-03-21 | named slot 콘텐츠(`@slot/**/page.tsx`) 지원 규칙을 추가 | codex |
