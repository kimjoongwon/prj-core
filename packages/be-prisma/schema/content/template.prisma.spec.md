# template.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/content/template.prisma

## 역할

템플릿 도메인의 본문/변수/적용 규칙 관련 모델을 정의합니다.
템플릿 생성·수정·적용 흐름에서 재사용 가능한 데이터 구조를 보장합니다.

## 운영 규칙

- `template.prisma` 변경 시 `template.prisma.spec.md`를 함께 갱신합니다.
- 템플릿 필드 구조 변경 시 프론트/DTO 계약 영향을 함께 기록합니다.
- 주석 메타데이터(`@aggregate-root: true`, `@schema-type`, `@relation-pattern`, `@ownership`, `@scope`, `@join-role`, `@description`, `/// @displayName`)를 유지합니다.
- 모델 주석 메타데이터는 `@aggregate-root: true`, `@schema-type`와 보조 태그(`@relation-pattern`, `@ownership`, `@scope`, `@join-role`) 체계를 함께 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 스키마 파일을 도메인 폴더 구조로 재배치하고 sidecar 위치 메타데이터를 갱신 | codex |
| 2026-03-10 | 모델 주석 분류를 주 역할(`@schema-type`)과 보조 태그 체계로 개편 | codex |
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |

