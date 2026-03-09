# auth-audit.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/auth-audit.prisma

## 역할

인증 감사 로그(AuthAuditLog)와 감사 결과 enum(AuthAuditResult)을 정의합니다.

## 운영 규칙

- `auth-audit.prisma` 변경 시 `auth-audit.prisma.spec.md`를 함께 갱신합니다.
- 감사 로그 필드는 보안 포렌식 용도를 고려해 변경 시 영향 범위를 명시합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용으로 auth.prisma에서 감사 로그 도메인 분리 | codex |

