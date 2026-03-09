# oidc-model.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/oidc-model.prisma

## 역할

oidc-provider 토큰/세션 저장소 모델(OidcModel)을 정의합니다.

## 운영 규칙

- `oidc-model.prisma` 변경 시 `oidc-model.prisma.spec.md`를 함께 갱신합니다.
- modelType/expiry 관련 인덱스와 키 유일성 규칙을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용으로 oidc.prisma에서 저장소 도메인 분리 | codex |

