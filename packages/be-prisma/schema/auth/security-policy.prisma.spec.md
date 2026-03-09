# security-policy.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/auth/security-policy.prisma

## 역할

보안 정책 루트 엔티티(`SecurityPolicy`)를 관리합니다.

## 운영 규칙

- `security-policy.prisma` 변경 시 `security-policy.prisma.spec.md`를 함께 갱신합니다.
- 정책 필드 변경 시 인증/토큰 정책 영향 범위를 명시합니다.
- 모델 주석 메타데이터는 `@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`와 보조 태그(`@relation-pattern`, `@ownership`, `@scope`, `@join-role`) 체계를 함께 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 파일 대표 모델과 실제 aggregate root를 `@schema-owner: true` / `@aggregate-root: true`로 분리 | codex |
| 2026-03-10 | 스키마 파일을 도메인 폴더 구조로 재배치하고 sidecar 위치 메타데이터를 갱신 | codex |
| 2026-03-10 | 모델 주석 분류를 주 역할(`@schema-type`)과 보조 태그 체계로 개편 | codex |
| 2026-03-09 | strict aggregate-root 분할 적용으로 auth.prisma에서 정책/화이트리스트 도메인 분리 | codex |
| 2026-03-09 | WhitelistEntry/WhitelistType을 whitelist-entry.prisma로 분리하고 security-policy는 루트 모델만 유지 | codex |
