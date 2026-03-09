# security-policy.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/security-policy.prisma

## 역할

보안 정책 루트 엔티티(`SecurityPolicy`)를 관리합니다.

## 운영 규칙

- `security-policy.prisma` 변경 시 `security-policy.prisma.spec.md`를 함께 갱신합니다.
- 정책 필드 변경 시 인증/토큰 정책 영향 범위를 명시합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용으로 auth.prisma에서 정책/화이트리스트 도메인 분리 | codex |
| 2026-03-09 | WhitelistEntry/WhitelistType을 whitelist-entry.prisma로 분리하고 security-policy는 루트 모델만 유지 | codex |
