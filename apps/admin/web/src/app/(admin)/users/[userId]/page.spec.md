# 이용자 상세 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/users/[userId]`

## 사용자 시나리오

1. 관리자가 이용자 목록에서 특정 이용자를 선택해 상세 정보를 확인합니다.
2. 현재 구현은 TODO 상태이며, 목록 복귀 버튼과 placeholder 본문만 렌더링됩니다.
3. 추후 상세 본문은 `feature/detail/view` 재사용 계층을 소비하는 구조로 확장됩니다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/users/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/users/[userId]/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 page-local 목록 복귀 버튼과 placeholder 상세 콘텐츠만 렌더링합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `detail`
- reusable target: `feature/detail/view`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
- 현재 구현은 placeholder이지만 최종 상세 본문 재사용 타깃은 `feature/detail/view`로 고정합니다.

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 상단 액션 | `Button` | `/users` 목록 복귀 |
| 상세 본문 | placeholder panel | TODO 상태 안내 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 추후 구현 | `useGetUserById()` | 이용자 상세 조회 예정 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickBackButton` | `/users` 이동 |

## 구현 체크리스트

- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] route skeleton은 상위 `users/layout.tsx`가 소유
- [x] `Rendering Decision`에 `detail/view` 재사용 타깃 명시
- [x] `_client.tsx` 없음
- [x] `_prefetch.ts` 없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | 이용자 상세를 `detail/view` 재사용 타깃으로 재정의하고 route-layout 계약 형식으로 재작성 | codex |
