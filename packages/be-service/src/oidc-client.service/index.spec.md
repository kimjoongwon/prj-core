# OidcClients Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/oidc-client.service/index.ts

## 역할

OIDC(OpenID Connect) 클라이언트 애플리케이션을 관리합니다.
클라이언트 ID 중복 검사, 활성/비활성 토글, 소프트 삭제 등을 처리합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `OidcClientsRepository` | OIDC 클라이언트 CRUD |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getMany` | `query: QueryOidcClientDto` | `Promise<{data, totalCount}>` | OIDC 클라이언트 목록 조회 |
| `getById` | `id: string` | `Promise<OidcClient>` | OIDC 클라이언트 상세 조회 |
| `create` | `params: {...}` | `Promise<OidcClient>` | OIDC 클라이언트 생성 |
| `update` | `id: string, params: {...}` | `Promise<OidcClient>` | OIDC 클라이언트 수정 |
| `remove` | `id: string` | `Promise<void>` | OIDC 클라이언트 소프트 삭제 |
| `toggleActive` | `id: string` | `Promise<OidcClient>` | 활성/비활성 토글 |

## 비즈니스 규칙

- `removedAt: null` 필터로 소프트 삭제된 클라이언트 제외
- 신규 생성 시 `isActive: true`로 자동 설정
- clientId는 전역 unique 제약

## create 파라미터

| 필드 | 필수 | 설명 |
|------|------|------|
| clientId | 필수 | OIDC 클라이언트 ID |
| clientSecret | 선택 | 클라이언트 시크릿 |
| clientName | 필수 | 표시 이름 |
| redirectUris | 필수 | 허용된 리다이렉트 URI 목록 |
| grantTypes | 필수 | 허용된 grant type 목록 |
| responseTypes | 필수 | 허용된 response type 목록 |
| tokenEndpointAuthMethod | 필수 | 토큰 엔드포인트 인증 방식 |
| scope | 필수 | 허용된 scope 목록 |

## 에러 처리

| 에러 상황 | 에러 타입 | 메시지 |
|----------|-----------|--------|
| 클라이언트 없음 | `NotFoundException` | "OIDC 클라이언트를 찾을 수 없습니다" |
| clientId 중복 | `ConflictException` | "이미 존재하는 Client ID입니다" |

## 권한 요구사항

- IDP 관리자 전용 (FULL_ACCESS 역할 필요)

## 구현 체크리스트

- [x] oidc-client.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-13 | `oidc-client.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
