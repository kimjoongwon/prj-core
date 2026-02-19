# RefreshToken VO 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: vo
> 위치: packages/be-vo/src/auth/token/refresh-token.vo.ts

## 역할

JWT Refresh Token을 값 객체로 캡슐화합니다. AccessToken과 동일한 JWT 형식 검증을 수행하며, `TokenPair`의 일부로 함께 관리됩니다. Access Token 갱신 요청에 사용됩니다.

## Props

| 필드 | 타입 | 설명 |
|------|------|------|
| value | string | JWT Refresh Token 문자열 |

## 유효성 규칙

| 규칙 | 에러 메시지 |
|------|------------|
| value 필수 | "Refresh Token은 필수입니다." |
| JWT 형식 검증 (3파트, Base64URL) | "유효하지 않은 JWT 형식입니다." |

## JWT 형식 정규식

```
/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
```

- header.payload.signature 3파트
- 각 파트는 Base64URL 문자만 허용

## 팩토리 메서드

| 메서드 | 파라미터 | 설명 |
|--------|----------|------|
| `RefreshToken.create(token)` | string | JWT 형식 검증 후 RefreshToken 생성 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| `get value` | string | JWT 문자열 반환 |
| `toString()` | string | JWT 문자열 그대로 반환 |

## AccessToken과의 차이

| 항목 | AccessToken | RefreshToken |
|------|-------------|--------------|
| 유효 기간 | 짧음 (15분 등) | 길음 (7일 등) |
| 사용 목적 | API 인증 | AccessToken 갱신 |
| 저장 위치 | 메모리/쿠키 | 쿠키 (httpOnly) |

## 구현 체크리스트

- [x] refresh-token.vo.ts
- [x] ValueObject 상속
- [x] validate() 구현
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
