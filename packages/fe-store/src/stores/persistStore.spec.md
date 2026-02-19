# PersistStore 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: store
> 위치: packages/fe-store/src/stores/persistStore.ts

## 역할

영속 데이터 및 인증 상태를 통합 관리하는 MobX Store. Space/Ground 정보, 토큰 만료 시간을 localStorage에 자동 동기화하며, httpOnly 쿠키 환경에서 토큰 만료 여부를 판단합니다. 앱별 storageKey를 주입받아 여러 앱에서 독립적으로 사용할 수 있습니다.

## 타입 정의

| 타입명 | 종류 | 설명 |
|--------|------|------|
| `PersistStoreConfig` | interface | `storageKey: string` - localStorage 키 |
| `SpaceInfo` | interface | `spaceId: string`, `groundName: string` - 선택 가능한 Space 정보 |
| `PersistedData` | interface (private) | localStorage에 저장되는 전체 데이터 구조 |

## 상수

| 상수명 | 값 | 설명 |
|--------|-----|------|
| `TOKEN_BUFFER_MS` | `30000` (30초) | 토큰 만료 판별 시 네트워크 지연 버퍼 |
| `TOKEN_REFRESH_THRESHOLD_MS` | `300000` (5분) | 토큰 갱신 필요 여부 판별 임계값 |

## 상태 (Observable)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| spaceId | `string \| null` | `null` (hydrate로 복원 가능) | 현재 Space ID |
| groundName | `string \| null` | `null` (hydrate로 복원 가능) | 현재 Ground 이름 |
| spaces | `SpaceInfo[]` | `[]` (hydrate로 복원 가능) | 선택 가능한 Space 목록 |
| accessTokenExpiresAt | `number \| null` | `null` (hydrate로 복원 가능) | Access Token 만료 시간 (Unix timestamp) |
| refreshTokenExpiresAt | `number \| null` | `null` (hydrate로 복원 가능) | Refresh Token 만료 시간 (Unix timestamp) |

## 계산된 값 (Computed)

| 속성 | 타입 | 계산 로직 |
|------|------|----------|
| isAccessTokenExpired | `boolean` | `accessTokenExpiresAt`이 null이면 true. `Date.now() >= accessTokenExpiresAt - TOKEN_BUFFER_MS`이면 true |
| isRefreshTokenExpired | `boolean` | `refreshTokenExpiresAt`이 null이면 true. `Date.now() >= refreshTokenExpiresAt - TOKEN_BUFFER_MS`이면 true |
| isAuthenticated | `boolean` | `!isAccessTokenExpired` - Access Token이 유효하면 인증된 상태 |
| needsTokenRefresh | `boolean` | `accessTokenExpiresAt`이 null이면 false. 남은 시간이 0 초과 5분 이하면 true |

## 액션 (Action)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| `setSpace` | `spaceId: string, groundName: string` | Space 및 Ground 정보 설정 |
| `clearSpace` | 없음 | Space 정보 초기화 (null) |
| `setSpaces` | `spaces: SpaceInfo[]` | 선택 가능한 Space 목록 설정 |
| `setTokenExpiries` | `accessExpiresAt: number, refreshExpiresAt: number` | 토큰 만료 시간 설정 (로그인 성공 시 호출) |
| `clear` | 없음 | 모든 상태 초기화 + localStorage 항목 삭제 (로그아웃 시) |

## 비동기 액션 (Flow)

없음

## 의존 Store

없음 (독립적)

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| persistStore | PersistStore |

## 내부 메커니즘

### hydrate (private)
- 생성자에서 호출
- `typeof window === "undefined"` 체크 (SSR 안전)
- localStorage에서 `config.storageKey`로 데이터 읽기
- JSON 파싱하여 각 속성에 복원

### setupAutoSave (private)
- 생성자에서 호출
- `typeof window === "undefined"` 체크 (SSR 안전)
- MobX `reaction`을 사용하여 observable 변경 시 자동 localStorage 저장
- 감시 대상: `spaceId`, `groundName`, `spaces`, `accessTokenExpiresAt`, `refreshTokenExpiresAt`

## 사용 예시

```typescript
const persistStore = new PersistStore({ storageKey: "admin-persist" });

// Space 설정
persistStore.setSpace("space-123", "Ground Name");

// 토큰 만료 시간 설정 (로그인 후)
persistStore.setTokenExpiries(accessExpiresAt, refreshExpiresAt);

// 인증 상태 확인
if (persistStore.isAuthenticated) { ... }

// 토큰 갱신 필요 여부
if (persistStore.needsTokenRefresh) { ... }

// 로그아웃
persistStore.clear();
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
