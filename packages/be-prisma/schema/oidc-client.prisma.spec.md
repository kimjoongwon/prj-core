# oidc-client.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/oidc-client.prisma

## 역할

OIDC 클라이언트 애플리케이션 등록 정보를 정의합니다.

## 운영 규칙

- `oidc-client.prisma` 변경 시 `oidc-client.prisma.spec.md`를 함께 갱신합니다.
- redirectUris/grantTypes/responseTypes 계약을 변경할 때 IDP 영향 범위를 명시합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용으로 oidc.prisma에서 클라이언트 도메인 분리 | codex |

