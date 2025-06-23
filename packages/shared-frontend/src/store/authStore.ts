import { makeAutoObservable } from 'mobx';
import { BrowserUtil } from '@shared/utils';

export class AuthStore {
  private plateStore: any; // PlateStore 타입은 순환 참조 방지를 위해 any 사용
  isLoggingOut = false;

  constructor(plateStore: any) {
    this.plateStore = plateStore;
    makeAutoObservable(this);
  }

  async logout(logoutApi?: () => Promise<any>) {
    try {
      this.isLoggingOut = true;
      console.log('로그아웃 처리 중...');

      // Call backend logout API to clear HttpOnly cookies if provided
      if (logoutApi) {
        await logoutApi();
      }

      // Clear client-side storage
      BrowserUtil.clearLocalStorage();
      BrowserUtil.clearSessionStorage();

      // Navigate to login page
      BrowserUtil.navigateTo('/admin/auth/login', true);
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error);

      // Even if API call fails, clear client storage and redirect
      BrowserUtil.clearLocalStorage();
      BrowserUtil.clearSessionStorage();
      BrowserUtil.navigateTo('/admin/auth/login', true);
    } finally {
      this.isLoggingOut = false;
    }
  }
}
