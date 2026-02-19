# ReservationDetail Feature 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/ReservationDetail/

## 역할

단일 예약 상세 정보를 조회하고 상태 변경/수정하는 비즈니스 로직 담당

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | ReservationStore | 예약 데이터 상태 |
| Widget | DetailCard | 상세 UI |
| API | useGetReservation | 데이터 조회 |
| API | useUpdateReservation | 수정 |
| API | useUpdateReservationStatus | 상태 변경 |

## Props

```typescript
interface ReservationDetailProps {
  reservationId: string;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| ReservationStore | selectedReservation | 읽기 (표시) |
| ReservationStore | loading | 읽기 (로딩 표시) |
| ReservationStore | fetchById | 호출 (데이터 로드) |
| ReservationStore | updateStatus | 호출 (상태 변경) |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| onConfirm | 확정 버튼 | X (Store에서 처리) |
| onCancel | 취소 버튼 | O (확인 모달) |
| onEdit | 수정 버튼 | O (수정 모드) |
| onBack | 뒤로가기 | O (목록 이동) |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 기획서 |
|----------|------|--------|
| ReservationInfoCard | widget | `../../widget/ReservationInfoCard/index.spec.md` |
| ReservationActions | widget | `../../widget/ReservationActions/index.spec.md` |
| StatusBadge | ui | `../../ui/StatusBadge/index.spec.md` |

## 구현 체크리스트

- [ ] index.tsx
- [ ] observer 적용
- [ ] Store 주입

## 상위 기획서

- `apps/admin/app/(admin)/reservations/[reservationId]/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 | orch-requirement |
