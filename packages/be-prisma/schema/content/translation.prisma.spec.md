# translation.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/content/translation.prisma

## 역할

번역 도메인의 리소스 키/언어별 값/버전 관련 모델을 정의합니다.
다국어 메시지의 일관성과 추적성을 보장하기 위한 스키마 기준을 제공합니다.

## 운영 규칙

- `translation.prisma` 변경 시 `translation.prisma.spec.md`를 함께 갱신합니다.
- 번역 키 구조 변경 시 API 응답/프론트 사용처 영향 범위를 함께 기록합니다.
- 주석 메타데이터(`@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`, `@relation-pattern`, `@ownership`, `@scope`, `@join-role`, `@description`, `/// @displayName`)를 유지합니다.
- 모델 주석 메타데이터는 `@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`와 보조 태그(`@relation-pattern`, `@ownership`, `@scope`, `@join-role`) 체계를 함께 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 파일 대표 모델과 실제 aggregate root를 `@schema-owner: true` / `@aggregate-root: true`로 분리 | codex |
| 2026-03-10 | 스키마 파일을 도메인 폴더 구조로 재배치하고 sidecar 위치 메타데이터를 갱신 | codex |
| 2026-03-10 | 모델 주석 분류를 주 역할(`@schema-type`)과 보조 태그 체계로 개편 | codex |
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |

