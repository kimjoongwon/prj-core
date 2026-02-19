# AuthStore 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: store
> 위치: packages/fe-store/src/stores/authStore.ts

## 역할

인증 상태 관리 Store. 로그인 여부 확인과 로그아웃 처리를 담당합니다. 토큰의 실제 만료 여부는 `PersistStore`에 위임하며, 인증 에러 처리는 customAxios 인터셉터와 협력합니다.

## 상태 (Observable)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| rootStore | `RootStore` | 생성자 주입 | 루트 Store 참조 |
| isLoggingOut | `boolean` | `false` | 로그아웃 진행 중 여부 |

## 계산된 값 (Computed)

| 속성 | 타입 | 계산 로직 |
|------|------|----------|
| isAuthenticated | `boolean` | `!this.rootStore.persistStore?.isAccessTokenExpired` - PersistStore의 Access Token 만료 여부로 판단 |

## 액션 (Action)

없음 (async 메서드만 존재)

## 비동기 액션 (Flow)

| 메서드 | 파라미터 | API 호출 | 성공 시 동작 |
|--------|----------|----------|--------------|
| `handleAuthError` | `error: unknown` | 없음 (인터셉터에 위임) | Promise.reject(error) 반환 - 401은 인터셉터가 토큰 갱신 시도 |
| `logout` | `logoutApi?: () => Promise<unknown>` | logoutApi가 있으면 호출 | `/admin/auth/login`으로 리다이렉트 (navigateTo 사용, replace 모드) |

## 의존 Store

| Store | 사용 방식 |
|-------|----------|
| RootStore | 생성자 주입, `persistStore` 접근을 위해 참조 |
| PersistStore | `rootStore.persistStore?.isAccessTokenExpired`로 인증 상태 판단 |

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| authStore | AuthStore |

## 외부 의존성

| 패키지 | 사용 |
|--------|------|
| `@cocrepo/toolkit` | `createLogger`, `navigateTo` |

## 주요 동작 흐름

### 로그아웃
1. `isLoggingOut`을 true로 설정
2. `logoutApi`가 전달되면 호출 (서버 측 로그아웃)
3. `/admin/auth/login`으로 replace 리다이렉트
4. 에러 발생 시에도 로그인 페이지로 리다이렉트
5. finally에서 `isLoggingOut`을 false로 설정

### 인증 에러 처리
- 401 에러는 customAxios 인터셉터가 토큰 갱신을 시도
- 갱신 실패 시 인터셉터가 로그인 페이지로 리다이렉트

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
