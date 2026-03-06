# auth.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/auth.prisma

## 역할

인증/보안 도메인의 정책, 인증 관련 엔티티, 감사 로그 모델을 정의합니다.
보안 설정과 인증 이벤트 추적을 일관된 스키마 규칙으로 관리합니다.

## 운영 규칙

- `auth.prisma` 변경 시 `auth.prisma.spec.md`를 함께 갱신합니다.
- 보안 정책 모델 변경 시 서비스 권한/검증 로직 영향 범위를 명시합니다.
- 주석 표준(`@schema-type`, `@description`, `/// @displayName`)을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |

