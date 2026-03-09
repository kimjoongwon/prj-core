# oidc-model.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/oidc/oidc-model.prisma

## 역할

oidc-provider 토큰/세션 저장소 모델(OidcModel)을 정의합니다.

## 운영 규칙

- `oidc-model.prisma` 변경 시 `oidc-model.prisma.spec.md`를 함께 갱신합니다.
- modelType/expiry 관련 인덱스와 키 유일성 규칙을 유지합니다.
- 모델 주석 메타데이터는 `@aggregate-root: true`, `@schema-type`와 보조 태그(`@relation-pattern`, `@ownership`, `@scope`, `@join-role`) 체계를 함께 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 스키마 파일을 도메인 폴더 구조로 재배치하고 sidecar 위치 메타데이터를 갱신 | codex |
| 2026-03-10 | 모델 주석 분류를 주 역할(`@schema-type`)과 보조 태그 체계로 개편 | codex |
| 2026-03-09 | strict aggregate-root 분할 적용으로 oidc.prisma에서 저장소 도메인 분리 | codex |

