# 역할 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/roles`

## 사용자 시나리오

1. 관리자가 시스템 역할과 커스텀 역할 목록을 조회합니다.
2. 시스템 역할 수정/삭제 불가 안내를 먼저 확인합니다.
3. 상세 버튼으로 역할 상세 화면에 진입하거나, "역할 추가" 버튼으로 등록 화면으로 이동합니다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/roles/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/roles/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 page-local `PageTitleBar`, 경고 배너, `Surface` 안의 역할 테이블만 렌더링합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `master`
- reusable target: `master/list`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
- `Suspense` fallback은 목록 콘텐츠 로딩 상태만 처리합니다.

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `PageTitleBar` + 역할 추가 버튼 | 역할 목록 안내 |
| 안내 배너 | warning block | 시스템 역할 제약 안내 |
| 목록 영역 | `Surface` + custom table | 역할 메타데이터와 상세 이동 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetRolesSuspense()` | 역할 목록 조회 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| 역할 상세 버튼 클릭 | `/roles/[roleId]` 이동 |
| 역할 추가 버튼 클릭 | `/roles/new` 이동 |

## 구현 체크리스트

- [x] `layout.tsx`가 route skeleton 소유
- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] `_client.tsx` 제거
- [x] `_prefetch.ts` 없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | 목록 wrapper를 범용 `Surface` 기준으로 문서화 | codex |
| 2026-03-21 | 역할 목록 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |
