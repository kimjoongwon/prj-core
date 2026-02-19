# Reservation Controller 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: controller
> 위치: apps/server/src/reservation/controllers/reservation.controller.ts

## 역할

예약 관련 API 엔드포인트 제공

## 베이스 경로

`/api/v1/reservations`

## 엔드포인트

| Method | 경로 | DTO | 반환값 | 설명 |
|--------|------|-----|--------|------|
| GET | / | GetReservationsDto | Reservation[] | 목록 조회 |
| GET | /:id | - | Reservation | 상세 조회 |
| PUT | /:id | UpdateReservationDto | Reservation | 수정 |
| PATCH | /:id/status | UpdateReservationStatusDto | Reservation | 상태 변경 |
| DELETE | /:id | - | void | 취소 |

## 인증/인가

| 엔드포인트 | 인증 필요 | 권한 |
|------------|----------|------|
| GET / | O | RESERVATION_READ |
| GET /:id | O | RESERVATION_READ |
| PUT /:id | O | RESERVATION_UPDATE |
| PATCH /:id/status | O | RESERVATION_UPDATE |
| DELETE /:id | O | RESERVATION_DELETE |

## 요청/응답 예시

### 목록 조회

```http
GET /api/v1/reservations?page=1&limit=20&status=CONFIRMED&date=2026-02-18
Authorization: Bearer <token>
X-Space-ID: <spaceId>
```

### 응답

```json
{
  "httpStatus": 200,
  "message": "예약 목록 조회 성공",
  "data": [
    {
      "id": "uuid",
      "status": "CONFIRMED",
      "reservedAt": "2026-02-18T10:00:00Z",
      "partySize": 4,
      "user": { "name": "홍길동", "phone": "010-1234-5678" }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### 상태 변경

```http
PATCH /api/v1/reservations/:id/status
Authorization: Bearer <token>
X-Space-ID: <spaceId>

{
  "status": "CANCELLED",
  "cancelReason": "고객 요청"
}
```

## 상위 기획서

- `apps/admin/app/(admin)/reservations/_domain/domain.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 | orch-requirement |
