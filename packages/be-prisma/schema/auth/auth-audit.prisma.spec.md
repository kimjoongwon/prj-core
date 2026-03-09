# auth-audit.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/auth/auth-audit.prisma

## 역할

인증 감사 로그(AuthAuditLog)와 감사 결과 enum(AuthAuditResult)을 정의합니다.

## 운영 규칙

- `auth-audit.prisma` 변경 시 `auth-audit.prisma.spec.md`를 함께 갱신합니다.
- 감사 로그 필드는 보안 포렌식 용도를 고려해 변경 시 영향 범위를 명시합니다.
- `AuthAuditLog`는 파일 대표 모델이므로 `@schema-owner: true`를 가지지만, 의존 로그이므로 `@aggregate-root: true`를 두지 않습니다.
- 모델 주석 메타데이터는 `@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`와 보조 태그(`@relation-pattern`, `@ownership`, `@scope`, `@join-role`) 체계를 함께 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 파일 대표 모델과 실제 aggregate root를 `@schema-owner: true` / `@aggregate-root: true`로 분리 | codex |
| 2026-03-10 | 스키마 파일을 도메인 폴더 구조로 재배치하고 sidecar 위치 메타데이터를 갱신 | codex |
| 2026-03-10 | 모델 주석 분류를 주 역할(`@schema-type`)과 보조 태그 체계로 개편 | codex |
| 2026-03-09 | strict aggregate-root 분할 적용으로 auth.prisma에서 감사 로그 도메인 분리 | codex |
