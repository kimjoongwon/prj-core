# Users Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/users.service.ts

## 역할

사용자 계정 관리의 핵심 비즈니스 로직을 담당합니다.
Space 기반 사용자 목록/상세 조회, 등록/수정/삭제, 비밀번호 변경, 계정 잠금 해제, 임시 비밀번호 발급 등을 처리합니다.
CLS SpaceContext를 통해 접근 가능한 Space 범위 내에서 사용자를 관리합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `UsersRepository` | 사용자 CRUD |
| `SpaceContext` | 접근 가능한 Space ID 목록 제공 |
| `AuthCacheService` | 사용자 캐시 무효화 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getByIdWithTenants` | `id: string` | Tenant+Profile 포함 사용자 조회 |
| `findUserForAuth` | `email: string` | 인증용 경량 사용자 조회 (이메일, 비밀번호만) |
| `getUsersBySpace` | `query: QueryUsersDto` | `Promise<GetUsersResult>` | 접근 가능한 Space 내 사용자 목록 조회 |
| `getUserDetailForSpace` | `userId, spaceId` | Space 내 사용자 상세 조회 |
| `createUserForSpace` | `params` | 사용자 등록 (Tenant, Profile, Category, Group 포함) |
| `updateUserForSpace` | `userId, spaceId, params` | 사용자 수정 + 캐시 무효화 |
| `deleteUserForSpace` | `userId, spaceId, currentUserId` | 사용자 소프트 삭제 + 캐시 무효화 |
| `changePassword` | `userId, currentPassword, newPassword` | `Promise<void>` | 비밀번호 변경 |
| `unlockAccount` | `userId` | `Promise<void>` | 계정 잠금 해제 (관리자) |
| `forceResetPassword` | `userId` | `Promise<{temporaryPassword, email}>` | 비밀번호 강제 재설정 (관리자) |
| `getSecurityInfo` | `userId` | 사용자 보안 정보 조회 |
| `createUserForSignUp` | `params` | 회원가입용 사용자 생성 (ApplicationService용) |

## 비즈니스 규칙

### 사용자 등록/수정 고유성 검증

- 이메일, 전화번호, 이름 모두 전역 unique
- 수정 시 변경된 필드만 중복 검사

### 비밀번호 변경 프로세스

1. 현재 비밀번호 검증
2. 비밀번호 정책 검증 (`validatePasswordPolicy`)
3. 현재 비밀번호와 동일한지 확인
4. 최근 5개 비밀번호 재사용 확인
5. 비밀번호 변경
6. 히스토리 저장 (최대 5개 유지)
7. 인증 캐시 무효화

### 삭제 제한

- 자기 자신 삭제 불가

### 임시 비밀번호

- 12자리, 대소문자 + 숫자 + 특수문자
- 생성 후 계정 잠금도 자동 해제

## 에러 처리

| 에러 상황 | 에러 타입 | 메시지 |
|----------|-----------|--------|
| 사용자 없음 | `NotFoundException` | `USER_ERRORS.USER_NOT_FOUND` |
| 이메일 중복 | `BadRequestException` | `USER_ERRORS.EMAIL_ALREADY_EXISTS` |
| 전화번호 중복 | `BadRequestException` | `USER_ERRORS.PHONE_ALREADY_EXISTS` |
| 이름 중복 | `BadRequestException` | `USER_ERRORS.NAME_ALREADY_EXISTS` |
| 자기 자신 삭제 | `BadRequestException` | `USER_ERRORS.CANNOT_DELETE_SELF` |
| 현재 비밀번호 불일치 | `BadRequestException` | "CURRENT_PASSWORD_INCORRECT" |
| 비밀번호 정책 위반 | `BadRequestException` | "PASSWORD_POLICY_VIOLATION: {규칙}" |
| 비밀번호 재사용 | `BadRequestException` | "PASSWORD_REUSE" |

## 권한 요구사항

- 일반 사용자: 본인 비밀번호 변경
- 관리자(MANAGE 이상): 사용자 등록/수정/삭제, 잠금 해제
- FULL_ACCESS: 임시 비밀번호 발급

## 구현 체크리스트

- [x] users.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | 회원가입 생성 메서드 설명을 ApplicationService 기준으로 갱신 | codex |
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
