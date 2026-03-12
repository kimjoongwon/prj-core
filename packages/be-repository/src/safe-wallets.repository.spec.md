# SafeWallets Repository 기획서

> 생성일: 2026-03-11
> 수정일: 2026-03-11
> 타입: repository
> 위치: packages/be-repository/src/safe-wallets.repository.ts

## 역할

SafeWallet 모델의 데이터 접근을 담당합니다. Space/주소 기반 조회, 트랜잭션 포함 조회, CRUD를 제공합니다.

## 엔티티

- **대상 타입**: `SafeWallet` (`@cocrepo/prisma`)
- **Prisma 모델**: `safeWallet`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findById(id)` | string | `Promise<SafeWallet \| null>` | ID로 단건 조회 |
| `findByIdWithTransactions(id)` | string | `Promise<SafeWallet \| null>` | 트랜잭션/서명 포함 조회 |
| `findByAddress(address)` | string | `Promise<SafeWallet \| null>` | 주소로 조회 |
| `findBySpaceId(spaceId)` | string | `Promise<SafeWallet[]>` | Space별 지갑 목록 조회 |
| `findMany(params)` | 필터/정렬/페이징 | `Promise<{ wallets: SafeWallet[]; totalCount: number }>` | 다건 조회 |
| `create(data)` | Prisma.SafeWalletUncheckedCreateInput | `Promise<SafeWallet>` | 지갑 생성 |
| `updateById(id, data)` | string, Prisma.SafeWalletUncheckedUpdateInput | `Promise<SafeWallet>` | ID 기반 수정 |
| `removeById(id)` | string | `Promise<SafeWallet>` | ID 기반 삭제 |

## 구현 체크리스트

- [x] safe-wallets.repository.ts
- [x] 트랜잭션/confirmations include 조회 지원
- [x] Prisma `safeWallet` modelAccessor 기반 CRUD 적용

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | schema-owner 기준 누락 레포(SafeWallet) 신규 생성 | codex |

