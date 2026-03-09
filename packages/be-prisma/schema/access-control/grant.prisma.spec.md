# grant.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/access-control/grant.prisma

## 역할

권한 도메인(Subject, Action, Ability, Grant)의 핵심 모델과 관계를 정의합니다.
권한 부여와 검증에 필요한 참조/연결 구조를 스키마 차원에서 표준화합니다.

## 운영 규칙

- `grant.prisma` 변경 시 `grant.prisma.spec.md`를 함께 갱신합니다.
- 권한 체계 변경은 Role/Policy 연동 영향을 함께 명시합니다.
- 주석 메타데이터(`@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`, `@relation-pattern`, `@ownership`, `@scope`, `@join-role`, `@description`, `/// @displayName`)를 유지합니다.
- 모델 주석 메타데이터는 `@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`와 보조 태그(`@relation-pattern`, `@ownership`, `@scope`, `@join-role`) 체계를 함께 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 파일 대표 모델과 실제 aggregate root를 `@schema-owner: true` / `@aggregate-root: true`로 분리 | codex |
| 2026-03-10 | 스키마 파일을 도메인 폴더 구조로 재배치하고 sidecar 위치 메타데이터를 갱신 | codex |
| 2026-03-10 | 모델 주석 분류를 주 역할(`@schema-type`)과 보조 태그 체계로 개편 | codex |
| 2026-03-09 | strict aggregate-root 분할 적용: Subject/Action/Ability를 별도 파일로 분리하고 grant.prisma는 Grant만 유지 | codex |
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |
