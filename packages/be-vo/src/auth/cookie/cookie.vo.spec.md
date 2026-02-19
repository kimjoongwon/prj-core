# Cookie VO 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: vo
> 위치: packages/be-vo/src/auth/cookie/cookie.vo.ts

## 역할

HTTP 쿠키 설정을 값 객체로 캡슐화합니다. JWT 토큰을 쿠키에 저장할 때 필요한 보안 설정(httpOnly, secure, sameSite 등)을 불변 값으로 관리하며, Express CookieOptions 형식으로 변환하는 기능을 제공합니다.

## Props

| 필드 | 타입 | 설명 |
|------|------|------|
| maxAge | number | 쿠키 유효 시간 (밀리초) |
| httpOnly | boolean | JS에서 접근 불가 여부 |
| secure | boolean | HTTPS에서만 전송 여부 |
| sameSite | "strict" \| "lax" \| "none" | SameSite 정책 |
| path | string | 쿠키 적용 경로 |

## 유효성 규칙

| 규칙 | 에러 메시지 |
|------|------------|
| maxAge > 0 | "maxAge는 0보다 커야 합니다." |
| path 필수 | "path는 필수입니다." |

## 만료 시간 파싱 (parseExpiration)

| 입력 형식 | 설명 | 예시 |
|-----------|------|------|
| number | 초 단위로 간주 → ×1000ms | 3600 → 3,600,000ms |
| `Ns` | N초 | "30s" |
| `Nm` | N분 | "15m" |
| `Nh` | N시간 | "24h" |
| `Nd` | N일 | "7d" |

## 팩토리 메서드

| 메서드 | 파라미터 | 설명 |
|--------|----------|------|
| `Cookie.create(maxAge, isProduction?)` | maxAge(ms), isProduction(bool) | 기본 쿠키 생성. production에서는 secure=true |
| `Cookie.forToken(expiresIn, isProduction?)` | expiresIn(string\|number), isProduction(bool) | 토큰용 쿠키 생성. 만료 시간 파싱 후 create() 호출 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| `toExpressOptions()` | CookieOptions | Express res.cookie() 호환 옵션으로 변환 |
| `get maxAge` | number | maxAge 값 반환 |
| `get httpOnly` | boolean | httpOnly 값 반환 |
| `get secure` | boolean | secure 값 반환 |
| `get sameSite` | string | sameSite 값 반환 |
| `get path` | string | path 값 반환 |

## 기본값 정책

| 환경 | secure | sameSite | httpOnly | path |
|------|--------|----------|----------|------|
| production | true | lax | true | "/" |
| 개발/테스트 | false | lax | true | "/" |

## 구현 체크리스트

- [x] cookie.vo.ts
- [x] ValueObject 상속
- [x] validate() 구현
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
