# OIDC 세션 Facade 기획서

> 생성일: 2026-03-12
> 타입: facade
> 위치: packages/be-facade/src/oidc-session.facade.ts

## 역할

Redis 기반 OIDC 세션/토큰 조회 및 폐기 API의 controller boundary를 담당하고,
목록 조회 시 페이지 메타를 조립합니다.

## 의존성

| 의존성 | 역할 |
|--------|------|
| `OidcSessionService` | 세션 목록 조회, 통계 조회, 폐기 처리 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| getMany | 세션 목록 조회 + 페이지 메타 계산 |
| getStats | 통계 조회 |
| revokeByKey | 단일 폐기 |
| revokeAll | 전체 폐기 |
| revokeByGrantId | Grant 기반 일괄 폐기 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-12 | 새 spec 생성 | codex |
| 2026-03-13 | `@cocrepo/app`에서 `@cocrepo/facade`로 이관 | codex |
