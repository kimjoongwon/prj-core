# OIDC ApplicationService 기획서

> 생성일: 2026-03-12
> 수정일: 2026-03-12
> 타입: application-service
> 위치: apps/idp/api/src/module/oidc/oidc.application-service.ts

## 역할

OidcController에서 `/oidc/*` 요청을 수신했을 때 OIDC provider callback 위임을 담당합니다.
요청 경로 정규화(`/oidc` prefix 제거)까지 포함해 controller는 단순 패스스루 책임만 유지합니다.

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `OidcProviderService` | oidc-provider 인스턴스 획득 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| `handleOidc` | `/oidc/*` 요청을 oidc-provider callback으로 위임 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-12 | OidcController 직접 주입 정리를 위한 OidcApplicationService 신규 생성 | codex |
