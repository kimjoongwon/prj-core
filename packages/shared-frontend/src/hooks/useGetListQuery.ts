import { APIManager } from '@shared/api-client';
import { ListboxBuilderQuery } from '@shared/types';
import { get, isEmpty } from 'lodash-es';
import { addToast } from '@heroui/react';

export const useGetListQuery = (query: ListboxBuilderQuery) => {
  console.log('[ListboxBuilder] useGetListQuery called with:', query);

  const apiArgs: unknown[] = [];

  if (isEmpty(query.params)) {
    apiArgs.push({});
  } else {
    console.log('[ListboxBuilder] Using params:', query.params);
    apiArgs.push(query.params);
  }

  apiArgs.push({
    query: {
      enabled: !!query.apiKey,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  });

  if (!query.apiKey) {
    console.error('[ListboxBuilder] No apiKey provided');
    addToast({
      title: '🔑 ListboxBuilder 오류',
      description: 'API 키가 제공되지 않았습니다.',
      color: 'danger',
    });
    return { options: [], isLoading: false };
  }

  console.log('[ListboxBuilder] Making API call to:', query.apiKey);

  const queryName = query.apiKey as keyof typeof APIManager;

  if (!APIManager[queryName]) {
    console.error('[ListboxBuilder] API method not found:', queryName);
    addToast({
      title: '🔍 ListboxBuilder 오류',
      description: `API 메서드를 찾을 수 없습니다: ${queryName}`,
      color: 'danger',
    });
    return { options: [], isLoading: false };
  }

  const getQuery = APIManager[queryName].apply(null, apiArgs);

  const data = getQuery?.data?.data || [];
  const isLoading = getQuery?.isLoading;
  const error = getQuery?.error;

  console.log(
    '[ListboxBuilder] API response - data:',
    data,
    'isLoading:',
    isLoading,
  );

  if (error) {
    console.error('[ListboxBuilder] API error:', error);
    addToast({
      title: '💥 ListboxBuilder 오류',
      description: `데이터를 불러오는 중 오류가 발생했습니다: ${
        error.message || '알 수 없는 오류'
      }`,
      color: 'danger',
    });
  }

  if (!data || !Array.isArray(data)) {
    console.warn('[ListboxBuilder] Invalid data format received:', data);
    if (!isLoading) {
      addToast({
        title: '⚠️ ListboxBuilder 경고',
        description: '올바르지 않은 데이터 형식이 반환되었습니다.',
        color: 'warning',
      });
    }
    return { options: [], isLoading };
  }

  const options = data.map((item: any, index: number) => {
    const value = get(item, query.valueField);
    const text = get(item, query.labelField) || get(item, query.valueField, '');

    if (value === undefined) {
      console.warn(
        `[ListboxBuilder] Item at index ${index} is missing valueField '${query.valueField}':`,
        item,
      );
    }

    return {
      value,
      text: text || `Item ${index + 1}`, // Fallback text
    };
  });

  console.log('[ListboxBuilder] Processed options:', options);

  if (options.length === 0 && !isLoading) {
    addToast({
      title: '📋 ListboxBuilder 정보',
      description: '데이터가 없습니다.',
      color: 'warning',
    });
  }

  return {
    options,
    isLoading,
  };
};
