# Security Policy Controller 기획서

> 생성일: 2026-02-19
> 수정일: 2026-03-13
> 타입: controller
> 위치: apps/idp/api/src/module/security-policy/security-policy.controller.ts

## 역할

시스템 보안 정책 조회/수정 관리자 API를 제공하며, 컨트롤러 경계의 요청 해석과 응답 조립은 `SecurityPolicyFacade`에 위임합니다. 모든 엔드포인트는 `FULL_ACCESS` 권한이 필요합니다.

## 엔드포인트

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | `/` | 현재 시스템 보안 정책 조회 | FULL_ACCESS, SkipSpaceCheck |
| PATCH | `/` | 보안 정책 수정 (변경할 필드만 전달) | FULL_ACCESS, SkipSpaceCheck |

## 인증/인가

- 컨트롤러 레벨에서 `@Roles([SYSTEM_ROLES.FULL_ACCESS])`와 `@SkipSpaceCheck()`를 적용합니다.
- 모든 엔드포인트는 `@ApiAuth()`가 필요합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| securityPolicyFacade | SecurityPolicyFacade | 보안 정책 조회/수정 boundary 유즈케이스 |

## 비즈니스 메모

- 단일 레코드(`key: "default"`)를 읽고 수정하는 정책을 유지합니다.
- Partial 업데이트 허용과 정책 변경 로직은 Facade 내부 `SecurityPolicyService`가 담당합니다.
- `InteractionService` 캐시(5분 TTL)는 변경 직후 즉시 반영되지 않을 수 있습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-12 | 컨트롤러 진입점을 `SecurityPolicyService`로 정렬 | codex |
| 2026-03-12 | 순수성 기준으로 단일 전달형은 `@cocrepo/service` 직접 주입으로 정리 | codex |
| 2026-03-13 | 컨트롤러 경계 의존성을 `SecurityPolicyFacade` 기준으로 갱신 | codex |
