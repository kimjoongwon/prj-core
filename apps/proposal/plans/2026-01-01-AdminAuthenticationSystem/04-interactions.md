# 인터랙션 정의

## 슈퍼매니저 권한 및 "전체" Space 선택

### 슈퍼매니저 (SuperManager) 개념

```
┌─────────────────────────────────────────────────────────────────┐
│  권한 레벨 구조                                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [슈퍼매니저]                                                      │
│      │                                                           │
│      ├── 모든 Space의 리소스 조회 가능                              │
│      ├── Space 선택 시 "전체" 옵션 사용 가능                        │
│      └── X-Space-ID: undefined → 모든 리소스 조회                  │
│                                                                  │
│  [일반 매니저]                                                     │
│      │                                                           │
│      ├── 소속된 Space의 리소스만 조회 가능                          │
│      ├── Space 선택 시 "전체" 옵션 없음                            │
│      └── X-Space-ID: 반드시 spaceId 필수                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 백엔드 처리 로직

```typescript
// 백엔드 Request Context Interceptor 로직
function handleSpaceId(request: Request, user: User) {
  const spaceId = request.headers['x-space-id'];

  if (spaceId === undefined || spaceId === '') {
    // X-Space-ID가 undefined인 경우
    if (user.isSuperManager) {
      // 슈퍼매니저: 모든 리소스 조회 허용
      return { spaceId: null, queryAllSpaces: true };
    } else {
      // 일반 매니저: 에러 반환 (Space 선택 필수)
      throw new ForbiddenException('Space 선택이 필요합니다.');
    }
  } else {
    // X-Space-ID가 있는 경우: 해당 Space 리소스만 조회
    return { spaceId, queryAllSpaces: false };
  }
}
```

### Repository 레이어 처리 예시

```typescript
// 슈퍼매니저의 "전체" 선택 시 Repository 쿼리 예시
async findMembers(context: RequestContext) {
  const where: Prisma.UserWhereInput = {};

  if (context.queryAllSpaces) {
    // 슈퍼매니저 + 전체 선택: Space 필터 없이 조회
    // where.spaceId 조건 생략
  } else {
    // 특정 Space 선택: 해당 Space만 조회
    where.tenants = { some: { spaceId: context.spaceId } };
  }

  return this.prisma.user.findMany({ where });
}
```

---

## 로그인 흐름

| 단계 | 사용자 액션 | 시스템 반응 |
|------|------------|------------|
| 1 | 이메일 입력 | state.email 업데이트 |
| 2 | 비밀번호 입력 | state.password 업데이트 |
| 3 | 로그인 버튼 클릭 | 입력값 검증 (Zod Schema) |
| 4 | - | POST /api/v1/auth/login 호출 |
| 5 | - | 성공: 토큰 Cookie 저장 |
| 6 | - | 성공: Space 자동 선택 (tenants[0]) |
| 7 | - | 성공: PersistStore에 spaceId 저장 |
| 8 | - | 성공: 대시보드(/)로 이동 |
| 9 | - | 실패: 에러 메시지 표시 |

---

## Space 자동 선택 로직

```typescript
// 로그인 성공 후 실행
async function handleLoginSuccess(response: LoginResponse) {
  const {
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
    selectedSpaceId,
    user
  } = response.data;

  // 1. 토큰 만료 시간 저장 (실제 토큰은 httpOnly 쿠키로 자동 저장됨)
  persistStore.setTokenExpiries(accessTokenExpiresAt, refreshTokenExpiresAt);

  // 2. Space 선택 (selectedSpaceId 우선, 없으면 첫 번째 tenant)
  let targetTenant: Tenant | undefined;

  if (selectedSpaceId) {
    // DB에 저장된 마지막 선택 Space 복원
    targetTenant = user.tenants.find(t => t.spaceId === selectedSpaceId);
  }

  if (!targetTenant) {
    // selectedSpaceId가 없거나 유효하지 않으면 첫 번째 tenant 사용
    targetTenant = user.tenants[0];
  }

  if (targetTenant?.space?.ground) {
    const { spaceId, space } = targetTenant;
    const groundName = space.ground.name;

    // PersistStore에 저장 (x-space-id 헤더용)
    persistStore.setSpace(spaceId, groundName);
  } else {
    // Space/Ground가 없는 경우 alert 표시
    alert('Space를 선택해주세요.');
    router.push('/select-space');
    return;
  }

  // 3. 대시보드로 이동
  router.push('/');
}
```

### 로그인 성공 후 데이터 흐름

```
Login API 응답
    │
    ├─ accessTokenExpiresAt ───► PersistStore (만료 시간 저장)
    ├─ refreshTokenExpiresAt ──► PersistStore
    │
    ├─ selectedSpaceId ────────► Space 선택 기준 (우선순위 1)
    │       │
    │       ▼
    │   user.tenants에서 해당 spaceId를 가진 tenant 찾기
    │       │
    │       └─ 없으면 user.tenants[0] 사용 (우선순위 2)
    │
    └─ targetTenant
         ├─ spaceId ───────────► PersistStore.spaceId
         └─ space.ground.name ─► PersistStore.groundName
```

---

## API 요청 헤더 설정

```typescript
// packages/api/src/libs/customAxios.ts
AXIOS_INSTANCE.interceptors.request.use((config) => {
  // spaceId 헤더 추가
  // - spaceId가 있으면: 해당 Space의 리소스만 조회
  // - spaceId가 null/undefined이면: 헤더를 보내지 않음 (슈퍼매니저의 "전체" 선택)
  const spaceId = persistStore.spaceId;
  if (spaceId) {
    config.headers['x-space-id'] = spaceId;
  }
  // spaceId가 null/undefined인 경우 헤더를 설정하지 않음
  // → 백엔드에서 슈퍼매니저인 경우 모든 리소스 조회 허용

  return config;
});
```

> **"전체" 선택 시 헤더 동작:**
> - `spaceId = null` → `X-Space-ID` 헤더 미포함 → 백엔드에서 슈퍼매니저 확인 후 전체 조회
> - `spaceId = 'space-123'` → `X-Space-ID: space-123` → 해당 Space만 조회

---

## Space 미선택 처리

```typescript
// 모든 보호된 페이지 진입 시 체크
function checkSpaceSelection() {
  const spaceId = persistStore.spaceId;

  if (!spaceId) {
    // Alert 표시
    showAlert({
      title: 'Space 선택 필요',
      message: '서비스 이용을 위해 Space를 선택해주세요.',
      confirmText: 'Space 선택하기',
      onConfirm: () => router.push('/select-space'),
    });
    return false;
  }

  return true;
}
```
