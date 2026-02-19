# OidcModel Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/oidc-model.entity.ts

## 역할

OIDC Provider(node-oidc-provider 등)에서 인증 흐름 중 임시로 저장되는 모델 데이터(토큰, 인가 코드, DeviceCode 등)를 관리하는 엔티티입니다. AbstractEntity를 상속하지 않고 독립적으로 구현되며, OIDC 표준 데이터 저장소 역할을 합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| key | string | required, unique | - | OIDC 모델 키 |
| modelType | string | required | - | 모델 유형 (AccessToken, AuthorizationCode, DeviceCode 등) |
| payload | JsonValue | required | - | 모델 페이로드 (JSON) |
| expiresAt | Date \| null | nullable | null | 만료 일시 |
| userCode | string \| null | nullable | null | Device Authorization Flow용 사용자 코드 |
| grantId | string \| null | nullable | null | 인가 ID |
| uid | string \| null | nullable | null | 고유 식별자 (OIDC 내부용) |

## Enum

해당 없음

## 관계

해당 없음

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isExpired() | boolean | 만료 여부 확인 (expiresAt이 현재 시각 이전이면 true) |

## 비즈니스 규칙

- OIDC Provider 어댑터(Adapter)가 이 테이블에 데이터를 저장합니다.
- `modelType`에 따라 AccessToken, RefreshToken, AuthorizationCode, DeviceCode 등이 저장됩니다.
- `expiresAt`이 null이면 만료되지 않는 토큰입니다.
- `removedAt` 필드가 없어 소프트 삭제를 지원하지 않습니다.
- 만료된 레코드는 주기적으로 정리(cleanup)되어야 합니다.

## 구현 체크리스트

- [x] oidc-model.entity.ts
- [x] AbstractEntity 미상속 (독립 구현)
- [x] Prisma OidcModelEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
