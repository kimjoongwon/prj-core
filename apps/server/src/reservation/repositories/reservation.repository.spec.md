# Reservation Repository 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: repository
> 위치: apps/server/src/reservation/repositories/reservation.repository.ts

## 역할

예약 엔티티의 데이터 접근 계층

## 담당 엔티티

Reservation

## Prisma 모델

```prisma
model Reservation {
  id           String   @id @default(uuid())
  status       ReservationStatus @default(PENDING)
  reservedAt   DateTime
  partySize    Int
  notes        String?
  cancelReason String?
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  spaceId      String
  space        Space    @relation(fields: [spaceId], references: [id])
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  @@index([spaceId, status])
  @@index([spaceId, reservedAt])
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  CANCELLED
}
```

## 공개 메서드

| 메서드 | Prisma 메서드 | 반환값 | 설명 |
|--------|--------------|--------|------|
| findMany | findMany | Reservation[] | 목록 조회 (페이지네이션) |
| findById | findUnique | Reservation \| null | 단일 조회 |
| update | update | Reservation | 수정 |
| delete | delete | void | 취소 (soft delete 고려) |
| count | count | number | 전체 개수 |

## 쿼리 최적화

| 메서드 | 최적화 방식 |
|--------|------------|
| findMany | user, space 관계 최소 include |
| findById | 전체 관계 포함 |

## 트랜잭션

| 메서드 | 트랜잭션 필요 | 이유 |
|--------|--------------|------|
| cancel | O | 상태 변경 + 로그 기록 |

## 구현 체크리스트

- [ ] reservation.repository.ts
- [ ] 인터페이스 정의
- [ ] 단위 테스트

## 상위 기획서

- `apps/server/src/reservation/reservation.service.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 | orch-requirement |
