# Store 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: store
> 위치: packages/fe-store/src/stores/Store.ts

## 역할

레거시 루트 Store 클래스. `RootStore`로 대체되었으며, 이전 버전과의 호환을 위해 유지되고 있는 것으로 보입니다. 내부에서 직접 하위 Store를 생성하는 방식으로, 현재 프로젝트 표준인 외부 주입 방식의 `RootStore`와 다릅니다.

## 상태 (Observable)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| name | `string` | `"PROTOTYPE"` | Store 식별자 |
| navigation | `NavigationStore \| undefined` | `undefined` | 네비게이션 Store (주석 처리로 미사용) |
| tokenStore | `TokenStore \| undefined` | `new TokenStore(this)` | 토큰 관리 Store |
| authStore | `AuthStore \| undefined` | `new AuthStore(this)` | 인증 상태 Store |
| cookieStore | `CookieStore \| undefined` | `new CookieStore()` | 쿠키 관리 Store |
| abilityStore | `AbilityStore` | `new AbilityStore(this)` | CASL 권한 Store |

## 계산된 값 (Computed)

없음 (makeAutoObservable에 의해 자동 처리)

## 액션 (Action)

없음

## 비동기 액션 (Flow)

없음

## 의존 Store

| Store | 사용 방식 |
|-------|----------|
| NavigationStore | import만 존재, 실제 생성은 주석 처리됨 |
| TokenStore | 생성자에서 직접 인스턴스화 |
| AuthStore | 생성자에서 직접 인스턴스화 |
| CookieStore | 생성자에서 직접 인스턴스화 |
| AbilityStore | 생성자에서 직접 인스턴스화 |

## RootStore 연결

이 클래스는 RootStore의 이전 버전으로, RootStore와 별도로 존재합니다.

## 비고

- `RootStore`가 표준 루트 Store이며, 이 클래스는 레거시 코드입니다
- NavigationStore 생성 코드가 주석 처리되어 있음
- `makeAutoObservable(this)`로 모든 속성이 자동 observable 처리

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
