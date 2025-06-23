import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthStore } from '../authStore';

// BrowserUtil mock
vi.mock('@shared/utils', () => ({
  BrowserUtil: {
    clearLocalStorage: vi.fn(),
    clearSessionStorage: vi.fn(),
    navigateTo: vi.fn(),
  },
}));

describe('AuthStore', () => {
  let authStore: AuthStore;
  let mockPlateStore: any;
  let mockLogoutApi: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock PlateStore
    mockPlateStore = {};
    
    authStore = new AuthStore(mockPlateStore);
    mockLogoutApi = vi.fn();

    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('로그아웃', () => {
    it('로그아웃 API가 제공되었을 때 정상적으로 로그아웃이 처리되어야 한다', async () => {
      mockLogoutApi.mockResolvedValue({});

      await authStore.logout(mockLogoutApi);

      expect(mockLogoutApi).toHaveBeenCalledOnce();
      expect(authStore.isLoggingOut).toBe(false);
    });

    it('로그아웃 API가 제공되지 않았을 때도 클라이언트 정리는 수행되어야 한다', async () => {
      await authStore.logout();

      expect(authStore.isLoggingOut).toBe(false);
    });

    it('로그아웃 API 호출이 실패해도 클라이언트 정리는 수행되어야 한다', async () => {
      mockLogoutApi.mockRejectedValue(new Error('API Error'));

      await authStore.logout(mockLogoutApi);

      expect(mockLogoutApi).toHaveBeenCalledOnce();
      expect(authStore.isLoggingOut).toBe(false);
    });

    it('로그아웃 중에는 isLoggingOut이 true여야 한다', async () => {
      let resolveLogout: (value: any) => void;
      const logoutPromise = new Promise(resolve => {
        resolveLogout = resolve;
      });
      
      mockLogoutApi.mockReturnValue(logoutPromise);

      const logoutCall = authStore.logout(mockLogoutApi);
      
      expect(authStore.isLoggingOut).toBe(true);
      
      resolveLogout({});
      await logoutCall;
      
      expect(authStore.isLoggingOut).toBe(false);
    });
  });
});
