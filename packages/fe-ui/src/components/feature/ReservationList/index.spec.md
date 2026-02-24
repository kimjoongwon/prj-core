# ReservationList Feature 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-24
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/ReservationList/

## 역할

예약 목록 데이터를 조회하고 표시하는 비즈니스 로직 담당

## 디자인 목업

> 컴포넌트의 시각적 구조와 상태별 UI를 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│ ReservationList                                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ReservationFilter                                        │   │
│  │  [상태 ▼]  [날짜 범위: ──────────]  [검색어 입력  🔍]  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ DataTable                                                │   │
│  │ ┌────────┬──────────┬────────────┬──────────┬────────┐  │   │
│  │ │ 예약번호│  예약자  │  날짜/시간  │   상태   │  액션  │  │   │
│  │ ├────────┼──────────┼────────────┼──────────┼────────┤  │   │
│  │ │ #1001  │ 홍길동   │ 02-20 14:00│ [확정]   │ [보기] │  │   │
│  │ ├────────┼──────────┼────────────┼──────────┼────────┤  │   │
│  │ │ #1002  │ 김철수   │ 02-21 10:00│ [대기중] │ [보기] │  │   │
│  │ ├────────┼──────────┼────────────┼──────────┼────────┤  │   │
│  │ │ #1003  │ 이영희   │ 02-21 15:30│ [취소]   │ [보기] │  │   │
│  │ └────────┴──────────┴────────────┴──────────┴────────┘  │   │
│  │                                                          │   │
│  │                  ← 1  2  3  4  5 →                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                              [↺ 새로고침]      │
└─────────────────────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| 기본 | 목록 정상 표시 | 테이블에 예약 행 렌더링 |
| 로딩 | 데이터 로드 중 | 테이블 전체 스켈레톤 행으로 대체 |
| 빈 목록 | 조회 결과 없음 | "예약 내역이 없습니다" 빈 상태 메시지 |
| 필터 적용 | 조건 필터링 중 | 필터 칩 표시, 테이블 결과 갱신 |
| 행 선택 | 행 클릭 시 | 해당 행 하이라이트, onSelect 콜백 발생 |

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
  reservations?: Reservation[];
  isLoading?: boolean;
  totalCount?: number;
  onSelect?: (reservationId: string) => void;
  onRefresh?: () => void;
  onFilterChange?: (filters: ReservationFilters) => void;
  onPageChange?: (page: number) => void;
  className?: string;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| ReservationStore | filters | 읽기/쓰기 (필터 상태) |
| ReservationStore | selectedId | 읽기/쓰기 (선택 상태) |
| ReservationStore | setFilters | 호출 (필터 설정) |
| ReservationStore | setSelectedId | 호출 (선택 설정) |
| ReservationStore | clearSelection | 호출 (선택 해제) |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| onSelect | 행 클릭 | O (reservationId) |
| onRefresh | 새로고침 버튼 | O |
| onFilterChange | 필터 변경 | O |
| onPageChange | 페이지 변경 | O |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 기획서 |
|----------|------|--------|
| Input | inputs | `../../inputs/Input/index.spec.md` |
| Select | inputs | `../../inputs/Select/index.spec.md` |
| Button | ui | `../../ui/Button/index.spec.md` |
| Chip | ui | HeroUI |
| VStack | ui | `../../ui/surfaces/VStack/index.spec.md` |
| HStack | ui | `../../ui/surfaces/HStack/index.spec.md` |

## 구현 체크리스트

- [x] ReservationList.tsx
- [x] observer 적용
- [x] Store 주입 (useReservationStore)
- [x] Props 타입 정의
- [x] index.ts export

## 상위 기획서

- `apps/admin/app/(admin)/reservations/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 | orch-requirement |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-02-24 | 구현 완료, 체크리스트 업데이트 | fe-feature-builder |
