import { describe, it, expect } from 'vitest';
import Util, {
  DateTimeUtil,
  PathUtil,
  PaginationUtil,
  ValidationUtil,
  EnvironmentUtil,
} from '../../index';

describe('Shared Utils Integration', () => {
  describe('Default export', () => {
    it('should export all utilities in default object', () => {
      expect(Util).toBeDefined();
      expect(Util.DateTimeUtil).toBeDefined();
      expect(Util.PathUtil).toBeDefined();
      expect(Util.PaginationUtil).toBeDefined();
      expect(Util.ValidationUtil).toBeDefined();
      expect(Util.EnvironmentUtil).toBeDefined();
    });

    it('should have all utility methods available through default export', () => {
      expect(typeof Util.DateTimeUtil.getNow).toBe('function');
      expect(typeof Util.PathUtil.getUrlWithParamsAndQueryString).toBe(
        'function',
      );
      expect(typeof Util.PathUtil.convertFromPathParamsToQueryParams).toBe(
        'function',
      );
      expect(typeof Util.PaginationUtil.getPage).toBe('function');
      expect(typeof Util.PaginationUtil.toArgs).toBe('function');
      expect(typeof Util.ValidationUtil.validateConfig).toBe('function');
      expect(typeof Util.ValidationUtil.getVariableName).toBe('function');
      expect(typeof Util.EnvironmentUtil.getCurrentEnvironment).toBe(
        'function',
      );
      expect(typeof Util.EnvironmentUtil.isDevelopment).toBe('function');
      expect(typeof Util.EnvironmentUtil.isStaging).toBe('function');
      expect(typeof Util.EnvironmentUtil.isProduction).toBe('function');
      expect(typeof Util.EnvironmentUtil.getConfigByEnvironment).toBe(
        'function',
      );
    });
  });

  describe('Named exports', () => {
    it('should export all utilities as named exports', () => {
      expect(DateTimeUtil).toBeDefined();
      expect(PathUtil).toBeDefined();
      expect(PaginationUtil).toBeDefined();
      expect(ValidationUtil).toBeDefined();
      expect(EnvironmentUtil).toBeDefined();
    });

    it('should have the same references for default and named exports', () => {
      expect(Util.DateTimeUtil).toBe(DateTimeUtil);
      expect(Util.PathUtil).toBe(PathUtil);
      expect(Util.PaginationUtil).toBe(PaginationUtil);
      expect(Util.ValidationUtil).toBe(ValidationUtil);
      expect(Util.EnvironmentUtil).toBe(EnvironmentUtil);
    });
  });

  describe('Cross-utility integration scenarios', () => {
    it('should work together for API pagination scenario', () => {
      // Simulate a real-world scenario where utilities work together

      // 1. Create a paginated API URL with PathUtil
      const baseUrl = '/api/posts/:userId';
      const params = { userId: '123' };
      const queryString = 'page=2&limit=10';
      const url = PathUtil.getUrlWithParamsAndQueryString(
        baseUrl,
        params,
        queryString,
      );

      // 2. Calculate pagination args with PaginationUtil
      const paginationQuery = {
        take: 10,
        skip: 10,
        titleSortOrder: 'asc',
        status: 'published',
      };
      const paginationArgs = PaginationUtil.toArgs(paginationQuery);

      // 3. Get current timestamp with DateTimeUtil
      const timestamp = DateTimeUtil.getNow();

      expect(url).toBe('/api/posts/123?page=2&limit=10');
      expect(paginationArgs).toEqual({
        take: 10,
        skip: 10,
        where: { status: 'published' },
        orderBy: { title: 'asc' },
      });
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('should handle path param conversion for API calls', () => {
      // Scenario: Convert path params to query params for different API endpoint

      const originalPathParams = { userId: '456', postId: '789' };
      const pathParamKeys = ['userId', 'postId'];

      // Convert path params to query params
      const queryParams = PathUtil.convertFromPathParamsToQueryParams({
        pathParamKeys,
        pathParams: originalPathParams,
      });

      // Calculate page from skip/take
      const page = PaginationUtil.getPage({ skip: 20, take: 10 });

      expect(queryParams).toEqual({ userId: '456', postId: '789' });
      expect(page).toBe(3);
    });
  });
});
