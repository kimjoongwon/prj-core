# 메시지 템플릿 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/templates`

## 사용자 시나리오

1. 관리자가 템플릿 목록을 검색하고 활성 상태를 확인합니다.
2. 템플릿 코드를 눌러 상세로 이동합니다.
3. 활성 스위치로 템플릿 상태를 토글합니다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/templates/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/templates/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 page-local `PageTitleBar`, `Surface` 안의 `MetaDataGrid`, 상태 토글만 렌더링합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `master`
- reusable target: `master/table`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `PageTitleBar` + 템플릿 등록 버튼 | 진입 헤더 |
| 목록 영역 | `Surface` + `MetaDataGrid` | 검색, 활성 필터, 상태 토글 포함 목록 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetTemplatesSuspense({ take, skip, search, isActive })` | 템플릿 목록 조회 |
| 상태 토글 | `useToggleTemplateStatus()` | 템플릿 활성 상태 변경 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickTemplateCode` | `/templates/[templateId]` 이동 |
| `onToggleTemplateStatusSwitch` | 상태 토글 후 query invalidation |

## 구현 체크리스트

- [x] `layout.tsx`가 route skeleton 소유
- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] `_client.tsx` 제거
- [x] `_prefetch.ts` 없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | 목록 콘텐츠 wrapper를 범용 `Surface` 기준으로 문서화 | codex |
| 2026-03-21 | 메시지 템플릿 목록을 `master/table` 재사용 타깃으로 분류하고 page role 계약을 추가 | codex |
| 2026-03-21 | 메시지 템플릿 목록 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |
