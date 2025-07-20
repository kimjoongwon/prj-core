/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock dependencies
vi.mock('@shared/api-client', () => ({
  APIManager: {
    useGetUsersByQuery: vi.fn(),
    useGetGroundsByQuery: vi.fn(),
    useGetGroundById: vi.fn(),
  },
}));

vi.mock('nuqs', () => ({
  parseAsInteger: {
    withDefault: (defaultValue: number) => ({ defaultValue }),
  },
  useQueryState: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  useParams: vi.fn(),
  useLocation: vi.fn(),
}));

vi.mock('@heroui/react', () => ({
  addToast: vi.fn(),
}));

vi.mock('lodash-es', () => ({
  isEmpty: vi.fn(),
  get: vi.fn(),
}));

// Mock the PageProvider
vi.mock('../provider', () => ({
  usePage: vi.fn(() => ({
    state: {},
  })),
}));

import { APIManager } from '@shared/api-client';
import { useQueryState } from 'nuqs';
import { useParams, useLocation } from '@tanstack/react-router';
import { addToast } from '@heroui/react';
import { isEmpty, get } from 'lodash-es';
import type { ApiQueryBuilder } from '@shared/types';
import { useApiQuery } from '../useApiQuery';

// Console spy to test logging
const consoleSpy = {
  log: vi.spyOn(console, 'log').mockImplementation(() => {}),
  warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
  error: vi.spyOn(console, 'error').mockImplementation(() => {}),
  debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
};

