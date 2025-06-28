import { APIManager } from '@shared/api-client';
import { ApiQueryBuilder, ApiQueryResult } from '@shared/types';
import { isEmpty, get } from 'lodash-es';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useParams, useLocation } from 'react-router';
import { addToast } from '@heroui/react';
import { usePage } from '../provider';

export const useApiQuery = (builder: ApiQueryBuilder): ApiQueryResult => {
  console.log('[useApiQuery] Called with builder:', builder);

  switch (builder.type) {
    case 'table':
      return useTableQuery(builder);
    case 'list':
      return useListQuery(builder);
    case 'resource':
      return useResourceQuery(builder);
    default:
      throw new Error(`Unsupported query type: ${(builder as any).type}`);
  }
};

// pathParams에서 state 값을 추출하여 API 인자 배열을 구성하는 유틸리티
const buildApiArgs = (
  pathParams?: Record<string, string>,
  params?: any,
  state?: any,
  urlParams?: Record<string, string | undefined>,
): unknown[] => {
  const args: unknown[] = [];

  console.log('[buildApiArgs] Input parameters:', {
    pathParams,
    params,
    state,
    urlParams,
  });

  // pathParams 처리: state 또는 URL 파라미터에서 각 키의 값을 추출하여 개별 인자로 추가
  if (pathParams) {
    Object.keys(pathParams).forEach(key => {
      const statePath = pathParams[key];
      
      // 먼저 state에서 값을 찾고, 없으면 URL 파라미터에서 찾기
      let value = state ? get(state, statePath) : undefined;
      
      // state에서 값을 찾지 못했고, statePath가 URL 파라미터 키와 같다면 URL 파라미터에서 값 가져오기
      if (value === undefined && urlParams && urlParams[statePath]) {
        value = urlParams[statePath];
      }
      
      // 여전히 값이 없고, key가 URL 파라미터에 있다면 그것을 사용
      if (value === undefined && urlParams && urlParams[key]) {
        value = urlParams[key];
      }
      
      console.log(`[buildApiArgs] Processing pathParam ${key} -> ${statePath}:`, {
        fromState: state ? get(state, statePath) : 'no state',
        fromUrlParams: urlParams?.[statePath] || urlParams?.[key] || 'not found',
        finalValue: value,
      });
      
      args.push(value);
    });
  }

  // params 처리: 전체 객체를 하나의 인자로 추가
  if (params && !isEmpty(params)) {
    args.push(params);
  } else if (!pathParams || Object.keys(pathParams).length === 0) {
    // pathParams가 없고 params도 비어있으면 빈 객체 추가
    args.push({});
  }

  console.log('[buildApiArgs] Final args:', args);

  return args;
};

// 테이블 쿼리 처리
export const useTableQuery = (builder: ApiQueryBuilder): ApiQueryResult => {
  const page = usePage();
  const params = useParams();
  const query = builder.query;
  const initialSkip = query?.params?.skip || 0;
  const initialTake =
    builder.pagination?.defaultTake || query?.params?.take || 10;

  console.log('[useTableQuery] Initial values:', {
    initialSkip,
    initialTake,
    queryParams: query?.params,
  });

  const [skip, setSkip] = useQueryState(
    'skip',
    parseAsInteger.withDefault(initialSkip),
  );
  const [take, setTake] = useQueryState(
    'take',
    parseAsInteger.withDefault(initialTake),
  );

  console.log('[useTableQuery] Current values:', { skip, take });

  let queryParams = {
    ...query?.params,
    skip,
    take,
  };

  console.log('[useTableQuery] Final queryParams:', queryParams);

  // pathParams와 params를 사용하여 API 인자 배열 구성
  const apiArgs = buildApiArgs(query?.pathParams, queryParams, page.state, params);

  if (apiArgs.length > 0) {
    apiArgs.push({
      query: {
        enabled: !!query?.name,
      },
    });
  }

  const queryName = query?.name as keyof typeof APIManager;
  const getQuery = query?.name
    ? (APIManager as any)?.[queryName]?.apply?.(null, apiArgs)
    : undefined;

  const data = getQuery?.data?.data;
  const pageMeta = getQuery?.data?.meta;
  const isLoading = getQuery?.isLoading;

  console.log('[useTableQuery] Response:', {
    data: data?.length,
    meta: pageMeta,
    isLoading,
  });

  return {
    data,
    meta: pageMeta,
    isLoading: isLoading || false,
    skip,
    take,
    setSkip,
    setTake,
  };
};

