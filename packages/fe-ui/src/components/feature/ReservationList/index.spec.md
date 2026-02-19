# ReservationList Feature 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/ReservationList/

## 역할

예약 목록 데이터를 조회하고 표시하는 비즈니스 로직 담당

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | ReservationStore | 예약 데이터 상태 |
| Widget | DataTable | 목록 UI |
| API | useGetReservations | 데이터 조회 |

## Props

```typescript
interface ReservationListProps {
  spaceId: string;
  initialPageSize?: number;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| ReservationStore | reservations | 읽기 (표시) |
| ReservationStore | loading | 읽기 (로딩 표시) |
| ReservationStore | filters | 읽기/쓰기 (필터 상태) |
| ReservationStore | fetchReservations | 호출 (데이터 로드) |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| onSelect | 행 클릭 | O (reservationId) |
| onRefresh | 새로고침 버튼 | X |
| onFilter | 필터 변경 | X |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 기획서 |
|----------|------|--------|
| ReservationFilter | widget | `../../widget/ReservationFilter/index.spec.md` |
| ReservationRow | widget | `../../widget/ReservationRow/index.spec.md` |
| DataTable | ui | `../../ui/DataTable/index.spec.md` |

## 구현 체크리스트

- [ ] index.tsx
- [ ] observer 적용
- [ ] Store 주입

## 상위 기획서

- `apps/admin/app/(admin)/reservations/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 | orch-requirement |
