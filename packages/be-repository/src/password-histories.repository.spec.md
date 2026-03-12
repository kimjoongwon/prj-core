# PasswordHistories Repository 기획서

> 생성일: 2026-03-11
> 수정일: 2026-03-11
> 타입: repository

## 역할

PasswordHistory 모델의 데이터 접근을 담당합니다. 사용자별 히스토리 조회 및 정리 기능을 제공합니다.

## 엔티티

- **대상 Entity**: PasswordHistory (`@cocrepo/entity`)
- **Prisma 모델**: `passwordHistory`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findById(id)` | string | `Promise<PasswordHistory \| null>` | ID로 단건 조회 |
| `findByUserId(userId)` | string | `Promise<PasswordHistory[]>` | 사용자별 이력 목록 조회 |
| `findLatestByUserId(userId)` | string | `Promise<PasswordHistory \| null>` | 사용자 최신 이력 조회 |
| `findMany(params)` | 필터/정렬/페이징 | `Promise<{ items: PasswordHistory[]; totalCount: number }>` | 다건 조회 |
| `create(data)` | Prisma.PasswordHistoryUncheckedCreateInput | `Promise<PasswordHistory>` | 이력 생성 |
| `deleteById(id)` | string | `Promise<PasswordHistory>` | ID 기반 삭제 |
| `deleteByUserId(userId)` | string | `Promise<{ count: number }>` | 사용자 전체 이력 삭제 |

## 구현 체크리스트

- [x] password-histories.repository.ts
- [x] 사용자별 최신 이력 조회 지원
- [x] bulk 삭제(deleteByUserId) 지원

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | schema-owner 기준 누락 레포(PasswordHistory) 신규 생성 | codex |

