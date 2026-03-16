# service.ts Mock Spec

## 목적
- `@cocrepo/app` 테스트에서 `@cocrepo/service` moduleNameMapper가 가리키는 최소 서비스 토큰 집합을 제공합니다.
- Nest TestingModule이 `AuthApplicationService` 같은 애플리케이션 서비스를 구성할 때 생성자 의존성 토큰이 `undefined`가 되지 않도록 유지합니다.

## 핵심 동작
- 각 mock 클래스는 테스트 코드의 `useValue` provider와 짝을 이루는 토큰 역할만 수행합니다.
- `AuthApplicationService` 생성자에서 참조하는 `AuthAuditLogService`를 포함해 인증 유즈케이스 테스트에 필요한 서비스 클래스를 export합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-16 | AuthApplicationService 생성자 확장에 맞춰 AuthAuditLogService mock 토큰 계약을 문서화 | codex |
