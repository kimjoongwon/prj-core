# template.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/template.prisma

## 역할

템플릿 도메인의 본문/변수/적용 규칙 관련 모델을 정의합니다.
템플릿 생성·수정·적용 흐름에서 재사용 가능한 데이터 구조를 보장합니다.

## 운영 규칙

- `template.prisma` 변경 시 `template.prisma.spec.md`를 함께 갱신합니다.
- 템플릿 필드 구조 변경 시 프론트/DTO 계약 영향을 함께 기록합니다.
- 주석 표준(`@schema-type`, `@description`, `/// @displayName`)을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |

