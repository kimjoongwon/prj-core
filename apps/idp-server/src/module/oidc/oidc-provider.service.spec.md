# OIDC Provider Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: apps/idp-server/src/module/oidc/oidc-provider.service.ts

## 역할

oidc-provider 라이브러리 인스턴스의 생명주기를 관리합니다. 설정 빌드는 `OidcConfigurationService`에 위임하고, 인스턴스 초기화 및 이벤트 핸들러 등록을 담당합니다. NestJS 애플리케이션 부트스트랩 시 `initialize()`를 호출해야 합니다.

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `ConfigService` | OIDC issuer URL 환경 설정 조회 |
| `OidcConfigurationService` | oidc-provider 초기화용 설정 객체 빌드 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `initialize` | - | `Promise<void>` | oidc-provider 인스턴스 생성 및 이벤트 핸들러 등록 |
| `getProvider` | - | `OidcProviderInstance` | 초기화된 oidc-provider 인스턴스 반환 |
| `registerEventHandlers` (private) | - | `void` | server_error, authorization.error, grant.error 이벤트 핸들러 등록 |

## 비즈니스 규칙

### 초기화

- oidc-provider는 동적 import(`import("oidc-provider")`)로 로드 (ESM 호환)
- `OidcConfigurationService.buildConfiguration()`으로 설정 조회 후 issuer URL과 함께 인스턴스 생성
- 초기화 완료 시 로그 출력: `"OIDC Provider initialized"`

### 인스턴스 접근

- `getProvider()` 호출 시 `initialize()`가 완료되지 않았으면 `Error("OIDC Provider not initialized")` 발생
- 인스턴스는 싱글톤으로 유지 (`private provider: OidcProviderInstance | null`)

### 이벤트 핸들러

| 이벤트 | 처리 |
|--------|------|
| `server_error` | 스택 포함 error 레벨 로그 |
| `authorization.error` | error 레벨 로그 |
| `grant.error` | error 레벨 로그 |

## 구현 체크리스트

- [x] oidc-provider.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 앱 부트스트랩에서 `initialize()` 호출 등록
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
