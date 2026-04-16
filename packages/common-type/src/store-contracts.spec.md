# store-contracts type 기획서

> 생성일: 2026-03-06
> 타입: type
> 위치: packages/common-type/src/store-contracts.ts

## 역할

`@cocrepo/store`와 앱 Provider 계층에서 공유되는 Store 계약 타입을 정의합니다.  
구현 클래스는 각 패키지에 두고, 재사용되는 인터페이스/함수 타입만 이 파일에 유지합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AbilityChecker | 권한 체크 함수 타입 |
| FABAbilityChecker | FAB 권한 체크 함수 타입 |
| NavItemScopeChecker | 현재 tenant scope 기준으로 메뉴/화면 노출 가능 여부를 판정하는 함수 타입 |
| ModalOpenHandler | 모달 열기 핸들러 타입 |
| NavigatorLike | Store가 의존하는 최소 네비게이터 계약 |
| NavigationStoreOptions | NavigationStore 생성 옵션 (`abilityChecker`, `scopeChecker`, navigator 등) |
| FABConfig | FABStore 생성자 설정 타입 |
| FABStoreOptions | FABStore 생성 옵션 |
| AppStoreConfig | createAppStoreProvider 입력 설정 타입 |
| AppStoreProviderResult | createAppStoreProvider 반환 계약 타입 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | NavigationStore가 현재 tenant scope를 재사용할 수 있도록 `NavItemScopeChecker` 계약을 추가 | codex |
| 2026-03-06 | fe-store의 로컬 계약 타입을 공용 type 패키지로 승격하기 위해 신규 생성 | codex |
