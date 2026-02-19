# User Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/user.entity.ts

## 역할

시스템의 핵심 사용자 엔티티입니다. 이메일/비밀번호 기반 인증 정보, 계정 잠금 상태, 비밀번호 변경 정책, 활성화 여부를 관리합니다. Tenant를 통해 Space에 접근하고, Grant를 통해 사용자별 예외 권한을 가집니다. AuthAuditLog, PasswordHistory와 연결되어 보안 추적을 지원합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| name | string | required | - | 사용자 이름 |
| email | string | required, unique | - | 이메일 (로그인 ID) |
| phone | string | required | - | 전화번호 |
| password | string | required | - | 비밀번호 해시 |
| failedLoginAttempts | number | required | 0 | 로그인 실패 횟수 |
| isPermanentlyLocked | boolean | required | false | 영구 잠금 여부 |
| mustChangePassword | boolean | required | false | 비밀번호 변경 필요 여부 |
| isActive | boolean | required | true | 계정 활성화 여부 |
| lockedUntil | Date \| null | nullable | null | 임시 잠금 해제 일시 |
| passwordChangedAt | Date \| null | nullable | null | 마지막 비밀번호 변경 일시 |
| lastLoginAt | Date \| null | nullable | null | 마지막 로그인 일시 |
| lastLoginIp | string \| null | nullable | null | 마지막 로그인 IP |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| profiles | Profile[] | OneToMany | 사용자 프로필 목록 |
| tenants | Tenant[] | OneToMany | 공간-역할 접근 정보 목록 |
| associations | UserAssociation[] | OneToMany | 그룹 소속 정보 |
| passwordHistory | PasswordHistory[] | OneToMany | 비밀번호 변경 이력 |
| authAuditLogs | AuthAuditLog[] | OneToMany | 인증 감사 로그 |
| abilities | Ability[] | ManyToMany | 사용자별 예외 권한 (CASL) |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| hasTenantAccess(tenantId) | boolean | 특정 테넌트 소속 여부 확인 |
| isNotRemoved() | boolean | 삭제되지 않은 상태 여부 확인 |
| isLocked() | boolean | 계정 잠금 상태 확인 (영구 또는 임시 잠금) |
| needsPasswordChange() | boolean | 비밀번호 변경 필요 여부 확인 |

## 비즈니스 규칙

- `email`은 로그인 ID로 사용되며 시스템 전체에서 유니크합니다.
- `isActive=false`이면 계정이 비활성화되어 로그인 불가합니다.
- `isPermanentlyLocked=true`이면 영구 잠금으로 관리자가 해제해야 합니다.
- `lockedUntil`이 현재 시각 이후이면 임시 잠금 상태입니다.
- `failedLoginAttempts`가 SecurityPolicy 임계값에 도달하면 잠금됩니다.
- `mustChangePassword=true`이면 다음 로그인 시 비밀번호 변경을 강제합니다.
- `password`는 bcrypt 해시로 저장됩니다 (원문 저장 금지).
- CASL에서 사용자별 예외 권한은 Grant의 `granteeType="User"` 레코드를 통해 관리됩니다.

## 구현 체크리스트

- [x] user.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma UserEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
