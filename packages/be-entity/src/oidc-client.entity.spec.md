# OidcClient Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-03-28
> 타입: entity
> 위치: packages/be-entity/src/oidc-client.entity.ts

## 역할

OpenID Connect(OIDC) 클라이언트 애플리케이션 정보를 관리하는 엔티티입니다. OAuth2/OIDC 프로토콜에 따라 클라이언트 ID, 시크릿, 리다이렉트 URI, 허용 Grant 유형, 응답 유형 등을 정의합니다. Public 클라이언트와 Confidential 클라이언트를 구분하는 도메인 메서드를 제공합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| clientId | string | required, unique | - | OAuth2 클라이언트 ID |
| clientSecret | string \| null | nullable | null | OAuth2 클라이언트 시크릿 (Public 클라이언트는 null) |
| name | string | required | - | 클라이언트 애플리케이션 이름 |
| redirectUris | string[] | required | [] | 허용된 리다이렉트 URI 목록 |
| grantTypes | string[] | required | [] | 허용된 Grant 유형 목록 |
| responseTypes | string[] | required | [] | 허용된 응답 유형 목록 |
| tokenEndpointAuthMethod | string | required | - | 토큰 엔드포인트 인증 방식 ('none': Public, 그 외: Confidential) |
| scope | string | required | - | 허용된 스코프 목록 |
| isActive | boolean | required | - | 활성화 여부 |
| logoUri | string \| null | nullable | null | 로고 URI |
| policyUri | string \| null | nullable | null | 개인정보처리방침 URI |
| tosUri | string \| null | nullable | null | 서비스 이용약관 URI |

## Enum

해당 없음

## 관계

해당 없음

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isPublicClient() | boolean | Public 클라이언트 여부 확인 (tokenEndpointAuthMethod === "none") |
| isConfidentialClient() | boolean | Confidential 클라이언트 여부 확인 |

## 비즈니스 규칙

- `tokenEndpointAuthMethod === "none"`이면 Public 클라이언트로 `clientSecret`이 없습니다.
- `tokenEndpointAuthMethod !== "none"`이면 Confidential 클라이언트로 `clientSecret`이 필요합니다.
- `redirectUris`에 등록된 URI만 인증 후 리다이렉션이 허용됩니다.
- `isActive=false`이면 해당 클라이언트로의 로그인이 차단됩니다.
- `scope`는 공백으로 구분된 스코프 문자열입니다 (예: "openid profile email").

## 구현 체크리스트

- [x] oidc-client.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma OidcClientEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-28 | OIDC 클라이언트 표시 필드명을 name으로 정리하고 관련 계약을 동기화 | codex |
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
