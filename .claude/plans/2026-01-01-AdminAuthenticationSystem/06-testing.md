# 테스트 시나리오

## 단위 테스트

### PersistStore 테스트

```typescript
describe('PersistStore', () => {
  let persistStore: PersistStore;

  beforeEach(() => {
    localStorage.clear();
    persistStore = new PersistStore({ storageKey: 'test' });
  });

  describe('Space 관리', () => {
    it('spaceId와 groundName을 저장할 수 있다', () => {
      // Given & When
      persistStore.setSpace('space-123', 'Test Ground');

      // Then
      expect(persistStore.spaceId).toBe('space-123');
      expect(persistStore.groundName).toBe('Test Ground');
    });

    it('Space 정보를 삭제할 수 있다', () => {
      // Given
      persistStore.setSpace('space-123', 'Test Ground');

      // When
      persistStore.clearSpace();

      // Then
      expect(persistStore.spaceId).toBeNull();
    });
  });

  describe('토큰 만료 시간 관리', () => {
    it('토큰 만료 시간을 저장할 수 있다', () => {
      // Given
      const accessExpiresAt = Date.now() + 60 * 60 * 1000;
      const refreshExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

      // When
      persistStore.setTokenExpiries(accessExpiresAt, refreshExpiresAt);

      // Then
      expect(persistStore.isAuthenticated).toBe(true);
      expect(persistStore.isAccessTokenExpired).toBe(false);
    });

    it('만료된 토큰 상태를 감지할 수 있다', () => {
      // Given
      const expiredTime = Date.now() - 1000; // 과거

      // When
      persistStore.setTokenExpiries(expiredTime, expiredTime);

      // Then
      expect(persistStore.isAuthenticated).toBe(false);
      expect(persistStore.isAccessTokenExpired).toBe(true);
    });
  });

  describe('전체 초기화 (로그아웃)', () => {
    it('clear() 호출 시 모든 상태가 초기화된다', () => {
      // Given
      persistStore.setSpace('space-123', 'Test Ground');
      persistStore.setTokenExpiries(Date.now() + 10000, Date.now() + 10000);

      // When
      persistStore.clear();

      // Then
      expect(persistStore.spaceId).toBeNull();
      expect(persistStore.groundName).toBeNull();
      expect(persistStore.isAuthenticated).toBe(false);
    });
  });

  describe('localStorage 동기화', () => {
    it('모든 데이터가 localStorage에 저장된다', () => {
      // Given & When
      persistStore.setSpace('space-123', 'Test Ground');
      persistStore.setTokenExpiries(Date.now() + 10000, Date.now() + 10000);

      // Then
      const stored = JSON.parse(localStorage.getItem('test') || '{}');
      expect(stored.spaceId).toBe('space-123');
      expect(stored.accessTokenExpiresAt).toBeDefined();
    });
  });
});
```

---

### useAuthLoginPage 테스트

```typescript
describe('useAuthLoginPage', () => {
  const mockLoginResponse = {
    data: {
      accessTokenExpiresAt: Date.now() + 60 * 60 * 1000,
      refreshTokenExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      selectedSpaceId: null,  // 첫 로그인
      user: {
        tenants: [
          {
            spaceId: 'space-1',
            space: {
              id: 'space-1',
              ground: { id: 'ground-1', name: 'Ground 1', label: null }
            }
          },
          {
            spaceId: 'space-2',
            space: {
              id: 'space-2',
              ground: { id: 'ground-2', name: 'Ground 2', label: null }
            }
          }
        ]
      },
    },
  };

  it('로그인 성공 시 토큰 만료 시간이 저장된다', async () => {
    // Given
    const { result } = renderHook(() => useAuthLoginPage());
    mockLoginApi.mockResolvedValue(mockLoginResponse);

    // When
    await act(async () => {
      result.current.state.email = 'test@test.com';
      result.current.state.password = 'password123';
      await result.current.onClickLoginButton();
    });

    // Then
    expect(mockPersistStore.setTokenExpiries).toHaveBeenCalledWith(
      mockLoginResponse.data.accessTokenExpiresAt,
      mockLoginResponse.data.refreshTokenExpiresAt
    );
  });

  it('selectedSpaceId가 없으면 첫 번째 tenant가 선택된다', async () => {
    // Given
    const { result } = renderHook(() => useAuthLoginPage());
    mockLoginApi.mockResolvedValue(mockLoginResponse); // selectedSpaceId: null

    // When
    await act(async () => {
      result.current.state.email = 'test@test.com';
      result.current.state.password = 'password123';
      await result.current.onClickLoginButton();
    });

    // Then
    expect(mockPersistStore.setSpace).toHaveBeenCalledWith('space-1', 'Ground 1');
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('selectedSpaceId가 있으면 해당 Space가 선택된다', async () => {
    // Given
    const { result } = renderHook(() => useAuthLoginPage());
    mockLoginApi.mockResolvedValue({
      data: {
        ...mockLoginResponse.data,
        selectedSpaceId: 'space-2',  // 마지막 선택한 Space
      },
    });

    // When
    await act(async () => {
      result.current.state.email = 'test@test.com';
      result.current.state.password = 'password123';
      await result.current.onClickLoginButton();
    });

    // Then
    expect(mockPersistStore.setSpace).toHaveBeenCalledWith('space-2', 'Ground 2');
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('로그인 실패 시 에러 메시지가 표시된다', async () => {
    // Given
    const { result } = renderHook(() => useAuthLoginPage());
    mockLoginApi.mockRejectedValue(new Error('Invalid credentials'));

    // When
    await act(async () => {
      await result.current.onClickLoginButton();
    });

    // Then
    expect(result.current.state.errorMessage).toBeTruthy();
  });

  it('Space/Ground가 없으면 선택 페이지로 이동한다', async () => {
    // Given
    const { result } = renderHook(() => useAuthLoginPage());
    mockLoginApi.mockResolvedValue({
      data: {
        ...mockLoginResponse.data,
        selectedSpaceId: null,
        user: { tenants: [] }, // 빈 tenants
      },
    });

    // When
    await act(async () => {
      await result.current.onClickLoginButton();
    });

    // Then
    expect(mockRouter.push).toHaveBeenCalledWith('/select-space');
  });
});
```

