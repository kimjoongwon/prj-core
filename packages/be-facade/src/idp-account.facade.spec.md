# IDP 계정 Facade 기획서

> 생성일: 2026-03-12
> 타입: facade
> 위치: packages/be-facade/src/idp-account.facade.ts

## 역할

IDP 계정 목록/상세/활성상태/보안 리셋 API의 controller boundary를 담당합니다.
`IdpAccountService` 결과에 페이지 메타를 조립해 외부 응답 계약으로 노출합니다.

## 의존성

| 의존성 | 역할 |
|--------|------|
| `IdpAccountService` | 계정 조회, 토글, 실패 횟수 초기화 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| getMany | 목록 조회 + 페이지 메타 계산 |
| getById | 계정 상세 조회 |
| toggleActive | 활성/비활성 토글 |
| resetFailedAttempts | 로그인 실패 횟수 초기화 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-12 | 새 spec 생성 | codex |
| 2026-03-13 | `@cocrepo/app`에서 `@cocrepo/facade`로 이관 | codex |
