# AuthCache Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/auth-cache.service.ts

## 역할

인증 사용자 정보를 Redis에 캐싱하는 서비스입니다.
JwtStrategy, UsersService 등 여러 곳에서 사용하는 인증 캐시 로직을 중앙화합니다.
모든 Redis 호출은 try-catch로 감싸서 Redis 장애 시에도 인증 플로우가 중단되지 않도록 합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `RedisService` | Redis 캐시 저장소 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `get` | `userId: string` | `Promise<string \| null>` | 캐시된 사용자 데이터 조회 |
| `set` | `userId: string, data: string, jwtRemainingSeconds: number` | `Promise<void>` | 사용자 데이터 캐시 저장 |
| `invalidate` | `userId: string` | `Promise<void>` | 사용자 캐시 무효화 |

## 비즈니스 규칙

- Redis 키 패턴: `auth:user:{userId}`
- 최대 TTL: 300초 (5분)
- TTL 계산: `min(JWT 남은 시간, 5분)` - JWT가 만료되면 캐시도 자동 만료
- Redis 장애 시 `get`은 `null` 반환 (DB fallback 유도)
- Redis 장애 시 `set`, `invalidate`는 무시 (fire-and-forget)

## 에러 처리

| 에러 상황 | 에러 타입 | 처리 방식 |
|----------|-----------|-----------|
| Redis 조회 실패 | - | `null` 반환, 경고 로그 |
| Redis 저장 실패 | - | 무시 (fire-and-forget), 경고 로그 |
| Redis 무효화 실패 | - | 무시, 경고 로그 |

## 권한 요구사항

- 내부 서비스 전용, 직접 Controller 노출 없음

## 구현 체크리스트

- [x] auth-cache.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
