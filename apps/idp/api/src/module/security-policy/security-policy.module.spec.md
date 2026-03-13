# Security Policy Module 기획서

> 생성일: 2026-03-03
> 타입: module
> 위치: apps/idp/api/src/module/security-policy/security-policy.module.ts

## 역할

`SecurityPolicyController`가 `SecurityPolicyFacade`를 주입받도록 facade/service/repository provider를 조합합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| SecurityPolicyFacade | Controller boundary 유즈케이스 및 응답 조립 |
| SecurityPolicyService | 보안 정책 도메인 규칙 및 변경 처리 |
| Security policy repository provider | 보안 정책 영속성 접근 |

## exports

| export | 설명 |
|--------|------|
| SecurityPolicyFacade | 다른 모듈이 참조할 수 있는 Security Policy boundary 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-12 | 컨트롤러를 `SecurityPolicyService` 기반으로 변경 | codex |
| 2026-03-12 | `module` 체크리스트를 `@cocrepo/service` 직접 주입 정합성 기준으로 갱신 | codex |
| 2026-03-13 | SecurityPolicyModule boundary provider/export를 `SecurityPolicyFacade` 기준으로 갱신 | codex |
