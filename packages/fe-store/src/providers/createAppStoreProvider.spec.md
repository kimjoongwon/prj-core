# createAppStoreProvider ui 기획서

> 생성일: 2026-03-03
> 타입: ui
> 위치: packages/fe-store/src/providers/createAppStoreProvider.tsx

## 역할

이 파일은 ui 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AppStoreConfig | 공개 계약 요소 |
| AppStoreProviderResult | 공개 계약 요소 |
| createAppStoreProvider | 공개 계약 요소 |

## 동작 메모

- `createRootStore()`는 순수한 초기값만 가진 Store 인스턴스를 생성합니다.
- `StoreInitializer`는 첫 클라이언트 렌더 이후 `persistStore.hydrateFromStorage()`를 호출해 브라우저 저장소를 동기화합니다.
- 이 구조로 SSR HTML과 첫 클라이언트 렌더 트리를 동일하게 유지한 뒤, hydration 이후에만 persisted Space 상태를 반영합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | PersistStore hydrate를 constructor에서 제거하고 `StoreInitializer` effect에서 수행하도록 계약 보강 | codex |
| 2026-03-14 | `StoreInitializer`가 매 render 새 `can` 함수를 effect dependency로 물어 MobX 반응 루프를 만들지 않도록 `abilityStore` 직접 참조 방식으로 안정화 | codex |
| 2026-03-13 | `setApiPersistStore` 의존을 root barrel에서 `@cocrepo/api/core/client` subpath로 전환 | codex |
| 2026-03-06 | 규칙 위반 정리: useMemo/useCallback/useIsMounted 제거 및 observer/이벤트 네이밍 규칙 반영 | codex |
| 2026-03-06 | AppStoreConfig/AppStoreProviderResult 로컬 선언을 제거하고 @cocrepo/type 공용 계약 import + type re-export로 전환 | codex |
| 2026-03-06 | @cocrepo/hook 의존 제거, RootStore에 AbilityStore 주입, 내부 useAbility(@cocrepo/store) 기반 권한 체커 연결로 전환 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
