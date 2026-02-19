# TimelineStore 기획서

> 생성일: 2026-02-19
> 타입: store
> 위치: packages/fe-store/src/stores/timelineStore.ts

## 역할

타임라인(Timeline) 목록/상세 페이지의 클라이언트 상태를 관리하는 MobX Store입니다. 검색 필터, 페이지네이션 상태, 선택된 타임라인 ID 등 UI 상태를 담당합니다. 실제 데이터 fetching은 Orval 생성 React Query 훅이 담당하며, Store는 필터/페이지 상태만 관리합니다.

## 상태 (Observable)

### 타임라인 목록 상태

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| search | `string` | `""` | 타임라인 이름 검색어 |
| page | `number` | `1` | 현재 페이지 번호 |
| take | `number` | `10` | 페이지당 항목 수 |

### 세션 목록 상태 (타임라인 상세 내 세션 목록용)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| sessionSearch | `string` | `""` | 세션 이름 검색어 |
| sessionPage | `number` | `1` | 세션 목록 현재 페이지 |
| sessionTake | `number` | `10` | 세션 목록 페이지당 항목 수 |

## 계산된 값 (Computed)

| 속성 | 타입 | 계산 로직 |
|------|------|----------|
| skip | `number` | `(page - 1) * take` - 타임라인 목록 offset |
| sessionSkip | `number` | `(sessionPage - 1) * sessionTake` - 세션 목록 offset |
| timelineListParams | `object` | `{ take, skip, search }` - useGetTimelines 훅에 전달 |
| sessionListParams | `object` | `{ take, skip: sessionSkip, search: sessionSearch }` - useGetSessions 훅에 전달 |

## 액션 (Action)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| `setSearch` | `search: string` | 검색어 변경 + 페이지 1로 리셋 |
| `setPage` | `page: number` | 타임라인 목록 페이지 변경 |
| `setSessionSearch` | `search: string` | 세션 검색어 변경 + 세션 페이지 1로 리셋 |
| `setSessionPage` | `page: number` | 세션 목록 페이지 변경 |
| `reset` | 없음 | 모든 상태 초기값으로 리셋 |
| `resetSessionState` | 없음 | 세션 관련 상태만 초기값으로 리셋 |

## 비동기 액션 (Flow)

없음 (데이터 fetching은 Orval 생성 React Query 훅 사용)

## 의존 Store

없음 (독립적)

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| timelineStore | TimelineStore |

## 사용 예시

```typescript
// 타임라인 목록 페이지에서
const { timelineStore } = useStore();

// 검색어 변경
timelineStore.setSearch("가을 시즌");

// 페이지 변경
timelineStore.setPage(2);

// React Query 훅에 전달
const { data } = useGetTimelines(timelineStore.timelineListParams);

// 타임라인 상세에서 세션 검색
timelineStore.setSessionSearch("요가");
const { data: sessions } = useGetSessions({
  timelineId,
  ...timelineStore.sessionListParams
});
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | req-store-planner |
