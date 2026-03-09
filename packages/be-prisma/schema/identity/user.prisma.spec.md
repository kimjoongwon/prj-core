# user.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/identity/user.prisma

## 역할

사용자 도메인의 계정, 프로필, 사용자-공간/권한 연결에 필요한 모델을 정의합니다.
인증 이후 사용자 컨텍스트를 안정적으로 조회/검증할 수 있는 스키마 기반을 제공합니다.

## 운영 규칙

- `user.prisma` 변경 시 `user.prisma.spec.md`를 함께 갱신합니다.
- 사용자 식별자/관계 변경 시 auth/space/role 연계 영향 범위를 함께 기록합니다.
- 주석 메타데이터(`@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`, `@relation-pattern`, `@ownership`, `@scope`, `@join-role`, `@description`, `/// @displayName`)를 유지합니다.
- 모델 주석 메타데이터는 `@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`와 보조 태그(`@relation-pattern`, `@ownership`, `@scope`, `@join-role`) 체계를 함께 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 파일 대표 모델과 실제 aggregate root를 `@schema-owner: true` / `@aggregate-root: true`로 분리 | codex |
| 2026-03-10 | 스키마 파일을 도메인 폴더 구조로 재배치하고 sidecar 위치 메타데이터를 갱신 | codex |
| 2026-03-10 | 모델 주석 분류를 주 역할(`@schema-type`)과 보조 태그 체계로 개편 | codex |
| 2026-03-06 | 미사용 템플릿 실행 도메인 relation 제거 | codex |
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |
