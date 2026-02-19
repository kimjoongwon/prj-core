# AuthAuditLogs Repository 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: repository
> 위치: packages/be-repository/src/auth-audit-logs.repository.ts

## 역할

인증 감사 로그(AuthAuditLog) 엔티티의 데이터 접근을 담당합니다. 로그인 시도, 성공/실패, 토큰 갱신 등 인증 관련 이벤트를 기록하고 조회합니다. 보안 감사 및 이상 행동 탐지에 활용됩니다.

## 엔티티

- **대상 Entity**: AuthAuditLog (`@cocrepo/entity`)
- **Prisma 모델**: `authAuditLog`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findMany(params)` | where, orderBy, skip, take | `Promise<{ logs: AuthAuditLog[], totalCount: number }>` | 필터링 + 페이지네이션 목록 조회 |
| `count(where)` | Prisma.AuthAuditLogWhereInput | `Promise<number>` | 조건별 건수 조회 |
| `findByUserId(userId, limit)` | string, number | `Promise<AuthAuditLog[]>` | 특정 사용자의 최근 인증 로그 조회 |

## 쿼리 최적화

- `findMany()`: `Promise.all()`로 데이터와 totalCount를 동시 조회
- `findByUserId()`: `{ createdAt: "desc" }` 최신순 정렬 + limit으로 개수 제한
- 생성(create) 메서드 없음 - 로그는 Service 계층에서 Prisma를 통해 직접 생성

## 특이사항

- **읽기 전용 성격**: 로그는 쓰기(create)가 직접 노출되지 않음. 조회 중심의 Repository
- **삭제 없음**: 감사 로그는 삭제하지 않음 (법적 요구사항)
- **페이지네이션 지원**: `findMany()`에서 skip/take 기반 페이지네이션

## 구현 체크리스트

- [x] auth-audit-logs.repository.ts
- [x] @Injectable() 데코레이터
- [x] TransactionHost 의존성 주입
- [x] plainToInstance 변환

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
