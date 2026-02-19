# useStore 훅 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: store (React Hook)
> 위치: packages/fe-store/src/stores/useStore.ts

## 역할

RootStore에 접근하기 위한 React Context 및 Hook 모음. `RootStoreContext`를 통해 RootStore를 컴포넌트 트리에 제공하고, 각 하위 Store에 대한 selector hook을 제공합니다. `"use client"` 선언이 포함되어 있습니다.

## 제공 요소

### RootStoreContext

| 항목 | 설명 |
|------|------|
| 타입 | `React.Context<RootStore \| null>` |
| 역할 | RootStore를 React Context로 전달하는 Provider |
| 초기값 | `null` |

### useStore

| 항목 | 설명 |
|------|------|
| 역할 | RootStore를 가져오는 기본 Hook |
| 반환 | `RootStore` |
| 에러 | Context가 없으면 `"useStore must be used within a RootStoreProvider"` 에러 |

### useRootStore

| 항목 | 설명 |
|------|------|
| 역할 | `useStore`의 별칭 (alias) |
| 반환 | `RootStore` |

### useNavigationStore

| 항목 | 설명 |
|------|------|
| 역할 | RootStore에서 `navigationStore`만 선택하여 반환하는 selector hook |
| 반환 | `NavigationStore` |
| 에러 | navigationStore가 없으면 `"navigationStore가 초기화되지 않았습니다."` 에러 |

### usePersistStore

| 항목 | 설명 |
|------|------|
| 역할 | RootStore에서 `persistStore`만 선택하여 반환하는 selector hook |
| 반환 | `PersistStore` |
| 에러 | persistStore가 없으면 `"persistStore가 초기화되지 않았습니다."` 에러 |

### useAuthStore

| 항목 | 설명 |
|------|------|
| 역할 | RootStore에서 `authStore`만 선택하여 반환하는 selector hook |
| 반환 | `AuthStore` |
| 에러 | authStore가 없으면 `"authStore가 초기화되지 않았습니다."` 에러 |

## 의존 Store

| Store | 사용 방식 |
|-------|----------|
| RootStore | Context에서 가져오는 최상위 Store |

## 사용 패턴

```typescript
// Provider 설정 (앱 레벨)
<RootStoreContext.Provider value={rootStore}>
  <App />
</RootStoreContext.Provider>

// 컴포넌트에서 사용
const store = useStore();           // RootStore 전체
const navStore = useNavigationStore(); // NavigationStore만
const persistStore = usePersistStore(); // PersistStore만
const authStore = useAuthStore();      // AuthStore만
```

## 비고

- `"use client"` 선언이 있어 클라이언트 컴포넌트에서만 사용 가능
- 각 selector hook은 null 체크 후 에러를 던지므로 반드시 해당 Store가 RootStore에 주입된 상태에서 사용해야 함
- 추가 selector hook이 필요하면 동일한 패턴으로 확장 가능

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
