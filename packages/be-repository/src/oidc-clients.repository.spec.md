# OidcClients Repository 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: repository
> 위치: packages/be-repository/src/oidc-clients.repository.ts

## 역할

OIDC 클라이언트(OidcClient) 엔티티의 데이터 접근을 담당합니다. OAuth2/OIDC 프로토콜에서 클라이언트 애플리케이션 정보를 관리합니다. clientId(OIDC 표준 식별자)와 내부 ID 두 가지 방식으로 조회를 지원합니다.

## 엔티티

- **대상 Entity**: OidcClient (`@cocrepo/entity`)
- **Prisma 모델**: `oidcClient`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findById(id)` | string | `Promise<OidcClient \| null>` | 내부 UUID로 조회 |
| `findByIdOrThrow(id)` | string | `Promise<OidcClient>` | 내부 UUID로 조회 (없으면 에러) |
| `findByClientId(clientId)` | string | `Promise<OidcClient \| null>` | OIDC clientId(unique)로 조회 |
| `findMany(params)` | where, orderBy, skip?, take? | `Promise<{ data: OidcClient[], totalCount: number }>` | 페이지네이션 목록 조회 |
| `create(data)` | Prisma.OidcClientUncheckedCreateInput | `Promise<OidcClient>` | 생성 |
| `updateById(id, data)` | string, Prisma.OidcClientUncheckedUpdateInput | `Promise<OidcClient>` | ID로 수정 |
| `removeById(id)` | string | `Promise<OidcClient>` | 소프트 삭제 (removedAt + isActive: false) |

## 쿼리 최적화

- `findMany()`: `Promise.all()`로 데이터와 totalCount 동시 조회
- `findMany()` 내부에서 `removedAt: null` 조건 자동 추가 (where spread + 오버라이드)

## 삭제 정책

- **소프트 삭제**: `removeById()` → `removedAt: new Date(), isActive: false` 함께 설정
- 물리 삭제 메서드 없음

## 구현 체크리스트

- [x] oidc-clients.repository.ts
- [x] @Injectable() 데코레이터
- [x] TransactionHost 의존성 주입
- [x] plainToInstance 변환

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
