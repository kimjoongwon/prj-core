# GroundStore 기획서

> 생성일: 2026-02-19
> 타입: store
> 위치: packages/fe-store/src/stores/groundStore.ts

## 역할

시설(Ground) 목록 페이지의 클라이언트 상태를 관리하는 MobX Store입니다. 검색 필터, 정렬 상태 등 UI 상태를 담당합니다. 실제 데이터 fetching은 Orval 생성 React Query 훅이 담당하며, Store는 필터/정렬 상태만 관리합니다.

## 상태 (Observable)

### 시설 목록 상태

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| search | `string` | `""` | 시설명 / 사업자등록번호 검색어 |
| page | `number` | `1` | 현재 페이지 번호 |
| take | `number` | `20` | 페이지당 항목 수 |

## 계산된 값 (Computed)

| 속성 | 타입 | 계산 로직 |
|------|------|----------|
| skip | `number` | `(page - 1) * take` - 목록 offset |
| groundListParams | `object` | `{ take, skip, search }` - useGetGrounds 훅에 전달 |

## 액션 (Action)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| `setSearch` | `search: string` | 검색어 변경 + 페이지 1로 리셋 |
| `setPage` | `page: number` | 페이지 변경 |
| `reset` | 없음 | 모든 상태 초기값으로 리셋 |

## 비동기 액션 (Flow)

없음 (데이터 fetching은 Orval 생성 React Query 훅 사용)

## 의존 Store

없음 (독립적)

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| groundStore | GroundStore |

## 사용 예시

```typescript
// 시설 목록 페이지에서
const { groundStore } = useStore();

// 검색어 변경
groundStore.setSearch("강남");

// 페이지 변경
groundStore.setPage(2);

// React Query 훅에 전달
const { data } = useGetGrounds(groundStore.groundListParams);
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | req-store-planner |
