# SecurityPolicy Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/security-policy.service.ts

## 역할

시스템 전역 보안 정책을 관리합니다.
Redis 캐시(5분 TTL)를 사용하여 빈번한 DB 조회를 방지합니다.
수정 시 캐시를 자동으로 무효화합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `SecurityPoliciesRepository` | 보안 정책 DB 조회/수정 |
| `RedisService` | 보안 정책 캐싱 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getDefault` | - | `Promise<SecurityPolicy>` | 기본 보안 정책 조회 (Redis 캐시 활용) |
| `update` | `dto: UpdateSecurityPolicyDto` | `Promise<SecurityPolicy>` | 보안 정책 수정 |

## 비즈니스 규칙

- Redis 키: `security-policy:default`
- 캐시 TTL: 300초 (5분)
- `getDefault`: 캐시 히트 시 JSON.parse 후 반환, 캐시 미스 시 DB 조회 후 캐시 저장
- `update`: DB 수정 후 캐시 삭제 (무효화)
- 보안 정책은 key `"default"` 하나만 존재 (싱글턴 패턴)

## 에러 처리

| 에러 상황 | 에러 타입 | 메시지 |
|----------|-----------|--------|
| 기본 보안 정책 없음 | `NotFoundException` | "기본 보안 정책을 찾을 수 없습니다" |

## 권한 요구사항

- 조회: 인증된 사용자
- 수정: FULL_ACCESS 역할 필요 (Controller 레이어에서 처리)

## 구현 체크리스트

- [x] security-policy.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
