# ReservationStore 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: store
> 위치: packages/fe-store/src/stores/reservationStore.ts

## 역할

예약 상태 관리

## 상태 (Observable)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| reservations | Reservation[] | [] | 목록 데이터 |
| selectedId | string \| null | null | 선택된 예약 ID |
| filters | ReservationFilters | {} | 필터 상태 |
| loading | boolean | false | 로딩 상태 |
| error | string \| null | null | 에러 메시지 |

## 계산된 값 (Computed)

| 속성 | 타입 | 계산 로직 |
|------|------|----------|
| selectedReservation | Reservation \| undefined | reservations.find(r => r.id === selectedId) |
| filteredCount | number | 필터링된 항목 수 |
| isEmpty | boolean | reservations.length === 0 |

## 액션 (Action)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| setSelectedId | id: string | 선택 상태 변경 |
| setFilters | filters: Partial<ReservationFilters> | 필터 변경 |
| clearSelection | - | 선택 해제 |
| reset | - | 초기화 |

## 비동기 액션 (Flow)

| 메서드 | 파라미터 | API 호출 | 성공 시 동작 |
|--------|----------|----------|--------------|
| fetchAll | params? | GET /api/v1/reservations | reservations 설정 |
| fetchById | id | GET /api/v1/reservations/:id | selectedId 설정 |
| updateStatus | id, status, reason? | PATCH /api/v1/reservations/:id/status | 목록/상세 갱신 |
| update | id, data | PUT /api/v1/reservations/:id | 상세 갱신 |
| cancel | id, reason | DELETE /api/v1/reservations/:id | 목록에서 제거 |

## 의존 Store

| Store | 사용 방식 |
|-------|----------|
| RootStore | parent |

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| reservationStore | ReservationStore |

## 구현 체크리스트

- [ ] reservationStore.ts
- [ ] RootStore에 등록
- [ ] 타입 정의

## 상위 기획서

- `apps/admin/app/(admin)/reservations/_domain/domain.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 | orch-requirement |
