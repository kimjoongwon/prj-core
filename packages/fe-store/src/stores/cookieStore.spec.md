# CookieStore 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: store
> 위치: packages/fe-store/src/stores/cookieStore.ts

## 역할

브라우저 쿠키에 대한 CRUD 래퍼 Store. `react-cookie`의 `Cookies` 클래스를 감싸서 쿠키 읽기/쓰기/삭제 기능을 제공합니다. MobX observable이 아닌 단순 유틸리티 클래스입니다.

## 상태 (Observable)

없음 (makeAutoObservable 미사용)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| cookies | `Cookies` (private) | `new Cookies()` | react-cookie의 Cookies 인스턴스 |

## 계산된 값 (Computed)

없음

## 액션 (Action)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| `set` | `name: string, value: unknown, options?: any` | 쿠키 설정 |
| `get` | `name: string` | 쿠키 값 읽기 (any 반환) |
| `remove` | `name: string, options?: any` | 쿠키 삭제 |
| `getAll` | 없음 | 모든 쿠키를 `{ [key: string]: unknown }` 형태로 반환 |

## 비동기 액션 (Flow)

없음

## 의존 Store

없음

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| cookieStore | CookieStore |

## 외부 의존성

| 패키지 | 사용 |
|--------|------|
| `react-cookie` | `Cookies` 클래스 |

## 비고

- MobX observable로 선언되지 않았으므로 쿠키 변경이 자동으로 리렌더링을 트리거하지 않음
- 순수 유틸리티 래퍼 역할

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
