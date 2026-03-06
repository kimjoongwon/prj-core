# ai-form.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/ai-form.prisma

## 역할

AI Form 도메인의 폼 스키마/필드/실행 맥락 관련 모델을 정의합니다.
폼 구성 데이터와 실행 이력을 일관된 관계로 관리하도록 스키마 기준을 제공합니다.

## 운영 규칙

- `ai-form.prisma` 변경 시 `ai-form.prisma.spec.md`를 함께 갱신합니다.
- 모델 주석(`@schema-type`, `@description`)과 노출명(`/// @displayName`)을 유지합니다.
- 폼 구조 변경 시 DTO/Entity/Service 영향 범위를 함께 기록합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |

