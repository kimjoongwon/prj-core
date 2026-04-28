# InteractionService

## 목적

OIDC interaction 흐름에서 provider 접근을 캡슐화하고, controller/facade가 사용하는 interaction 조회와 완료 처리를 제공합니다.

## 책임

| 항목 | 설명 |
|------|------|
| interaction 조회 | `provider.interactionDetails(req, res)`로 현재 interaction 상태를 조회합니다. |
| client 조회 | `provider.Client.find(clientId)` 결과를 UI에 필요한 `OidcClientInfo`로 정규화합니다. |
| login 완료 | 인증 성공 결과를 `provider.interactionResult`에 전달하고 redirect URL을 반환합니다. |

## 의존성

| 의존성 | 용도 |
|--------|------|
| `OidcProviderService` | oidc-provider 인스턴스 획득 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | 미사용 logger 제거에 맞춰 service 책임과 의존성 계약 문서화 | codex |
