# ability.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/ability.prisma

## 역할

재사용 가능한 권한 정의 Ability를 관리합니다.

## 운영 규칙

- `ability.prisma` 변경 시 `ability.prisma.spec.md`를 함께 갱신합니다.
- Subject/Action 참조 및 Grant 연결 무결성을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용으로 grant.prisma에서 Ability 도메인 분리 | codex |

