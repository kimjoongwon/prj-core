# 역할 그룹 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/roles/groups`

## 사용자 시나리오

1. 관리자가 역할 그룹 목록과 라벨을 확인합니다.
2. "그룹 추가" 버튼으로 등록 화면으로 이동합니다.
3. 상세 버튼으로 각 그룹 상세 화면으로 이동합니다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/roles/groups/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/roles/groups/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 page-local `PageTitleBar`와 `Surface` 안의 그룹 테이블만 렌더링합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `master`
- reusable target: `master/table`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `PageTitleBar` + 그룹 추가 버튼 | 진입 헤더 |
| 목록 영역 | `Surface` + custom table | 그룹명, 라벨, 생성일, 상세 이동 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetGroups({ type: "Role" })` | 역할 그룹 목록 조회 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| 그룹 추가 버튼 클릭 | `/roles/groups/new` 이동 |
| 상세 버튼 클릭 | `/roles/groups/[groupId]` 이동 |

## 구현 체크리스트

- [x] `layout.tsx`가 route skeleton 소유
- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] named slot 없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-31 | 목록 조회를 `useGetGroups({ type: "Role" })` 기반 Orval 훅 사용으로 갱신 | codex |
| 2026-03-29 | 구현이 테이블 중심으로 유지되는 현재 구조에 맞춰 reusable target을 `master/table`로 보정 | codex |
| 2026-03-22 | 목록 wrapper를 범용 `Surface` 기준으로 문서화 | codex |
| 2026-03-21 | 역할 그룹 목록 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |
| 2026-03-30 | route가 query/mutation/navigation/local state를 소유하고 pure page props를 주입하는 구조로 정리 | codex |
