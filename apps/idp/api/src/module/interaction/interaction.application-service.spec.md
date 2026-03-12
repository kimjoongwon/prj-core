# Interaction ApplicationService 기획서

> 생성일: 2026-03-12
> 수정일: 2026-03-12
> 타입: application-service
> 위치: apps/idp/api/src/module/interaction/interaction.application-service.ts

## 역할

InteractionController와 OIDC interaction 도메인 비즈니스 로직을 오케스트레이션합니다.
컨트롤러는 HTTP 파싱/응답 규격 책임만 담당하고, 유즈케이스 호출은 이 레이어로 위임합니다.

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `InteractionService` | 사용자 인증, interaction 조회, 로그인/동의/취소 처리 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| `getInteractionDetails` | interaction 세부정보 조회 |
| `findClient` | oidc client 정보 조회 |
| `validateUser` | 사용자 인증 및 잠금/실패 처리 |
| `completeLogin` | 로그인 완료 처리 후 redirect 결과 반환 |
| `processConsent` | 동의 처리 결과 반환 |
| `abortInteraction` | 인터랙션 중단 결과 반환 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-12 | InteractionController 직접 주입 규칙 정리로 InteractionApplicationService 신규 생성 | codex |
