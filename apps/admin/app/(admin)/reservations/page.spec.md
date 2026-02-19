# 예약 목록 페이지 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: page
> 경로: /reservations

## 사용자 시나리오

1. 관리자가 예약 메뉴 클릭
2. 예약 목록 페이지 진입
3. 필터(상태/날짜) 및 검색으로 원하는 예약 찾기
4. 특정 예약 클릭 → 상세 페이지 이동

## 레이아웃 구성

| 영역 | 컴포넌트 | 기획서 |
|------|----------|--------|
| Header | ReservationListHeader | `./_components/ReservationListHeader.spec.md` |
| Filter | ReservationFilter | `./_components/ReservationFilter.spec.md` |
| Main | ReservationDataTable | `./_components/ReservationDataTable.spec.md` |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| loading | 초기 로딩 | Skeleton |
| empty | 데이터 없음 | EmptyState |
| error | API 실패 | ErrorAlert |
| success | 정상 | DataGrid |

## API 호출

| 시점 | API | 캐싱 | 기획서 |
|------|-----|------|--------|
| 진입 | GET /api/v1/reservations | 1분 | `apps/server/src/reservation/controllers/reservation.controller.spec.md` |
| 검색 | GET /api/v1/reservations?search= | X | 동일 |
| 필터 | GET /api/v1/reservations?status= | X | 동일 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickReservation | /reservations/:reservationId 이동 |
| onSearch | 검색어로 목록 갱신 |
| onFilter | 필터 조건으로 목록 갱신 |
| onRefresh | 목록 새로고침 |

## 구현 체크리스트

- [ ] page.tsx (서버 컴포넌트)
- [ ] _client.tsx (클라이언트 컴포넌트)
- [ ] _prefetch.ts (데이터 프리페치)
- [ ] hooks/useHandlers.ts

## 상위 기획서

- `./_domain/domain.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 | orch-requirement |
