# IdpAccount Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/idp-account.service/index.ts

## 역할

IDP(Identity Provider) 관리자 화면에서 사용자 계정 보안 정보를 관리합니다.
Prisma 직접 접근(TransactionHost)을 사용하며, Space 개념 없이 전체 사용자를 대상으로 합니다.
계정 활성/비활성 토글, 로그인 실패 횟수 초기화 등 보안 관련 작업을 담당합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `TransactionHost<TransactionalAdapterPrisma>` | Prisma 직접 접근 (트랜잭션 지원) |
| `AuthAuditLogsRepository` | 최근 감사 로그 조회 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getMany` | `query: QueryIdpAccountDto` | `Promise<{data, totalCount}>` | IDP 계정 목록 조회 (페이지네이션) |
| `getById` | `userId: string` | `Promise<IdpAccountInfo>` | IDP 계정 상세 조회 |
| `getRecentAuditLogs` | `userId: string, limit = 5` | `Promise<...>` | 사용자별 최근 감사 로그 조회 |
| `toggleActive` | `userId: string` | `Promise<IdpAccountInfo>` | 계정 활성/비활성 토글 |
| `resetFailedAttempts` | `userId: string` | `Promise<void>` | 로그인 실패 횟수 초기화 및 잠금 해제 |

## 비즈니스 규칙

- `removedAt: null` 필터로 소프트 삭제된 계정 제외
- 조회 필드 제한: id, name, email, isActive, failedLoginAttempts, isPermanentlyLocked, lockedUntil, mustChangePassword, lastLoginAt, lastLoginIp, createdAt
- `resetFailedAttempts`: `failedLoginAttempts = 0`, `lockedUntil = null`, `isPermanentlyLocked = false` 리셋

## 인터페이스

```typescript
interface IdpAccountInfo {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  failedLoginAttempts: number;
  isPermanentlyLocked: boolean;
  lockedUntil: Date | null;
  mustChangePassword: boolean;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
  createdAt: Date;
}
```

## 에러 처리

| 에러 상황 | 에러 타입 | 메시지 |
|----------|-----------|--------|
| 계정 없음 | `NotFoundException` | "계정을 찾을 수 없습니다" |

## 권한 요구사항

- IDP 관리자 전용 (FULL_ACCESS 역할 필요)

## 구현 체크리스트

- [x] idp-account.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-13 | `idp-account.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
