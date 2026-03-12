# Security Policy Controller 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: controller
> 위치: apps/idp-server/src/module/security-policy/security-policy.controller.ts

## 역할

시스템 보안 정책(비밀번호 복잡도, 계정 잠금 임계값, 잠금 시간 등)을 조회하고 수정하는 관리자 API를 제공합니다. `FULL_ACCESS` 권한이 필요하며, 단일 시스템 정책(`key: "default"`)을 관리합니다.

## 엔드포인트

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | / | 현재 시스템 보안 정책 조회 | FULL_ACCESS, SkipSpaceCheck |
| PATCH | / | 보안 정책 수정 (변경할 필드만 전달) | FULL_ACCESS, SkipSpaceCheck |

## 인증/인가

- 컨트롤러 레벨에서 `@Roles([SYSTEM_ROLES.FULL_ACCESS])`와 `@SkipSpaceCheck()` 적용
- 모든 엔드포인트는 `@ApiAuth()` 필요

## 요청/응답 DTO

| 엔드포인트 | 요청 DTO | 응답 DTO |
|-----------|----------|----------|
| GET / | - | `SecurityPolicyDto` |
| PATCH / | `UpdateSecurityPolicyDto` (Body, 부분 수정 가능) | `SecurityPolicyDto` |

### SecurityPolicyDto 주요 필드

| 필드 | 설명 |
|------|------|
| passwordMinLength | 비밀번호 최소 길이 |
| passwordRequireUppercase | 영문 대문자 필수 여부 |
| passwordRequireLowercase | 영문 소문자 필수 여부 |
| passwordRequireNumber | 숫자 필수 여부 |
| passwordRequireSpecial | 특수문자 필수 여부 |
| temporaryLockThreshold | 일시 잠금 임계 실패 횟수 |
| permanentLockThreshold | 영구 잠금 임계 실패 횟수 |
| temporaryLockDurationMin | 일시 잠금 지속 시간 (분) |

## 비즈니스 규칙

- 단일 레코드(`key: "default"`)를 읽고 씀
- PATCH는 Partial 업데이트 — 변경할 필드만 전달하면 됨
- 보안 정책 변경 시 `InteractionService` 캐시(5분 TTL)에 즉시 반영되지 않을 수 있음

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `SecurityPolicyService` | 보안 정책 조회 및 수정 로직 |

## 구현 체크리스트

- [x] security-policy.controller.ts
- [x] `@Controller()` 데코레이터
- [x] `@ApiTags("SECURITY_POLICY")` 태그 설정
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-12 | 컨트롤러 진입점을 `SecurityPolicyService`로 정렬 | codex |
| 2026-03-12 | 순수성 기준으로 단일 전달형은 `@cocrepo/service` 직접 주입으로 정리 | codex |
