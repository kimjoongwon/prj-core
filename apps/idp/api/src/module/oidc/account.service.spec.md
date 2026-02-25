# Account Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: apps/idp-server/src/module/oidc/account.service.ts

## 역할

oidc-provider가 Authorization Flow에서 사용자 정보를 조회할 때 사용하는 `findAccount` 함수를 구현합니다. Redis 캐시(TTL 5분)를 활용하여 반복적인 DB 조회를 방지하고, scope에 따른 claims 필터링을 처리합니다.

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `DirectUserRepository` | 사용자 정보(name, email, phone, tenants) DB 조회 |
| `RedisService` | claims 캐시 저장/조회 (키: `oidc:account:{userId}`, TTL: 300초) |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findAccount` | ctx, id, token | `Promise<Account>` | oidc-provider FindAccount 인터페이스 구현. accountId와 claims 함수를 반환 |
| `getClaims` (private) | userId, scope | `Promise<AccountClaims>` | Redis 캐시 확인 후 DB 조회, scope에 따라 필터링하여 반환 |
| `buildFullClaims` (private) | user (id, name, email, phone 등) | `AccountClaims` | DB 사용자 정보에서 전체 claims 빌드 (모든 scope 포함) |
| `filterClaimsByScope` (private) | fullClaims, scope | `AccountClaims` | scope 문자열에 따라 claims 필드 선택적 반환 |

## 비즈니스 규칙

### Claims 캐시 전략

- 캐시 키: `oidc:account:{userId}`
- TTL: 300초(5분)
- 캐시 미스 시 DB 조회 후 전체 claims를 캐시에 저장
- 캐시 히트 시 scope 필터링만 수행하여 DB 조회 없음

### Scope별 Claims 매핑

| Scope | 포함 Claims |
|-------|------------|
| `openid` (항상 포함) | `sub` |
| `profile` | `name`, `updated_at` |
| `email` | `email`, `email_verified` |
| `phone` | `phone_number`, `phone_number_verified` |
| `roles` | `roles` (spaceId, roleId, roleName, roleDisplayName, isSystemRole), `spaces` (spaceId, groundName) |

### Claims 구조 (`AccountClaims`)

- `sub`: 사용자 UUID
- `name`: 사용자 이름
- `updated_at`: Unix timestamp (updatedAt 없으면 createdAt 사용)
- `email`: 이메일 주소
- `email_verified`: 항상 `true`
- `phone_number`: 전화번호
- `phone_number_verified`: 항상 `true`
- `roles[]`: tenant 관계에서 추출한 역할 정보 배열
- `spaces[]`: tenant 관계에서 추출한 Space 정보 배열

## 구현 체크리스트

- [x] account.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
