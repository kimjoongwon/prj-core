# RootStore 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: store
> 위치: packages/fe-store/src/stores/rootStore.ts

## 역할

모든 하위 Store를 관리하는 최상위 MobX Store 컨테이너. 순수 컨테이너로서 내부에서 Store를 생성하지 않으며, 각 앱에서 필요한 Store를 인스턴스화하여 외부에서 주입하는 방식으로 동작합니다.

## 상태 (Observable)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| name | `string` | `"PROTOTYPE"` | Store 식별자 |
| navigator | `Navigator \| undefined` | `undefined` | 페이지 이동 담당 |
| navigationStore | `NavigationStore \| undefined` | `undefined` | 메뉴 및 네비게이션 관리 |
| tokenStore | `TokenStore \| undefined` | `undefined` | 토큰 관리 |
| authStore | `AuthStore \| undefined` | `undefined` | 인증 상태 관리 |
| cookieStore | `CookieStore \| undefined` | `undefined` | 쿠키 관리 |
| persistStore | `PersistStore \| undefined` | `undefined` | 영속 저장 관리 |
| abilityStore | `AbilityStore \| undefined` | `undefined` | CASL 권한 관리 |
| fabStore | `FABStore \| undefined` | `undefined` | FAB 상태 관리 (v7.0) |
| bottomTabStore | `BottomTabStore \| undefined` | `undefined` | BottomTab 상태 관리 (v7.0) |

## 계산된 값 (Computed)

없음

## 액션 (Action)

없음 (외부에서 속성 직접 할당)

## 비동기 액션 (Flow)

없음

## 의존 Store

없음 (다른 Store들이 RootStore에 의존)

## Store Tree 구조

```
RootStore
├── navigator (Navigator) - 페이지 이동 담당
├── navigationStore (NavigationStore) - 메뉴 및 네비게이션 관리
├── tokenStore (TokenStore) - 토큰 관리
├── cookieStore (CookieStore) - 쿠키 관리
├── authStore (AuthStore) - 인증 상태 관리
├── persistStore (PersistStore) - 영속 저장 관리
├── abilityStore (AbilityStore) - CASL 권한 관리
├── fabStore (FABStore) - v7.0: FAB 상태 관리
└── bottomTabStore (BottomTabStore) - v7.0: BottomTab 상태 관리
```

## 앱별 주입 패턴

```typescript
// apps/admin/src/stores/
const rootStore = new RootStore();
rootStore.navigator = new Navigator({ router });
rootStore.tokenStore = new TokenStore(rootStore);
rootStore.cookieStore = new CookieStore();
rootStore.authStore = new AuthStore(rootStore);
rootStore.persistStore = new PersistStore({ storageKey: "admin-persist" });
rootStore.abilityStore = new AbilityStore(rootStore);
rootStore.navigationStore = new NavigationStore(MENU_CONFIG, {
  navigator: rootStore.navigator,
});

// v7.0: 모바일 지원
rootStore.fabStore = new FABStore(FAB_CONFIG);
rootStore.bottomTabStore = new BottomTabStore(BOTTOM_TAB_CONFIG, {
  navigationStore: rootStore.navigationStore,
});
```

## 비고

- `makeAutoObservable(this)`로 모든 속성이 자동 observable
- 모든 하위 Store는 optional (`undefined` 가능)이므로 앱별로 필요한 Store만 주입
- React Context를 통해 `RootStoreContext`로 제공 (`useStore.ts` 참조)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
