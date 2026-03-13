# Security Policy Facade 기획서

> 생성일: 2026-03-13
> 타입: facade
> 위치: packages/be-facade/src/security-policy.facade.ts

## 역할

보안 정책 controller가 조회/수정 진입점을 단일 facade로 호출하도록 boundary 조합을 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| SecurityPolicyFacade | 보안 정책 boundary 조합 진입점 |
| SecurityPolicyService | 보안 정책 조회/수정 도메인 서비스 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-13 | SecurityPolicyApplicationService를 facade로 이관 | codex |
