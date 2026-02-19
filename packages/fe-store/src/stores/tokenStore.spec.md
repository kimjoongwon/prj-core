# TokenStore 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: store
> 위치: packages/fe-store/src/stores/tokenStore.ts

## 역할

토큰 관리 Store. httpOnly 쿠키 환경에서 프론트엔드가 토큰에 직접 접근하지 않는 구조이므로, 현재는 RootStore 참조만 보유하는 최소한의 클래스입니다. 토큰 만료 시간 관리는 `PersistStore`가, 토큰 갱신은 customAxios 인터셉터가 담당합니다.

## 상태 (Observable)

없음 (makeAutoObservable 미사용)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| rootStore | `RootStore` (readonly) | 생성자 주입 | 루트 Store 참조 |

## 계산된 값 (Computed)

없음

## 액션 (Action)

없음

## 비동기 액션 (Flow)

없음

## 의존 Store

| Store | 사용 방식 |
|-------|----------|
| RootStore | 생성자 주입, 향후 확장을 위한 참조 보유 |

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| tokenStore | TokenStore |

## 비고

- httpOnly 쿠키 환경으로 전환 이후 대부분의 토큰 관련 로직이 제거됨
- 토큰 만료 시간 → `PersistStore` (localStorage 기반)
- 토큰 갱신 → customAxios 인터셉터 (401 응답 시 자동 처리)
- 향후 토큰 관련 추가 기능이 필요할 때 확장 가능한 구조로 유지

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
