# ReservationDetail Feature 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/ReservationDetail/

## 역할

단일 예약 상세 정보를 조회하고 상태 변경/수정하는 비즈니스 로직 담당

## 디자인 목업

> 컴포넌트의 시각적 구조와 상태별 UI를 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│ ReservationDetail                                               │
│                                                                 │
│  [← 목록으로]                                                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ReservationInfoCard                                      │   │
│  │                                                          │   │
│  │  예약번호: #1001                  상태: [확정 ●]         │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │  예약자:   홍길동                                        │   │
│  │  연락처:   010-1234-5678                                 │   │
│  │  날짜:     2026-02-20                                    │   │
│  │  시간:     14:00 ~ 15:00                                 │   │
│  │  장소:     회의실 A                                      │   │
│  │  메모:     중요 미팅                                     │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ReservationActions                                       │   │
│  │                                                          │   │
│  │              [취소하기]   [수정]   [✓ 확정]             │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| 기본 | 예약 상세 정상 표시 | InfoCard + Actions 렌더링 |
| 로딩 | 데이터 로드 중 | 카드 전체 스켈레톤으로 대체 |
| 확정됨 | 상태가 확정인 경우 | 상태 배지 green, 취소 버튼만 활성 |
| 대기중 | 상태가 대기중인 경우 | 상태 배지 yellow, 확정/취소 버튼 모두 활성 |
| 취소됨 | 상태가 취소인 경우 | 상태 배지 red, 액션 버튼 비활성 |
| 수정 모드 | 수정 버튼 클릭 시 | onEdit 콜백 → 수정 페이지 이동 |
| 취소 확인 | 취소 버튼 클릭 시 | onCancel 콜백 → 확인 모달 표시 |

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
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
