# SecurityPolicy Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/security-policy.entity.ts

## 역할

시스템 전역 보안 정책을 나타내는 싱글턴 엔티티입니다. 비밀번호 정책(최소 길이, 복잡성 요구사항, 만료일, 재사용 제한), 계정 잠금 정책(임시/영구 잠금 임계값), 세션 정책(토큰 TTL), 화이트리스트 정책 활성화 여부를 통합 관리합니다. AbstractEntity를 상속하지 않습니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| key | string | required, unique | - | 정책 식별 키 (싱글턴이므로 고정값) |
| passwordMinLength | number | required | - | 비밀번호 최소 길이 |
| passwordRequireUppercase | boolean | required | - | 대문자 요구 여부 |
| passwordRequireLowercase | boolean | required | - | 소문자 요구 여부 |
| passwordRequireNumber | boolean | required | - | 숫자 요구 여부 |
| passwordRequireSpecial | boolean | required | - | 특수문자 요구 여부 |
| passwordExpirationDays | number | required | - | 비밀번호 만료일 (0: 만료 없음) |
| passwordReuseLimit | number | required | - | 비밀번호 재사용 제한 횟수 |
| temporaryLockThreshold | number | required | - | 임시 잠금 임계값 (실패 횟수) |
| temporaryLockDurationMin | number | required | - | 임시 잠금 지속 시간 (분) |
| permanentLockThreshold | number | required | - | 영구 잠금 임계값 (실패 횟수) |
| accessTokenTtlSec | number | required | - | Access Token 유효 시간 (초) |
| refreshTokenTtlSec | number | required | - | Refresh Token 유효 시간 (초) |
| sessionTtlSec | number | required | - | 세션 유효 시간 (초) |
| ipWhitelistEnabled | boolean | required | - | IP 화이트리스트 활성화 여부 |
| emailDomainWhitelistEnabled | boolean | required | - | 이메일 도메인 화이트리스트 활성화 여부 |
| corsOriginWhitelistEnabled | boolean | required | - | CORS Origin 화이트리스트 활성화 여부 |

## Enum

해당 없음

## 관계

해당 없음

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| getTemporaryLockDurationMs() | number | 임시 잠금 시간을 밀리초로 반환 |
| isPasswordExpirationEnabled() | boolean | 비밀번호 만료 활성화 여부 확인 (passwordExpirationDays > 0) |

## 비즈니스 규칙

- 시스템에 단 하나의 SecurityPolicy 레코드만 존재합니다 (싱글턴 패턴).
- `key` 필드로 유니크 레코드를 식별합니다.
- `passwordExpirationDays=0`이면 비밀번호 만료 정책이 비활성화됩니다.
- `temporaryLockThreshold` 이상 실패 시 `temporaryLockDurationMin`만큼 임시 잠금됩니다.
- `permanentLockThreshold` 이상 실패 시 영구 잠금(`isPermanentlyLocked=true`)됩니다.
- 화이트리스트 활성화 여부는 WhitelistEntry 엔티티의 실제 데이터와 함께 동작합니다.
- AbstractEntity를 상속하지 않아 `removedAt` 필드가 없습니다.

## 구현 체크리스트

- [x] security-policy.entity.ts
- [x] AbstractEntity 미상속 (독립 구현)
- [x] Prisma SecurityPolicyModel 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
