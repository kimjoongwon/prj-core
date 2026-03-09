# password-history.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/password-history.prisma

## 역할

비밀번호 재사용 방지를 위한 PasswordHistory 모델을 정의합니다.

## 운영 규칙

- `password-history.prisma` 변경 시 `password-history.prisma.spec.md`를 함께 갱신합니다.
- User 연계 삭제 정책(onDelete: Cascade)을 일관되게 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용으로 auth.prisma에서 비밀번호 이력 도메인 분리 | codex |

