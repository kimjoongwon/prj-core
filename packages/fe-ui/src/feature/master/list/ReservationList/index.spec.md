# ReservationList Feature 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/feature/master/list/ReservationList/

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
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-02-18 | 초기 생성 | orch-requirement |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-06 | widget 경로를 widgets로 통합 | codex |