describe('useApiQuery', () => {
  const mockSetSkip = vi.fn();
  const mockSetTake = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    (useQueryState as any).mockImplementation((key: string, config: any) => {
      if (key === 'skip') return [0, mockSetSkip];
      if (key === 'take') return [10, mockSetTake];
      return [config.defaultValue, vi.fn()];
    });

    (useParams as any).mockReturnValue({ id: '123' });
    (useLocation as any).mockReturnValue({ pathname: '/test/detail/123' });
    (isEmpty as any).mockReturnValue(false);
    (get as any).mockImplementation((obj: any, path: string) => obj?.[path]);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Table Query', () => {
    it('should handle table query with pagination', () => {
      const mockTableQuery = {
        data: {
          data: [{ id: 1, name: 'Test User' }],
          meta: { skip: 0, take: 10, itemCount: 1 },
        },
        isLoading: false,
        error: null,
      };

      (APIManager.useGetUsersByQuery as any).mockReturnValue(mockTableQuery);
      (isEmpty as any).mockReturnValue(false);

      const tableBuilder: ApiQueryBuilder = {
        type: 'table',
        query: { name: 'useGetUsersByQuery', params: { filter: 'active' } },
        pagination: { enabled: true, defaultTake: 10 },
      };

      const { result } = renderHook(() => useApiQuery(tableBuilder));

      expect(result.current.data).toEqual([{ id: 1, name: 'Test User' }]);
      expect(result.current.meta).toEqual({ skip: 0, take: 10, itemCount: 1 });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.skip).toBe(0);
      expect(result.current.take).toBe(10);
      expect(typeof result.current.setSkip).toBe('function');
      expect(typeof result.current.setTake).toBe('function');
    });

    it('should handle empty query params for table', () => {
      const mockTableQuery = {
        data: { data: [], meta: {} },
        isLoading: false,
        error: null,
      };

      (APIManager.useGetUsersByQuery as any).mockReturnValue(mockTableQuery);
      (isEmpty as any).mockReturnValue(true);

      const tableBuilder: ApiQueryBuilder = {
        type: 'table',
        query: { name: 'useGetUsersByQuery' },
        pagination: { enabled: true },
      };

      const { result } = renderHook(() => useApiQuery(tableBuilder));

      expect(APIManager.useGetUsersByQuery).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          query: expect.objectContaining({ enabled: true }),
        }),
      );
    });
  });

  describe('List Query', () => {
    it('should handle list query and transform to options', () => {
      const mockListQuery = {
        data: {
          data: [
            { id: 1, name: 'Option 1' },
            { id: 2, name: 'Option 2' },
          ],
        },
        isLoading: false,
        error: null,
      };

      (APIManager.useGetUsersByQuery as any).mockReturnValue(mockListQuery);
      (get as any).mockImplementation((obj: any, path: string) => {
        if (path === 'id') return obj.id;
        if (path === 'name') return obj.name;
        return undefined;
      });

      const listBuilder: ApiQueryBuilder = {
        type: 'list',
        query: { name: 'useGetUsersByQuery', params: {} },
        listOptions: { valueField: 'id', labelField: 'name' },
      };

      const { result } = renderHook(() => useApiQuery(listBuilder));

      expect(result.current.options).toEqual([
        { value: 1, text: 'Option 1' },
        { value: 2, text: 'Option 2' },
      ]);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle list query error and show toast', () => {
      const mockError = new Error('API Error');
      const mockListQuery = {
        data: null,
        isLoading: false,
        error: mockError,
      };

      (APIManager.useGetUsersByQuery as any).mockReturnValue(mockListQuery);

      const listBuilder: ApiQueryBuilder = {
        type: 'list',
        query: { name: 'useGetUsersByQuery' },
        listOptions: { valueField: 'id', labelField: 'name' },
      };

      const { result } = renderHook(() => useApiQuery(listBuilder));

      expect(addToast).toHaveBeenCalledWith({
        title: '💥 ListboxBuilder 오류',
        description: '데이터를 불러오는 중 오류가 발생했습니다: API Error',
        color: 'danger',
      });
      expect(result.current.options).toEqual([]);
    });
  });

  describe('Resource Query', () => {
    it('should handle resource query with ID', () => {
      const mockResourceQuery = {
        data: { data: { id: 123, name: 'Test Ground' } },
        isLoading: false,
        error: null,
      };

      (APIManager.useGetGroundById as any).mockReturnValue(mockResourceQuery);
      (useParams as any).mockReturnValue({ id: '123' });
      (useLocation as any).mockReturnValue({ pathname: '/grounds/detail/123' });

      const resourceBuilder: ApiQueryBuilder = {
        type: 'resource',
        query: { name: 'useGetGroundById' },
        resourceName: 'ground',
      };

      const { result } = renderHook(() => useApiQuery(resourceBuilder));

      expect(result.current.data).toEqual({ id: 123, name: 'Test Ground' });
      expect(result.current.id).toBe('123');
      expect(result.current.type).toBe('detail');
      expect(result.current.isLoading).toBe(false);
    });

    it('should detect different path types for resource', () => {
      const mockResourceQuery = {
        data: undefined,
        isLoading: false,
        error: null,
      };

      (APIManager.useGetGroundById as any).mockReturnValue(mockResourceQuery);
      (useParams as any).mockReturnValue({ id: undefined });

      const testCases = [
        { pathname: '/grounds/create', expected: 'create' },
        { pathname: '/grounds/modify/123', expected: 'modify' },
        { pathname: '/grounds/add', expected: 'add' },
        { pathname: '/grounds/123', expected: 'detail' },
      ];

      testCases.forEach(({ pathname, expected }) => {
        (useLocation as any).mockReturnValue({ pathname });

        const resourceBuilder: ApiQueryBuilder = {
          type: 'resource',
          query: { name: 'useGetGroundById' },
          resourceName: 'ground',
        };

        const { result } = renderHook(() => useApiQuery(resourceBuilder));
        expect(result.current.type).toBe(expected);
      });
    });

    it('should return default values when no ID and query name', () => {
      (useParams as any).mockReturnValue({ id: undefined });

      const resourceBuilder: ApiQueryBuilder = {
        type: 'resource',
        query: { name: undefined },
        resourceName: 'ground',
      };

      const { result } = renderHook(() => useApiQuery(resourceBuilder));

      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Invalid Query Type', () => {
    it('should throw error for unsupported query type', () => {
      const invalidBuilder = {
        type: 'invalid' as any,
        query: { name: 'useGetUsersByQuery' },
      };

      expect(() => {
        renderHook(() => useApiQuery(invalidBuilder));
      }).toThrow('Unsupported query type: invalid');
    });
  });

  describe('Logging', () => {
    it('should log query and response data', () => {
      const mockTableQuery = {
        data: {
          data: [{ id: 1, name: 'Test User' }],
          meta: { skip: 0, take: 10, itemCount: 1 },
        },
        isLoading: false,
        error: null,
      };

      (APIManager.useGetUsersByQuery as any).mockReturnValue(mockTableQuery);

      const tableBuilder: ApiQueryBuilder = {
        type: 'table',
        query: { name: 'useGetUsersByQuery', params: { filter: 'active' } },
        pagination: { enabled: true, defaultTake: 10 },
      };

      renderHook(() => useApiQuery(tableBuilder));

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('Querying'),
        expect.objectContaining({ name: 'useGetUsersByQuery' }),
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('Received response'),
        expect.objectContaining({ data: [{ id: 1, name: 'Test User' }] }),
      );
    });

    it('should log error messages', () => {
      const mockError = new Error('API Error');
      const mockListQuery = {
        data: null,
        isLoading: false,
        error: mockError,
      };

      (APIManager.useGetUsersByQuery as any).mockReturnValue(mockListQuery);

      const listBuilder: ApiQueryBuilder = {
        type: 'list',
        query: { name: 'useGetUsersByQuery' },
        listOptions: { valueField: 'id', labelField: 'name' },
      };

      renderHook(() => useApiQuery(listBuilder));

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('Error in query'),
        expect.objectContaining({ message: 'API Error' }),
      );
    });

    it('should log warnings for empty data', () => {
      const mockTableQuery = {
        data: { data: [], meta: {} },
        isLoading: false,
        error: null,
      };

      (APIManager.useGetUsersByQuery as any).mockReturnValue(mockTableQuery);
      (isEmpty as any).mockReturnValue(true);

      const tableBuilder: ApiQueryBuilder = {
        type: 'table',
        query: { name: 'useGetUsersByQuery' },
        pagination: { enabled: true },
      };

      renderHook(() => useApiQuery(tableBuilder));

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('Received empty data'),
        expect.objectContaining({ query: 'useGetUsersByQuery' }),
      );
    });

    it('should log debug information', () => {
      const mockResourceQuery = {
        data: { data: { id: 123, name: 'Test Ground' } },
        isLoading: false,
        error: null,
      };

      (APIManager.useGetGroundById as any).mockReturnValue(mockResourceQuery);
      (useParams as any).mockReturnValue({ id: '123' });
      (useLocation as any).mockReturnValue({ pathname: '/grounds/detail/123' });

      const resourceBuilder: ApiQueryBuilder = {
        type: 'resource',
        query: { name: 'useGetGroundById' },
        resourceName: 'ground',
      };

      renderHook(() => useApiQuery(resourceBuilder));

      expect(consoleSpy.debug).toHaveBeenCalledWith(
        expect.stringContaining('Resource query details'),
        expect.objectContaining({ id: 123, name: 'Test Ground' }),
      );
    });
  });

  describe('Logging and Error Notifications', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should log initialization with correct prefix [useApiQuery]', () => {
      const mockTableQuery = {
        data: { data: [], meta: {} },
        isLoading: false,
        error: null,
      };

      (APIManager.useGetUsersByQuery as any).mockReturnValue(mockTableQuery);

      const tableBuilder: ApiQueryBuilder = {
        type: 'table',
        query: { name: 'useGetUsersByQuery', params: {} },
        pagination: { enabled: true, defaultTake: 10 },
      };

      renderHook(() => useApiQuery(tableBuilder));

      // Check initialization log
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('🚀 [useApiQuery] Hook called with builder'),
        expect.objectContaining({
          type: 'table',
          queryName: 'useGetUsersByQuery',
          hasListOptions: false,
          hasPagination: true,
        }),
      );

      // Check routing log
      expect(consoleSpy.debug).toHaveBeenCalledWith(
        expect.stringContaining('📊 [useApiQuery] Routing to table query'),
        '',
      );
    });

    it('should show error toast for unsupported query type', () => {
      const invalidBuilder: any = {
        type: 'invalid',
        query: { name: 'test' },
      };

      expect(() => renderHook(() => useApiQuery(invalidBuilder))).toThrow();

      // Check error log
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('🚫 [useApiQuery] Invalid query type'),
        expect.objectContaining({ type: 'invalid' }),
      );

      // Check error toast
      expect(addToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '❌ 쿼리 타입 오류',
          description: 'Unsupported query type: invalid',
          color: 'danger',
        }),
      );
    });

    it('should log table query success with data count', () => {
      const mockTableQuery = {
        data: {
          data: [{ id: 1 }, { id: 2 }, { id: 3 }],
          meta: { skip: 0, take: 10, itemCount: 3 },
        },
        isLoading: false,
        error: null,
      };

      (APIManager.useGetUsersByQuery as any).mockReturnValue(mockTableQuery);

      const tableBuilder: ApiQueryBuilder = {
        type: 'table',
        query: { name: 'useGetUsersByQuery', params: {} },
        pagination: { enabled: true },
      };

      renderHook(() => useApiQuery(tableBuilder));

      // Check success log
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('📊 [useApiQuery] Table data loaded successfully'),
        expect.objectContaining({
          count: 3,
          pagination: { skip: 0, take: 10, itemCount: 3 },
        }),
      );
    });

    it('should show error toast for table query API errors', () => {
      const mockError = new Error('Network connection failed');
      const mockTableQuery = {
        data: null,
        isLoading: false,
        error: mockError,
      };

      (APIManager.useGetUsersByQuery as any).mockReturnValue(mockTableQuery);

      const tableBuilder: ApiQueryBuilder = {
        type: 'table',
        query: { name: 'useGetUsersByQuery', params: {} },
      };

      renderHook(() => useApiQuery(tableBuilder));

      // Check error log
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('📊 [useApiQuery] Table query error'),
        mockError,
      );

      // Check error toast
      expect(addToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '❌ 테이블 데이터 로드 실패',
          description: '데이터를 불러오는 중 오류가 발생했습니다: Network connection failed',
          color: 'danger',
        }),
      );
    });

    it('should log list query processing with options count', () => {
      const mockListQuery = {
        data: {
          data: [
            { id: 1, name: 'Option 1' },
            { id: 2, name: 'Option 2' },
          ],
        },
        isLoading: false,
        error: null,
      };

      (APIManager.useGetUsersByQuery as any).mockReturnValue(mockListQuery);
      (get as any).mockImplementation((obj: any, path: string) => {
        if (path === 'id') return obj.id;
        if (path === 'name') return obj.name;
        return undefined;
      });

      const listBuilder: ApiQueryBuilder = {
        type: 'list',
        query: { name: 'useGetUsersByQuery', params: {} },
        listOptions: { valueField: 'id', labelField: 'name' },
      };

      renderHook(() => useApiQuery(listBuilder));

      // Check success log
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('📋 [useApiQuery] List options processed successfully'),
        expect.objectContaining({
          originalDataCount: 2,
          processedOptionsCount: 2,
          sampleOption: { value: 1, text: 'Option 1' },
        }),
      );
    });

    it('should show warning toast for missing list options fields', () => {
      const listBuilder: ApiQueryBuilder = {
        type: 'list',
        query: { name: 'useGetUsersByQuery', params: {} },
        listOptions: { valueField: '', labelField: 'name' },
      };

      renderHook(() => useApiQuery(listBuilder));

      // Check error log
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('📋 [useApiQuery] Missing list options fields'),
        expect.objectContaining({ valueField: '', labelField: 'name' }),
      );

      // Check error toast
      expect(addToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '❌ 리스트 쿼리 설정 오류',
          description: 'valueField와 labelField가 필요합니다.',
          color: 'danger',
        }),
      );
    });

    it('should log resource query type detection from path', () => {
      (useLocation as any).mockReturnValue({ pathname: '/grounds/modify/123' });
      (useParams as any).mockReturnValue({ id: '123' });

      const mockResourceQuery = {
        data: { id: 123, name: 'Test Ground' },
        isLoading: false,
        error: null,
      };

      (APIManager.useGetGroundById as any).mockReturnValue(mockResourceQuery);

      const resourceBuilder: ApiQueryBuilder = {
        type: 'resource',
        query: { name: 'useGetGroundById', params: {} },
      };

      renderHook(() => useApiQuery(resourceBuilder));

      // Check type detection log
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('🗂️ [useApiQuery] Detected resource type from path'),
        expect.objectContaining({
          type: 'modify',
          pathname: '/grounds/modify/123',
        }),
      );
    });

    it('should show warning toast for missing ID in resource query', () => {
      (useLocation as any).mockReturnValue({ pathname: '/grounds/detail/undefined' });
      (useParams as any).mockReturnValue({ id: undefined });

      const resourceBuilder: ApiQueryBuilder = {
        type: 'resource',
        query: { name: 'useGetGroundById', params: {} },
      };

      renderHook(() => useApiQuery(resourceBuilder));

      // Check warning log
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('🗂️ [useApiQuery] Required ID missing for detail/modify operation'),
        expect.objectContaining({
          type: 'detail',
          args: [undefined],
        }),
      );

      // Check warning toast
      expect(addToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '⚠️ 리소스 ID 누락',
          description: 'detail 작업에 필요한 ID가 제공되지 않았습니다.',
          color: 'warning',
        }),
      );
    });

    it('should log API arguments building process', () => {
      const mockTableQuery = {
        data: { data: [], meta: {} },
        isLoading: false,
        error: null,
      };

      (APIManager.useGetUsersByQuery as any).mockReturnValue(mockTableQuery);
      (useParams as any).mockReturnValue({ groundId: 'test123' });

      const tableBuilder: ApiQueryBuilder = {
        type: 'table',
        query: {
          name: 'useGetUsersByQuery',
          params: { filter: 'active' },
          pathParams: { groundId: 'groundId' },
        },
      };

      renderHook(() => useApiQuery(tableBuilder));

      // Check API args building log
      expect(consoleSpy.debug).toHaveBeenCalledWith(
        expect.stringContaining('🔨 [useApiQuery] Building API arguments'),
        expect.objectContaining({
          pathParams: { groundId: 'groundId' },
          params: ['filter'],
          hasState: true,
          urlParams: ['groundId'],
        }),
      );

      // Check success log for args building
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('🔨 [useApiQuery] API arguments built successfully'),
        expect.objectContaining({
          argsCount: expect.any(Number),
        }),
      );
    });
  });
});
