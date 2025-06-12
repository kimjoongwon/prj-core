/**
 * BrowserUtil - 브라우저 관련 유틸리티 클래스
 * 쿠키 관리, 로컬 스토리지, 세션 스토리지, 네비게이션 등의 기능을 제공합니다.
 */
export class BrowserUtil {
  /**
   * 모든 쿠키를 삭제합니다.
   * HttpOnly 쿠키는 클라이언트에서 삭제할 수 없으므로 제외됩니다.
   */
  static clearAllCookies(): void {
    if (typeof document === 'undefined') {
      console.warn(
        'document가 정의되지 않았습니다. 브라우저 환경에서만 사용 가능합니다.',
      );
      return;
    }

    // 모든 쿠키 가져오기
    const cookies = document.cookie.split(';');

    // 각 쿠키를 삭제
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

      if (name) {
        // 쿠키 삭제 (다양한 path와 domain 조합으로 시도)
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
      }
    });
  }

  /**
   * 특정 쿠키를 삭제합니다.
   * @param name 삭제할 쿠키명
   * @param path 쿠키 경로 (기본값: '/')
   * @param domain 쿠키 도메인 (기본값: 현재 도메인)
   */
  static deleteCookie(name: string, path: string = '/', domain?: string): void {
    if (typeof document === 'undefined') {
      console.warn(
        'document가 정의되지 않았습니다. 브라우저 환경에서만 사용 가능합니다.',
      );
      return;
    }

    const domainStr = domain ? `; domain=${domain}` : '';
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domainStr}`;
  }

  /**
   * 로컬 스토리지를 모두 삭제합니다.
   */
  static clearLocalStorage(): void {
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage가 지원되지 않습니다.');
      return;
    }

    localStorage.clear();
  }

  /**
   * 세션 스토리지를 모두 삭제합니다.
   */
  static clearSessionStorage(): void {
    if (typeof sessionStorage === 'undefined') {
      console.warn('sessionStorage가 지원되지 않습니다.');
      return;
    }

    sessionStorage.clear();
  }

  /**
   * 모든 클라이언트 저장소를 삭제합니다 (쿠키, 로컬 스토리지, 세션 스토리지).
   */
  static clearAllStorage(): void {
    this.clearAllCookies();
    this.clearLocalStorage();
    this.clearSessionStorage();
  }

  /**
   * 특정 URL로 이동합니다.
   * @param url 이동할 URL
   * @param replace 현재 히스토리를 대체할지 여부 (기본값: false)
   */
  static navigateTo(url: string, replace: boolean = false): void {
    if (typeof window === 'undefined') {
      console.warn(
        'window가 정의되지 않았습니다. 브라우저 환경에서만 사용 가능합니다.',
      );
      return;
    }

    if (replace) {
      window.location.replace(url);
    } else {
      window.location.href = url;
    }
  }

  /**
   * 페이지를 새로고침합니다.
   * @param forceReload 캐시를 무시하고 강제로 새로고침할지 여부 (기본값: false)
   */
  static reload(forceReload: boolean = false): void {
    if (typeof window === 'undefined') {
      console.warn(
        'window가 정의되지 않았습니다. 브라우저 환경에서만 사용 가능합니다.',
      );
      return;
    }

    window.location.reload();
  }

  /**
   * 현재 URL의 정보를 반환합니다.
   */
  static getCurrentUrl(): {
    href: string;
    protocol: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
  } | null {
    if (typeof window === 'undefined') {
      console.warn(
        'window가 정의되지 않았습니다. 브라우저 환경에서만 사용 가능합니다.',
      );
      return null;
    }

    const location = window.location;
    return {
      href: location.href,
      protocol: location.protocol,
      hostname: location.hostname,
      port: location.port,
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
    };
  }

  /**
   * 사용자 에이전트 정보를 분석합니다.
   */
  static getUserAgent(): {
    userAgent: string;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    browser: string;
    os: string;
  } | null {
    if (typeof navigator === 'undefined') {
      console.warn(
        'navigator가 정의되지 않았습니다. 브라우저 환경에서만 사용 가능합니다.',
      );
      return null;
    }

    const userAgent = navigator.userAgent;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent,
      );
    const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(
      userAgent,
    );
    const isDesktop = !isMobile && !isTablet;

    let browser = 'Unknown';
    if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
    else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';

    let os = 'Unknown';
    if (userAgent.indexOf('Windows') > -1) os = 'Windows';
    else if (userAgent.indexOf('Mac') > -1) os = 'macOS';
    else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
    else if (userAgent.indexOf('Android') > -1) os = 'Android';
    else if (userAgent.indexOf('iOS') > -1) os = 'iOS';

    return {
      userAgent,
      isMobile,
      isTablet,
      isDesktop,
      browser,
      os,
    };
  }
}
