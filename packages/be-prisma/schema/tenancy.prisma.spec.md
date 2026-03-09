# tenancy.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/tenancy.prisma

## 역할

Tenant/Assignment를 통해 User-Space-Role 연결을 관리하는 테넌시 도메인을 정의합니다.

## 운영 규칙

- `tenancy.prisma` 변경 시 `tenancy.prisma.spec.md`를 함께 갱신합니다.
- 테넌시 브리지의 참조 무결성(User/Space/Role)을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용으로 core.prisma에서 tenancy 도메인 분리 | codex |