// 리스트 쿼리 처리
export const useListQuery = (builder: ApiQueryBuilder): ApiQueryResult => {
  const page = usePage();
  const params = useParams();
  const query = builder.query;
  const { valueField, labelField } = builder.listOptions || {
    valueField: '',
    labelField: '',
  };

  console.log('[ListboxBuilder] useListQuery called with:', query);

  // pathParams와 params를 사용하여 API 인자 배열 구성
  const apiArgs = buildApiArgs(query?.pathParams, query?.params, page.state, params);

  apiArgs.push({
    query: {
      enabled: !!query.name,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  });

  if (!query.name) {
    console.error('[ListboxBuilder] No query name provided');
    addToast({
      title: '🔑 ListboxBuilder 오류',
      description: 'API 키가 제공되지 않았습니다.',
      color: 'danger',
    });
    return { options: [], isLoading: false };
  }

  console.log('[ListboxBuilder] Making API call to:', query.name);

  const queryName = query.name as keyof typeof APIManager;

  if (!APIManager[queryName]) {
    console.error('[ListboxBuilder] API method not found:', queryName);
    addToast({
      title: '🔍 ListboxBuilder 오류',
      description: `API 메서드를 찾을 수 없습니다: ${queryName}`,
      color: 'danger',
    });
    return { options: [], isLoading: false };
  }

  const getQuery = (APIManager as any)[queryName].apply(null, apiArgs);

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
    return { options: [], isLoading: isLoading || false };
  }

  const options = data.map((item: any, index: number) => {
    const value = get(item, valueField);
    const text = get(item, labelField) || get(item, valueField, '');

    if (value === undefined) {
      console.warn(
        `[ListboxBuilder] Item at index ${index} is missing valueField '${valueField}':`,
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
    isLoading: isLoading || false,
  };
};

// 리소스 쿼리 처리
export const useResourceQuery = (builder: ApiQueryBuilder): ApiQueryResult => {
  const page = usePage();
  const location = useLocation();
  const params = useParams();
  const query = builder.query;

  console.log('[useResourceQuery] Called with:', {
    pathname: location.pathname,
    params,
    pageState: page.state,
    queryName: query?.name,
    pathParams: query?.pathParams,
    queryParams: query?.params,
    builder,
  });

  // 경로를 통해 type 판별
  const getTypeFromPath = (pathname: string): string => {
    if (pathname.includes('/create')) {
      return 'create';
    } else if (pathname.includes('/modify')) {
      return 'modify';
    } else if (pathname.includes('/detail')) {
      return 'detail';
    } else if (pathname.includes('/add')) {
      return 'add';
    }
    // 기본값으로 detail 반환 (기존 /:id 형태의 경로)
    return 'detail';
  };

  const type = getTypeFromPath(location.pathname) as
    | 'create'
    | 'modify'
    | 'detail'
    | 'add';

  console.log('[useResourceQuery] Detected type:', type);

  // Resource ID가 있으면 개별 리소스 조회용 함수 호출
  // pathParams와 params를 사용하여 API 인자 배열 구성
  // 리소스의 경우 일반적으로 id가 첫 번째 인자로 전달됨
  const apiArgs = buildApiArgs(query?.pathParams, query?.params, page.state, params);

  console.log('[useResourceQuery] Built apiArgs:', apiArgs);

  // create 타입이면 데이터를 가져오지 않음
  const shouldFetchData = type !== 'create' && !!query?.name;
  
  // detail/modify 타입이면 ID가 필요함
  const needsId = type === 'detail' || type === 'modify';
  const hasValidArgs = needsId ? apiArgs.length > 0 && apiArgs[0] !== undefined && apiArgs[0] !== null : true;

  console.log('[useResourceQuery] Query conditions:', {
    shouldFetchData,
    needsId,
    hasValidArgs,
    firstArg: apiArgs[0],
    enabled: shouldFetchData && hasValidArgs,
  });

  // 옵션 추가
  apiArgs.push({
    query: {
      enabled: shouldFetchData && hasValidArgs,
    },
  });

  const queryName = query?.name as keyof typeof APIManager;
  const getQuery = query?.name
    ? (APIManager as any)?.[queryName]?.apply?.(null, apiArgs)
    : undefined;

  const data = getQuery?.data?.data || getQuery?.data;
  const isLoading = getQuery?.isLoading;
  const error = getQuery?.error;

  console.log('[useResourceQuery] Response:', {
    data,
    isLoading,
    error,
    queryEnabled: shouldFetchData && hasValidArgs,
  });

  // URL 파라미터에서 ID 추출
  const id = (params?.groundId || params?.id || apiArgs[0]) as string;

  return {
    data,
    isLoading: isLoading || false,
    error,
    type,
    id,
  };
};
