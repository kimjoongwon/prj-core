# Reservation Service 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: service
> 위치: apps/server/src/reservation/reservation.service.ts

## 역할

예약 비즈니스 로직 처리

## 담당 도메인

Reservation

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Repository | ReservationRepository | 데이터 접근 |
| Service | UserService | 사용자 정보 조회 |

## 공개 메서드

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| findAll | QueryDto | Reservation[] | 목록 조회 |
| findById | id: string | Reservation | 상세 조회 |
| update | id, UpdateDto | Reservation | 수정 |
| updateStatus | id, StatusDto | Reservation | 상태 변경 |
| cancel | id, CancelDto | void | 취소 |

## 비즈니스 규칙

### 상태 변경 규칙

- PENDING → CONFIRMED: 언제든 가능
- PENDING → CANCELLED: 언제든 가능
- CONFIRMED → CANCELLED: 취소 사유 필수
- CANCELLED → (변경 불가): 취소된 예약은 복구 불가

### 수정 규칙

- 예약 시간은 현재 이후만 가능
- 인원수는 1 이상이어야 함
- 확정(CONFIRMED) 상태만 수정 가능

## 에러 처리

| 상황 | 에러 코드 | 메시지 |
|------|----------|--------|
| Not Found | 404 | 예약을 찾을 수 없습니다 |
| Invalid Status | 400 | 변경할 수 없는 예약 상태입니다 |
| Past Reservation | 400 | 과거 예약은 수정할 수 없습니다 |
| Forbidden | 403 | 권한이 없습니다 |

## 권한 체크

| 메서드 | 필요 권한 | 체크 방식 |
|--------|----------|----------|
| findAll | RESERVATION_READ | AbilityChecker |
| findById | RESERVATION_READ | AbilityChecker |
| update | RESERVATION_UPDATE | AbilityChecker |
| updateStatus | RESERVATION_UPDATE | AbilityChecker |
| cancel | RESERVATION_DELETE | AbilityChecker |

## 구현 체크리스트

- [ ] reservation.service.ts
- [ ] 단위 테스트
- [ ] 통합 테스트

## 상위 기획서

- `apps/admin/app/(admin)/reservations/_domain/domain.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 | orch-requirement |
