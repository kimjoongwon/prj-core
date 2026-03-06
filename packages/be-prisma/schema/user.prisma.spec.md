# user.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/user.prisma

## 역할

사용자 도메인의 계정, 프로필, 사용자-공간/권한 연결에 필요한 모델을 정의합니다.
인증 이후 사용자 컨텍스트를 안정적으로 조회/검증할 수 있는 스키마 기반을 제공합니다.

## 운영 규칙

- `user.prisma` 변경 시 `user.prisma.spec.md`를 함께 갱신합니다.
- 사용자 식별자/관계 변경 시 auth/space/role 연계 영향 범위를 함께 기록합니다.
- 주석 표준(`@schema-type`, `@description`, `/// @displayName`)을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 미사용 템플릿 실행 도메인 relation 제거 | codex |
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |
