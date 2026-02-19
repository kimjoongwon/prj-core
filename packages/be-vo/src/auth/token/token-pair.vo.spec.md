# TokenPair VO 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: vo
> 위치: packages/be-vo/src/auth/token/token-pair.vo.ts

## 역할

Access Token과 Refresh Token을 한 쌍으로 묶어 관리하는 값 객체입니다. 로그인 성공 시 발급되는 두 토큰을 하나의 단위로 처리하여 일관성을 보장합니다.

## Props

| 필드 | 타입 | 설명 |
|------|------|------|
| accessToken | AccessToken | JWT Access Token VO |
| refreshToken | RefreshToken | JWT Refresh Token VO |

## 유효성 규칙

| 규칙 | 에러 메시지 |
|------|------------|
| accessToken 필수 | "Access Token은 필수입니다." |
| refreshToken 필수 | "Refresh Token은 필수입니다." |

## 팩토리 메서드

| 메서드 | 파라미터 | 설명 |
|--------|----------|------|
| `TokenPair.create(accessToken, refreshToken)` | AccessToken, RefreshToken | VO 객체로부터 생성 |
| `TokenPair.fromStrings(accessTokenStr, refreshTokenStr)` | string, string | 문자열로부터 생성 (내부적으로 VO 생성) |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| `get accessToken` | AccessToken | AccessToken VO 반환 |
| `get refreshToken` | RefreshToken | RefreshToken VO 반환 |
| `toObject()` | `{ accessToken: string, refreshToken: string }` | 문자열 객체로 변환 (응답 직렬화용) |

## 사용 흐름

```
로그인 성공
  → JwtService.sign() → accessTokenStr, refreshTokenStr
  → TokenPair.fromStrings(accessTokenStr, refreshTokenStr)
  → tokenPair.toObject() → 응답에 포함
  → 각 토큰을 쿠키에 설정 (Cookie.forToken() 사용)
```

## 구현 체크리스트

- [x] token-pair.vo.ts
- [x] ValueObject 상속
- [x] validate() 구현
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
