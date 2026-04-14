# createAppStoreProvider.test 테스트 기획서

> 생성일: 2026-04-14
> 타입: test
> 위치: packages/fe-store/src/providers/__tests__/createAppStoreProvider.test.tsx

## 역할

`createAppStoreProvider`가 생성하는 `PersistStore`가 Core API와 IDP API 인터셉터에 동시에 주입되어 Space header 기준이 분기되지 않도록 회귀를 방지합니다.

## 검증 시나리오

| 시나리오 | 설명 |
|------|------|
| shared PersistStore wiring | provider render 시 `setApiPersistStore`와 `setIdpPersistStore`가 동일한 store 인스턴스로 한 번씩 호출되어야 한다 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | admin Header Space 선택 후 reload 시 IDP current-space 재조회가 기본 Space로 되돌아가지 않도록 provider wiring 회귀 테스트 신규 추가 | codex |