---

## 통합 테스트

### API 인터셉터 테스트

```typescript
describe('AXIOS_INSTANCE 인터셉터', () => {
  it('spaceId가 있으면 x-space-id 헤더가 추가된다', async () => {
    // Given
    setApiPersistStore({ spaceId: 'space-123' });

    // When
    await AXIOS_INSTANCE.get('/api/v1/test');

    // Then
    expect(mockAxios.lastRequest.headers['x-space-id']).toBe('space-123');
  });

  it('spaceId가 없으면 x-space-id 헤더가 추가되지 않는다', async () => {
    // Given
    setApiPersistStore({ spaceId: null });

    // When
    await AXIOS_INSTANCE.get('/api/v1/test');

    // Then
    expect(mockAxios.lastRequest.headers['x-space-id']).toBeUndefined();
  });
});
```

---

### 로그인 플로우 통합 테스트

```typescript
describe('로그인 플로우 통합 테스트', () => {
  it('전체 로그인 흐름이 정상 동작한다', async () => {
    // Given
    render(<LoginPage />);

    // When - 로그인 정보 입력
    await userEvent.type(screen.getByLabelText('이메일'), 'admin@test.com');
    await userEvent.type(screen.getByLabelText('비밀번호'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    // Then
    await waitFor(() => {
      // 1. 토큰 만료 시간이 localStorage에 저장됨 (httpOnly 쿠키는 JS에서 접근 불가)
      expect(localStorage.getItem('auth-token-expiry')).toBeTruthy();
      const tokenExpiry = JSON.parse(localStorage.getItem('auth-token-expiry')!);
      expect(tokenExpiry.accessExpiresAt).toBeGreaterThan(Date.now());

      // 2. spaceId가 localStorage에 저장됨
      expect(localStorage.getItem('admin-persist')).toContain('spaceId');

      // 3. 대시보드로 이동
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });
});
```

---

## E2E 테스트 (Playwright)

```typescript
describe('관리자 로그인 E2E', () => {
  test('정상 로그인 후 대시보드 진입', async ({ page }) => {
    // Given
    await page.goto('/auth/login');

    // When
    await page.fill('[name="email"]', 'admin@cocdev.co.kr');
    await page.fill('[name="password"]', 'Admin123!');
    await page.click('button:has-text("로그인")');

    // Then
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=대시보드')).toBeVisible();
  });

  test('잘못된 비밀번호로 로그인 실패', async ({ page }) => {
    // Given
    await page.goto('/auth/login');

    // When
    await page.fill('[name="email"]', 'admin@cocdev.co.kr');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button:has-text("로그인")');

    // Then
    await expect(page.locator('text=이메일 또는 비밀번호가 올바르지 않습니다')).toBeVisible();
  });

  test('Space 미선택 시 Alert 표시', async ({ page }) => {
    // Given - Space 없이 로그인된 상태 시뮬레이션
    await page.evaluate(() => {
      localStorage.removeItem('admin-persist');
    });

    // When
    await page.goto('/');

    // Then
    await expect(page.locator('text=Space 선택 필요')).toBeVisible();
  });

  test('API 요청에 x-space-id 헤더 포함', async ({ page }) => {
    // Given - 로그인 및 Space 선택 완료
    await login(page);

    // When - API 호출하는 페이지 진입
    const [request] = await Promise.all([
      page.waitForRequest((req) => req.url().includes('/api/v1/')),
      page.goto('/members'),
    ]);

    // Then
    expect(request.headers()['x-space-id']).toBeTruthy();
  });
});
```

---

## 테스트 체크리스트

### PersistStore

- [ ] spaceId, groundName 저장/조회
- [ ] spaceId null 저장 (슈퍼매니저 "전체" 선택)
- [ ] 토큰 만료 시간 저장/조회
- [ ] isAuthenticated computed 검증
- [ ] needsTokenRefresh computed 검증
- [ ] clear() 전체 초기화

### useAuthLoginPage

- [ ] 로그인 성공 → 토큰 만료 시간 저장
- [ ] selectedSpaceId 우선 선택
- [ ] selectedSpaceId 없으면 tenants[0] 선택
- [ ] tenants 빈 배열 → /select-space 이동
- [ ] 로그인 실패 → 에러 메시지

### x-space-id 인터셉터

- [ ] spaceId 있으면 헤더 포함
- [ ] spaceId null이면 헤더 미포함

### Space 선택 UI

- [ ] 슈퍼매니저: "전체" 옵션 표시
- [ ] 일반 매니저: "전체" 옵션 없음
- [ ] Space 선택 시 API 호출 + Store 업데이트
