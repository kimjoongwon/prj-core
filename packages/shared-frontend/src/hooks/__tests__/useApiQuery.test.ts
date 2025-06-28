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

vi.mock('react-router', () => ({
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

import { APIManager } from '@shared/api-client';
import { useQueryState } from 'nuqs';
import { useParams, useLocation } from 'react-router';
import { addToast } from '@heroui/react';
import { isEmpty, get } from 'lodash-es';
import type { ApiQueryBuilder } from '@shared/types';
import { useApiQuery } from '../useApiQuery';

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
});
