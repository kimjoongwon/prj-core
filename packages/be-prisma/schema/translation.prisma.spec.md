# translation.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/translation.prisma

## 역할

번역 도메인의 리소스 키/언어별 값/버전 관련 모델을 정의합니다.
다국어 메시지의 일관성과 추적성을 보장하기 위한 스키마 기준을 제공합니다.

## 운영 규칙

- `translation.prisma` 변경 시 `translation.prisma.spec.md`를 함께 갱신합니다.
- 번역 키 구조 변경 시 API 응답/프론트 사용처 영향 범위를 함께 기록합니다.
- 주석 표준(`@schema-type`, `@description`, `/// @displayName`)을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |

