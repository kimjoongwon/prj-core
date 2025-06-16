import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EnvironmentUtil } from '../EnvironmentUtil';

// Helper function to mock window.location
const mockWindowLocation = (hostname: string, port: string = '') => {
  Object.defineProperty(globalThis, 'window', {
    value: {
      location: {
        hostname,
        port,
      },
    },
    writable: true,
  });
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('EnvironmentUtil', () => {
  describe('getCurrentEnvironment', () => {
    it('로컬 개발 환경을 올바르게 감지해야 함 (localhost)', () => {
      mockWindowLocation('localhost', '3000');

      const result = EnvironmentUtil.getCurrentEnvironment();

      expect(result).toEqual({
        name: '개발',
        color: 'success',
      });
    });

    it('로컬 개발 환경을 올바르게 감지해야 함 (127.0.0.1)', () => {
      mockWindowLocation('127.0.0.1', '8080');

      const result = EnvironmentUtil.getCurrentEnvironment();

      expect(result).toEqual({
        name: '개발',
        color: 'success',
      });
    });

    it('로컬 개발 환경을 올바르게 감지해야 함 (포트 5173)', () => {
      mockWindowLocation('example.com', '5173');

      const result = EnvironmentUtil.getCurrentEnvironment();

      expect(result).toEqual({
        name: '개발',
        color: 'success',
      });
    });

    it('스테이징 환경을 올바르게 감지해야 함 (staging 포함)', () => {
      mockWindowLocation('staging.example.com', '');

      const result = EnvironmentUtil.getCurrentEnvironment();

      expect(result).toEqual({
        name: '스테이징',
        color: 'warning',
      });
    });

    it('스테이징 환경을 올바르게 감지해야 함 (stg 포함)', () => {
      mockWindowLocation('stg-api.example.com', '');

      const result = EnvironmentUtil.getCurrentEnvironment();

      expect(result).toEqual({
        name: '스테이징',
        color: 'warning',
      });
    });

    it('운영 환경을 올바르게 감지해야 함', () => {
      mockWindowLocation('api.example.com', '');

      const result = EnvironmentUtil.getCurrentEnvironment();

      expect(result).toEqual({
        name: '운영',
        color: 'danger',
      });
    });
  });

  describe('isDevelopment', () => {
    it('개발 환경에서 true를 반환해야 함', () => {
      mockWindowLocation('localhost');

      expect(EnvironmentUtil.isDevelopment()).toBe(true);
    });

    it('개발 환경이 아닐 때 false를 반환해야 함', () => {
      mockWindowLocation('staging.example.com');

      expect(EnvironmentUtil.isDevelopment()).toBe(false);
    });
  });

  describe('isStaging', () => {
    it('스테이징 환경에서 true를 반환해야 함', () => {
      mockWindowLocation('staging.example.com');

      expect(EnvironmentUtil.isStaging()).toBe(true);
    });

    it('스테이징 환경이 아닐 때 false를 반환해야 함', () => {
      mockWindowLocation('localhost');

      expect(EnvironmentUtil.isStaging()).toBe(false);
    });
  });

  describe('isProduction', () => {
    it('운영 환경에서 true를 반환해야 함', () => {
      mockWindowLocation('api.example.com');

      expect(EnvironmentUtil.isProduction()).toBe(true);
    });

    it('운영 환경이 아닐 때 false를 반환해야 함', () => {
      mockWindowLocation('localhost');

      expect(EnvironmentUtil.isProduction()).toBe(false);
    });
  });

  describe('getConfigByEnvironment', () => {
    it('개발 환경에서 개발용 설정을 반환해야 함', () => {
      mockWindowLocation('localhost');

      const configs = {
        개발: 'dev-config',
        스테이징: 'staging-config',
        운영: 'prod-config',
      };

      expect(EnvironmentUtil.getConfigByEnvironment(configs)).toBe(
        'dev-config',
      );
    });

    it('스테이징 환경에서 스테이징용 설정을 반환해야 함', () => {
      mockWindowLocation('staging.example.com');

      const configs = {
        개발: 'dev-config',
        스테이징: 'staging-config',
        운영: 'prod-config',
      };

      expect(EnvironmentUtil.getConfigByEnvironment(configs)).toBe(
        'staging-config',
      );
    });

    it('운영 환경에서 운영용 설정을 반환해야 함', () => {
      mockWindowLocation('api.example.com');

      const configs = {
        개발: 'dev-config',
        스테이징: 'staging-config',
        운영: 'prod-config',
      };

      expect(EnvironmentUtil.getConfigByEnvironment(configs)).toBe(
        'prod-config',
      );
    });

    it('설정이 없는 환경에서는 운영 환경 설정을 기본값으로 반환해야 함', () => {
      mockWindowLocation('localhost');

      const configs = {
        스테이징: 'staging-config',
        운영: 'prod-config',
      };

      expect(EnvironmentUtil.getConfigByEnvironment(configs)).toBe(
        'prod-config',
      );
    });
  });
});
