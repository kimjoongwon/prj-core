# OidcSessions Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/oidc-sessions.service.ts

## 역할

Redis에 저장된 OIDC 세션/토큰을 관리합니다.
OIDC 라이브러리가 Redis에 저장한 Session, AccessToken, RefreshToken 등을 조회하고 폐기합니다.
보조 인덱스 키(uid, userCode, grant)를 필터링하여 실제 데이터 키만 처리합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `RedisService` | Redis OIDC 세션 데이터 접근 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getMany` | `query: QueryOidcSessionDto` | `Promise<{data, totalCount}>` | OIDC 세션/토큰 목록 조회 (페이지네이션) |
| `getStats` | - | `Promise<OidcSessionStats>` | 모델 타입별 세션/토큰 통계 조회 |
| `revokeAll` | - | `Promise<number>` | 모든 세션/토큰 일괄 폐기 |
| `revokeByKey` | `keyId: string` | `Promise<void>` | 세션/토큰 단건 폐기 (관련 인덱스 키 함께 삭제) |
| `revokeByGrantId` | `grantId: string` | `Promise<number>` | Grant ID로 관련 세션/토큰 일괄 폐기 |

## 비즈니스 규칙

### 지원 OIDC 모델 타입

`Session`, `AccessToken`, `RefreshToken`, `AuthorizationCode`, `Grant`, `ClientCredentials`, `DeviceCode`, `Interaction`

### 보조 인덱스 필터링

Redis 키 중 `:uid:`, `:userCode:`, `:grant:` 세그먼트를 포함한 키는 보조 인덱스로 제외

### 단건 폐기 동작

- 메인 키 삭제
- `uid` 인덱스 키 삭제
- `userCode` 인덱스 키 삭제
- `grantId` Set에서 항목 제거

## 인터페이스

```typescript
interface OidcRedisSession {
  key: string;
  modelType: string;
  grantId: string | null;
  uid: string | null;
  accountId: string | null;
  expiresAt: Date | null;
  createdAt: Date;
}

interface OidcSessionStats {
  totalCount: number;
  byModelType: Record<string, number>;
}
```

## 에러 처리

| 에러 상황 | 에러 타입 | 메시지 |
|----------|-----------|--------|
| 세션/토큰 없음 (단건 폐기) | `NotFoundException` | "세션/토큰을 찾을 수 없습니다" |
| Grant에 연결된 세션 없음 | `NotFoundException` | "해당 Grant에 연결된 세션/토큰이 없습니다" |

## 권한 요구사항

- IDP 관리자 전용 (FULL_ACCESS 역할 필요)

## 구현 체크리스트

- [x] oidc-sessions.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
