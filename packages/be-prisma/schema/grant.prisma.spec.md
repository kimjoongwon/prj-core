# grant.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/grant.prisma

## 역할

권한 도메인(Subject, Action, Ability, Grant)의 핵심 모델과 관계를 정의합니다.
권한 부여와 검증에 필요한 참조/연결 구조를 스키마 차원에서 표준화합니다.

## 운영 규칙

- `grant.prisma` 변경 시 `grant.prisma.spec.md`를 함께 갱신합니다.
- 권한 체계 변경은 Role/Policy 연동 영향을 함께 명시합니다.
- 주석 표준(`@schema-type`, `@description`, `/// @displayName`)을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용: Subject/Action/Ability를 별도 파일로 분리하고 grant.prisma는 Grant만 유지 | codex |
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |
