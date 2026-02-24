# AuthAuditLog Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/auth-audit-log.service.ts

## 역할

로그인/인증 시도에 대한 감사 로그를 조회합니다.
감사 로그는 Space와 무관하므로 SpaceContext를 사용하지 않습니다.
오늘의 성공/실패/잠금 건수 통계를 제공합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `AuthAuditLogsRepository` | 감사 로그 조회 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getAuditLogs` | `query: QueryAuthAuditLogDto` | `Promise<GetAuditLogsResult>` | 감사 로그 목록 조회 (필터, 정렬, 페이지네이션) |
| `getRecentLogsByUserId` | `userId: string, limit = 10` | `Promise<...>` | 사용자별 최근 감사 로그 조회 |
| `getStats` | - | `Promise<AuditLogStats>` | 오늘 감사 로그 통계 조회 |

## 비즈니스 규칙

- 감사 로그는 읽기 전용 (생성은 인증 레이어에서 처리)
- `getStats`: 오늘 자정 기준으로 집계
- 통계 항목: 오늘 성공 수, 오늘 실패 수, 오늘 잠금 수, 전체 누적 수

## 인터페이스

```typescript
interface GetAuditLogsResult {
  logs: ...; // AuthAuditLog 배열
  totalCount: number;
}

interface AuditLogStats {
  todaySuccessCount: number;
  todayFailureCount: number;
  todayLockedCount: number;
  totalCount: number;
}
```

## 에러 처리

- 별도 에러 처리 없음 (조회 전용)

## 권한 요구사항

- Controller 레이어에서 Guard를 통해 권한 처리 (보통 FULL_ACCESS 이상 필요)

## 구현 체크리스트

- [x] auth-audit-log.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
