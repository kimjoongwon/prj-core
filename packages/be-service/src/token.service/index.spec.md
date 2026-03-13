# Token Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-03-13
> 타입: service
> 위치: packages/be-service/src/token.service/index.ts

## 역할

IDP에서 발급한 JWT 토큰의 HTTP 쿠키 설정/삭제 및 블랙리스트 관리를 담당합니다.
TokenStorageService와 협력하여 토큰 생명주기를 관리합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `ConfigService` | Auth 설정(만료 시간) 조회 |
| `TokenStorageService` | 토큰 블랙리스트 확인 |
| `ClsService` | 요청 컨텍스트 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getTokenFromRequest` | `req: Request, key?: TokenValues` | `string` | 요청에서 쿠키 토큰 추출 |
| `setTokenToHTTPOnlyCookie` | `res: Response, key: TokenValues, value: string` | Response | HTTPOnly 쿠키에 토큰 설정 |
| `setAccessTokenCookie` | `res: Response, accessToken: string` | Response | Access Token 쿠키 설정 |
| `setRefreshTokenCookie` | `res: Response, refreshToken: string` | Response | Refresh Token 쿠키 설정 |
| `clearTokenCookies` | `res: Response` | `void` | 토큰 쿠키 삭제 (로그아웃) |
| `isTokenBlacklisted` | `accessToken: string` | `Promise<boolean>` | Access Token 블랙리스트 확인 |

## 비즈니스 규칙

- 쿠키 설정: Cookie Value Object를 통해 만료 시간 및 HTTPOnly 옵션 자동 적용
- Access Token 만료 시간: `auth.expires` 설정
- Refresh Token 만료 시간: `auth.refresh` 설정
- 쿠키 삭제 시 동일한 설정으로 clearCookie 호출

## 에러 처리

| 에러 상황 | 에러 타입 | 메시지 |
|----------|-----------|--------|
| 쿠키에 토큰 없음 | `BadRequestException` | 토큰 키 이름 |
| Auth 설정 없음 | `Error` | "Auth configuration is not defined." |

## 권한 요구사항

- 내부 서비스 전용 (인증 Facade/Controller에서 호출)

## 구현 체크리스트

- [x] token.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-13 | `token.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
| 2026-03-13 | 폴더형 `index.ts` 구조에 맞게 `TokenStorageService` 상대 import 경로를 `../token-storage.service`로 보정 | codex |
