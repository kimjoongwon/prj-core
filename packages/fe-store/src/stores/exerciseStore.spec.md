# ExerciseStore 기획서

> 생성일: 2026-02-19
> 타입: store
> 위치: packages/fe-store/src/stores/exerciseStore.ts

## 역할

운동 종목(Exercise) 목록/상세 페이지의 클라이언트 UI 상태를 관리하는 MobX Store입니다. 검색어, 페이지네이션, Space 범위 필터 등 UI 상태를 담당합니다. 실제 데이터 fetching은 Orval 생성 React Query 훅이 담당하며, Store는 필터/페이지 상태만 관리합니다.

## 상태 (Observable)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| search | `string` | `""` | 운동명 검색어 |
| page | `number` | `1` | 현재 페이지 번호 |
| take | `number` | `20` | 페이지당 항목 수 |
| spaceScope | `"CURRENT" \| "INCLUDE_ANCESTORS"` | `"INCLUDE_ANCESTORS"` | Space 범위 필터 (기본: 상위 Space 포함) |

## 계산된 값 (Computed)

| 속성 | 타입 | 계산 로직 |
|------|------|----------|
| skip | `number` | `(page - 1) * take` - 목록 offset |
| listParams | `object` | `{ take, skip, search, spaceScope }` - `useGetExercises` 훅에 전달 |

## 액션 (Action)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| `setSearch` | `search: string` | 검색어 변경 + 페이지 1로 리셋 |
| `setPage` | `page: number` | 페이지 변경 |
| `setSpaceScope` | `scope: "CURRENT" \| "INCLUDE_ANCESTORS"` | Space 범위 필터 변경 + 페이지 1로 리셋 |
| `reset` | 없음 | 모든 상태 초기값으로 리셋 |

## 비동기 액션 (Flow)

없음 (데이터 fetching은 Orval 생성 React Query 훅 사용)

## 의존 Store

없음 (독립적)

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| exerciseStore | ExerciseStore |

## 사용 예시

```typescript
// 운동 목록 페이지에서
const { exerciseStore } = useStore();

// 검색어 변경 (debounce 처리는 컴포넌트에서)
exerciseStore.setSearch("스쿼트");

// Space 범위 필터 변경
exerciseStore.setSpaceScope("CURRENT");

// 페이지 변경
exerciseStore.setPage(2);

// React Query 훅에 전달
const { data } = useGetExercises(exerciseStore.listParams);

// 페이지 이탈 시 리셋
useEffect(() => {
  return () => exerciseStore.reset();
}, []);
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | req-store-planner |
