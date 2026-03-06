# oidc.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/oidc.prisma

## 역할

OIDC 도메인의 클라이언트/세션/정책 관련 모델을 정의합니다.
IDP 인증 흐름에서 필요한 식별자, 설정, 연결 관계를 스키마로 관리합니다.

## 운영 규칙

- `oidc.prisma` 변경 시 `oidc.prisma.spec.md`를 함께 갱신합니다.
- OIDC 계약 변경 시 API/IDP 연동 영향 범위를 함께 기록합니다.
- 주석 표준(`@schema-type`, `@description`, `/// @displayName`)을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |

