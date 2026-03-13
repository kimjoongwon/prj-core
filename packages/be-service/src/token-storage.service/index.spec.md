# TokenStorage Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-03-13
> 타입: service
> 위치: packages/be-service/src/token-storage.service/index.ts

## 역할

JWT 토큰 및 세션을 Redis에 저장하고 관리합니다.
멀티 디바이스 세션 관리, Access Token 블랙리스트, OIDC State/PKCE 저장을 담당합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `RedisService` | 토큰/세션 저장소 |
| `ConfigService` | 인증 설정(만료 시간) 조회 |

## 메서드

### 세션 관리 (멀티 디바이스)

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `generateSessionId` | - | `string` | 세션 ID 생성 (16바이트 hex) |
| `saveSession` | `userId, sessionId, refreshToken, metadata` | `Promise<void>` | 세션 저장 (로그인 시) |
| `getSessionRefreshToken` | `userId, sessionId` | `Promise<string \| null>` | 세션의 Refresh Token 조회 |
| `updateSession` | `userId, sessionId, refreshToken` | `Promise<void>` | 세션 활동 시간 및 Refresh Token 업데이트 |
| `getUserSessions` | `userId, currentSessionId?` | `Promise<SessionInfo[]>` | 사용자의 모든 세션 목록 조회 |
| `deleteSession` | `userId, sessionId` | `Promise<void>` | 특정 세션 삭제 |
| `deleteOtherSessions` | `userId, currentSessionId` | `Promise<number>` | 현재 세션 제외 다른 모든 세션 삭제 |
| `deleteAllSessions` | `userId` | `Promise<void>` | 사용자의 모든 세션 삭제 |
| `getSessionForRevocation` | `userId, sessionId` | `Promise<SessionMetadata \| null>` | 세션 메타데이터 조회 (폐기용) |

### Access Token 블랙리스트

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `addToBlacklist` | `accessToken, ttlSeconds?` | `Promise<void>` | Access Token 블랙리스트 추가 |
| `isBlacklisted` | `accessToken` | `Promise<boolean>` | Access Token 블랙리스트 확인 |
| `invalidateAllUserTokens` | `userId` | `Promise<void>` | 사용자의 모든 토큰 무효화 |

### OIDC State (CSRF 방지 + PKCE)

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `saveOidcState` | `state, codeVerifier, ttlSeconds?, returnTo?` | `Promise<void>` | OIDC State + PKCE code_verifier 저장 |
| `validateAndConsumeOidcState` | `state` | `Promise<{codeVerifier, returnTo?} \| null>` | OIDC State 검증 및 소비 (일회용) |

## Redis 키 패턴

| 용도 | 키 패턴 |
|------|---------|
| 세션 | `session:{userId}:{sessionId}` |
| Refresh Token (레거시) | `refresh:{userId}` |
| Access Token 블랙리스트 | `blacklist:{sha256 앞 32자}` |
| OIDC State | `oidc:state:{state}` |

## 비즈니스 규칙

- 세션 TTL: ConfigService의 `auth.refresh` 설정 (기본 7일)
- 블랙리스트 TTL: ConfigService의 `auth.expires` 설정 (기본 1시간)
- OIDC State TTL: 기본 600초 (10분), 일회용 소비
- 세션 목록은 최근 활동 순 정렬
- `isBlacklisted`: 토큰을 SHA256 해싱 후 앞 32자로 키 생성

## 에러 처리

- 별도 에러 처리 없음 (토큰 없으면 null 반환)

## 권한 요구사항

- 내부 서비스 전용 (TokenService, ApplicationService에서 호출)

## 구현 체크리스트

- [x] token-storage.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | 호출 주체 설명을 ApplicationService 기준으로 갱신 | codex |
| 2026-03-13 | `token-storage.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
| 2026-03-13 | 폴더형 `index.ts` 구조에 맞게 `RedisService` 상대 import 경로를 `../redis.service`로 보정 | codex |
