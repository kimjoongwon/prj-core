# OIDC 클라이언트 Facade 기획서

> 생성일: 2026-03-12
> 타입: facade
> 위치: packages/be-facade/src/oidc-client.facade.ts

## 역할

OIDC 클라이언트 CRUD API의 controller boundary를 담당하고,
목록 조회 시 페이지 메타를 조립합니다.

## 의존성

| 의존성 | 역할 |
|--------|------|
| `OidcClientService` | OIDC 클라이언트 CRUD 및 활성/비활성 상태 처리 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| getMany | 목록 조회 + 페이지 메타 계산 |
| getById | 상세 조회 |
| create | 신규 등록 |
| update | 정보 수정 |
| remove | 삭제 |
| toggleActive | 활성/비활성 토글 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-12 | 새 spec 생성 | codex |
| 2026-03-13 | `@cocrepo/app`에서 `@cocrepo/facade`로 이관 | codex |
