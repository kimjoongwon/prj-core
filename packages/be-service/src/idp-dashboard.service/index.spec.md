# IdpDashboard Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-03-13
> 타입: service
> 위치: packages/be-service/src/idp-dashboard.service/index.ts

## 역할

IDP(Identity Provider) 관리자 대시보드에 표시할 통계 정보를 제공합니다.
DB와 Redis를 조합하여 인증 통계, 계정 잠금 현황, 활성 세션 수, 로그인 추이를 조회합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `TransactionHost<TransactionalAdapterPrisma>` | DB 통계 쿼리 |
| `RedisService` | 활성 OIDC 세션 수 조회 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getStats` | - | `Promise<DashboardStats>` | 대시보드 통계 조회 |
| `getLoginTrend` | `days = 7` | `Promise<LoginTrendItem[]>` | 최근 N일 로그인 추이 조회 |

## 비즈니스 규칙

- 오늘 통계는 자정(00:00:00) 기준
- 활성 세션 수: Redis의 `oidc:Session:*`, `oidc:AccessToken:*` 키 수 (보조 인덱스 키 제외)
- 로그인 추이: 일별 성공/실패(FAILURE+LOCKED) 건수

## 인터페이스

```typescript
interface DashboardStats {
  activeSessionCount: number;      // Redis 기반
  todaySuccessCount: number;
  todayFailureCount: number;
  todayLockedCount: number;
  lockedAccountCount: number;      // isPermanentlyLocked=true
  activeClientCount: number;       // isActive=true OIDC 클라이언트
}

interface LoginTrendItem {
  date: string;            // YYYY-MM-DD
  successCount: number;
  failureCount: number;
}
```

## 에러 처리

- 별도 에러 처리 없음 (통계 조회 전용)

## 권한 요구사항

- IDP 관리자 전용 (FULL_ACCESS 역할 필요)

## 구현 체크리스트

- [x] idp-dashboard.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-13 | `idp-dashboard.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
| 2026-03-13 | 폴더형 `index.ts` 구조에 맞게 `RedisService` 상대 import 경로를 `../redis.service`로 보정 | codex |
