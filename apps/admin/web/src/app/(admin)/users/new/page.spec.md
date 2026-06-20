# 이용자 등록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/users/new`

## 사용자 시나리오

1. 관리자가 이용자 등록 화면에 진입합니다.
2. 현재 구현은 TODO 상태이며, 목록 복귀 버튼과 placeholder 등록 패널만 렌더링됩니다.
3. 추후 실제 입력 본문은 `form`의 `UserFormWidget`을 소비하는 구조로 확장됩니다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/users/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/users/new/page.tsx` |
| page가 소유하지 않는 skeleton | `Page` |

- `page.tsx`는 page-local 목록 복귀 버튼과 placeholder 등록 콘텐츠만 렌더링합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `form`
- reusable target: `form`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
- 최종 입력 본문은 `form/UserFormWidget`과 `feature/AiForm` 조합을 사용합니다.

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 상단 액션 | `Button` | `/users` 목록 복귀 |
| 등록 본문 | placeholder panel | TODO 상태 안내 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 추후 구현 | `useCreateUser()` | 이용자 등록 예정 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickBackButton` | `/users` 이동 |

## 구현 체크리스트

- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] route skeleton은 상위 `users/layout.tsx`가 소유
- [x] `Rendering Decision`에 `form` 재사용 타깃 명시
- [x] `_client.tsx` 없음
- [x] `_prefetch.ts` 없음