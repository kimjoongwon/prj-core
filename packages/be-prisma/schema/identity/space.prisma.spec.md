# space.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/identity/space.prisma

## 역할

Space 도메인의 공간 계층, 공간 구체화 모델(Ground 등), 공간 연결 관계를 정의합니다.
멀티 테넌시 공간 단위 접근 제어의 데이터 기반을 스키마 차원에서 유지합니다.

## 운영 규칙

- `space.prisma` 변경 시 `space.prisma.spec.md`를 함께 갱신합니다.
- 공간 분류/연결 변경 시 core/grant/user 도메인 영향 범위를 함께 기록합니다.
- 주석 메타데이터(`@aggregate-root: true`, `@schema-type`, `@relation-pattern`, `@ownership`, `@scope`, `@join-role`, `@description`, `/// @displayName`)를 유지합니다.
- 모델 주석 메타데이터는 `@aggregate-root: true`, `@schema-type`와 보조 태그(`@relation-pattern`, `@ownership`, `@scope`, `@join-role`) 체계를 함께 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 스키마 파일을 도메인 폴더 구조로 재배치하고 sidecar 위치 메타데이터를 갱신 | codex |
| 2026-03-10 | 모델 주석 분류를 주 역할(`@schema-type`)과 보조 태그 체계로 개편 | codex |
| 2026-03-06 | 미사용 AI Form Template 관계(aiFormTemplates, aiTemplateExecutions) 제거 | codex |
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |
