# IDP Accounts Controller 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: controller
> 위치: apps/idp-server/src/module/idp-accounts/idp-accounts.controller.ts

## 역할

IDP(Identity Provider) 계정 관리 API를 제공합니다. 관리자가 IDP에 등록된 사용자 계정의 목록 조회, 상세 조회, 활성/비활성 토글, 로그인 실패 횟수 초기화를 수행할 수 있습니다. 전체 엔드포인트가 `FULL_ACCESS` 권한과 `SkipSpaceCheck`를 적용하여 시스템 관리자 전용으로 운영됩니다.

## 엔드포인트

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | / | IDP 계정 목록 조회 (페이지네이션, 검색) | FULL_ACCESS, SkipSpaceCheck |
| GET | /:userId | IDP 계정 상세 조회 (보안 정보 + 감사 로그) | FULL_ACCESS, SkipSpaceCheck |
| PATCH | /:userId/toggle-active | 계정 활성/비활성 토글 | FULL_ACCESS, SkipSpaceCheck |
| POST | /:userId/reset-failed-attempts | 로그인 실패 횟수 초기화 및 잠금 해제 | FULL_ACCESS, SkipSpaceCheck |

## 인증/인가

- 컨트롤러 레벨에서 `@Roles([SYSTEM_ROLES.FULL_ACCESS])`와 `@SkipSpaceCheck()` 적용
- 모든 엔드포인트는 `@ApiAuth()` 필요 (JWT Bearer Token)
- Space 체크를 건너뛰므로 X-Space-ID 헤더 불필요

## 요청/응답 DTO

| 엔드포인트 | 요청 DTO | 응답 DTO |
|-----------|----------|----------|
| GET / | `QueryIdpAccountDto` (Query) | `IdpAccountDto[]` + `PageMetaDto` |
| GET /:userId | Path: `userId` (UUID) | `IdpAccountDto` |
| PATCH /:userId/toggle-active | Path: `userId` (UUID) | `IdpAccountDto` |
| POST /:userId/reset-failed-attempts | Path: `userId` (UUID) | 204 No Content |

## 비즈니스 규칙

- 목록 조회는 페이지네이션 지원 (기본 skip=0, take=20)
- 상세 조회 시 보안 정보(잠금 상태, 실패 횟수)와 최근 감사 로그를 함께 반환
- 로그인 실패 횟수 초기화 시 `failedLoginAttempts=0` 및 잠금 상태 해제
- 활성/비활성 토글은 현재 상태를 반전시키는 멱등성 없는 작업

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `IdpAccountService` | 계정 조회, 상태 변경, 실패 횟수 초기화 비즈니스 로직 |

## 구현 체크리스트

- [x] idp-accounts.controller.ts
- [x] `@Controller()` 데코레이터
- [x] `@ApiTags("IDP_ACCOUNTS")` 태그 설정
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
