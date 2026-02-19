# 예약 상세 페이지 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: page
> 경로: /reservations/:reservationId

## 사용자 시나리오

1. 목록에서 예약 클릭
2. 상세 페이지 진입
3. 예약 상세 정보 확인
4. 상태 변경(확정/취소) 또는 정보 수정

## 레이아웃 구성

| 영역 | 컴포넌트 | 기획서 |
|------|----------|--------|
| Header | ReservationDetailHeader | `./_components/ReservationDetailHeader.spec.md` |
| Main | ReservationInfoCard | `./_components/ReservationInfoCard.spec.md` |
| Actions | ReservationActions | `./_components/ReservationActions.spec.md` |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| loading | 초기 로딩 | Skeleton |
| notFound | 예약 없음 | NotFound |
| error | API 실패 | ErrorAlert |
| success | 정상 | DetailCard |

## API 호출

| 시점 | API | 캐싱 | 기획서 |
|------|-----|------|--------|
| 진입 | GET /api/v1/reservations/:id | 1분 | `apps/server/src/reservation/controllers/reservation.controller.spec.md` |
| 상태변경 | PATCH /api/v1/reservations/:id/status | - | 동일 |
| 수정 | PUT /api/v1/reservations/:id | - | 동일 |
| 취소 | DELETE /api/v1/reservations/:id | - | 동일 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickEdit | 수정 모드 전환 |
| onClickConfirm | 예약 확정 처리 |
| onClickCancel | 예약 취소 확인 모달 |
| onClickBack | /reservations 이동 |
| onSubmit | 수정 저장 |

## 구현 체크리스트

- [ ] page.tsx (서버 컴포넌트)
- [ ] _client.tsx (클라이언트 컴포넌트)
- [ ] _prefetch.ts (데이터 프리페치)
- [ ] hooks/useHandlers.ts

## 상위 기획서

- `../_domain/domain.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 | orch-requirement |
