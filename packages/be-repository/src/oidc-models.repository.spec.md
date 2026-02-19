# OidcModels Repository 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: repository
> 위치: packages/be-repository/src/oidc-models.repository.ts

## 역할

OIDC 세션/토큰 모델(OidcModel) 엔티티의 데이터 접근을 담당합니다. `oidc-provider` 라이브러리의 Adapter 패턴 구현체로, Authorization Code, Access Token, Refresh Token, Session 등 OIDC 프로토콜의 임시 데이터를 저장합니다. key 필드를 unique identifier로 사용합니다.

## 엔티티

- **대상 Entity**: OidcModel (`@cocrepo/entity`)
- **Prisma 모델**: `oidcModel`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findByKey(key)` | string | `Promise<OidcModel \| null>` | key(unique)로 조회 |
| `findByKeyOrThrow(key)` | string | `Promise<OidcModel>` | key로 조회 (없으면 에러) |
| `findMany(params)` | where, orderBy?, skip?, take? | `Promise<{ data: OidcModel[], totalCount: number }>` | 페이지네이션 목록 조회 |
| `findManyByGrantId(grantId)` | string | `Promise<OidcModel[]>` | Grant ID로 연관 모델 일괄 조회 |
| `deleteByKey(key)` | string | `Promise<void>` | key로 물리 삭제 |
| `deleteManyByGrantId(grantId)` | string | `Promise<number>` | Grant ID로 연관 모델 일괄 물리 삭제 |

## 쿼리 최적화

- `findMany()`: `Promise.all()`로 데이터와 totalCount 동시 조회
- `findMany()` 기본 정렬: `{ createdAt: "desc" }`

## 특이사항

- **oidc-provider Adapter**: 이 Repository는 `oidc-provider` 라이브러리의 데이터 저장소 역할을 합니다
- **소프트 삭제 없음**: OIDC 토큰/세션은 만료 후 물리 삭제
- **key 기반**: OIDC 표준에 따라 key를 primary identifier로 사용
- **grantId**: OIDC Authorization Grant와 연관된 여러 토큰을 묶어 일괄 처리

## 삭제 정책

- **물리 삭제**: `deleteByKey()`, `deleteManyByGrantId()`
- 소프트 삭제 없음 (OIDC 프로토콜 특성상 만료된 토큰은 완전 삭제)

## 구현 체크리스트

- [x] oidc-models.repository.ts
- [x] @Injectable() 데코레이터
- [x] TransactionHost 의존성 주입
- [x] plainToInstance 변환

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
