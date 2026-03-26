# 공간 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/spaces`

## 사용자 시나리오

1. 관리자가 공간/시설 목록을 검색하고 기본 정보를 확인합니다.
2. 시설명을 눌러 `/spaces/[spaceId]/ground` 상세로 이동합니다.
3. "공간 등록" 버튼으로 등록 화면에 이동합니다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/spaces/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/spaces/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 page-local `PageTitleBar`와 `Surface` 안의 공간 목록 grid만 렌더링합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `master`
- reusable target: `master/table`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `PageTitleBar` + 공간 등록 버튼 | 진입 헤더 |
| 목록 영역 | `Surface` + `MetaDataGrid` | 시설명, 라벨, 사업자등록번호, 주소, 연락처 표시 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetSpacesSuspense()` | 공간 목록 조회 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickSpaceGroundName` | `/spaces/[spaceId]/ground` 이동 |

## 구현 체크리스트

- [x] `layout.tsx`가 route skeleton 소유
- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] `_client.tsx` 제거
- [x] `_prefetch.ts` 없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | 목록 콘텐츠 wrapper를 범용 `Surface` 기준으로 문서화 | codex |
| 2026-03-21 | 공간 목록을 `master/table` 재사용 타깃으로 분류하고 page role 계약을 추가 | codex |
| 2026-03-21 | 공간 목록 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |
