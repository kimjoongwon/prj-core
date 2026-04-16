# IDP Accounts Controller 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: controller
> 위치: apps/idp/api/src/module/idp-accounts/idp-accounts.controller.ts

## 역할

IDP(Identity Provider) 계정 관리 API를 제공합니다. 관리자가 현재 `x-space-id`로 선택한 tenant 범위 안에서 사용자 계정의 목록 조회, 상세 조회, 활성/비활성 토글, 로그인 실패 횟수 초기화를 수행할 수 있습니다.

## 엔드포인트

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | / | IDP 계정 목록 조회 (페이지네이션, 검색) | JWT + 현재 tenant scope |
| GET | /:userId | IDP 계정 상세 조회 (보안 정보 + 감사 로그) | JWT + 현재 tenant scope |
| PATCH | /:userId/toggle-active | 계정 활성/비활성 토글 | JWT + 현재 tenant scope |
| POST | /:userId/reset-failed-attempts | 로그인 실패 횟수 초기화 및 잠금 해제 | JWT + 현재 tenant scope |

## 인증/인가

- 모든 엔드포인트는 `@ApiAuth()` 필요 (JWT Bearer Token)
- `SpaceAccessGuard`가 현재 `x-space-id`에 대한 tenant 존재를 먼저 검증합니다.
- 실제 계정 데이터 범위는 `IdpAccountService`가 `SpaceContext`로 제한합니다.

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
| `IdpAccountFacade` | 목록 메타 조립 및 계정 관리 controller boundary |

## 구현 체크리스트

- [x] idp-accounts.controller.ts
- [x] `@Controller()` 데코레이터
- [x] `@ApiTags("IDP_ACCOUNTS")` 태그 설정
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | IDP 계정 API를 FULL_ACCESS 전용 전역 조회에서 현재 tenant scope API로 전환 | codex |
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-12 | 컨트롤러 진입점을 `IdpAccountService`로 정렬 | codex |
| 2026-03-12 | 순수성 기준으로 단일 전달형은 `@cocrepo/service` 직접 주입으로 정리 | codex |
| 2026-03-12 | 목록 응답의 페이지 메타 조립을 ApplicationService로 이관 | codex |
| 2026-03-13 | controller boundary 조합을 `IdpAccountFacade`로 이관 | codex |
