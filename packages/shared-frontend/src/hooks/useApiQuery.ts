import { APIManager } from '@shared/api-client';
import { ApiQueryBuilder, ApiQueryResult } from '@shared/types';
import { isEmpty, get } from 'lodash-es';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useLocation } from '@tanstack/react-router';
import { addToast } from '@heroui/react';
import { LoggerUtil } from '@shared/utils';
import { usePage } from '../provider';

// 🎯 Debug logger utility for useApiQuery
const logger = LoggerUtil.create('[useApiQuery]');

// 🚨 Toast notification utility
const showToast = {
  success: (title: string, description?: string) => {
    addToast({
      title: `✅ ${title}`,
      description,
      color: 'success',
    });
  },
  error: (title: string, description?: string) => {
    addToast({
      title: `❌ ${title}`,
      description,
      color: 'danger',
    });
  },
  warning: (title: string, description?: string) => {
    addToast({
      title: `⚠️ ${title}`,
      description,
      color: 'warning',
    });
  },
  info: (title: string, description?: string) => {
    addToast({
      title: `ℹ️ ${title}`,
      description,
      color: 'primary',
    });
  },
};

export const useApiQuery = (builder: ApiQueryBuilder): ApiQueryResult => {
  logger.info('🚀 Hook called with builder', {
    type: builder.type,
    queryName: builder.query?.name,
    hasListOptions: !!builder.listOptions,
    hasPagination: !!builder.pagination
  });

  try {
    switch (builder.type) {
      case 'table':
        logger.debug('📊 Routing to table query');
        return useTableQuery(builder);
      case 'list':
        logger.debug('📋 Routing to list query');
        return useListQuery(builder);
      case 'resource':
        logger.debug('🗂️ Routing to resource query');
        return useResourceQuery(builder);
      default:
        const errorMsg = `Unsupported query type: ${(builder as any).type}`;
        logger.error('🚫 Invalid query type', { type: (builder as any).type });
        showToast.error('쿼리 타입 오류', errorMsg);
        throw new Error(errorMsg);
    }
  } catch (error) {
    logger.error('💥 Hook execution failed', error);
    showToast.error('API 쿼리 실행 실패', error instanceof Error ? error.message : '알 수 없는 오류');
    throw error;
  }
};

// 🔧 pathParams에서 state 값을 추출하여 API 인자 배열을 구성하는 유틸리티
const buildApiArgs = (
  pathParams?: Record<string, string>,
  params?: any,
  state?: any,
  urlParams?: Record<string, string | undefined>,
): unknown[] => {
  logger.debug('🔨 Building API arguments', {
    pathParams,
    params: params ? Object.keys(params) : 'none',
    hasState: !!state,
    urlParams: urlParams ? Object.keys(urlParams) : 'none',
  });

  const args: unknown[] = [];

  try {
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
        
        logger.debug(`🎯 Processing pathParam ${key} -> ${statePath}`, {
          fromState: state ? get(state, statePath) : 'no state',
          fromUrlParams: urlParams?.[statePath] || urlParams?.[key] || 'not found',
          finalValue: value,
        });
        
        if (value === undefined) {
          logger.warning(`🔍 PathParam value not found for ${key} -> ${statePath}`);
        }
        
        args.push(value);
      });
    }

    // params 처리: 전체 객체를 하나의 인자로 추가
    if (params && !isEmpty(params)) {
      logger.debug('📦 Adding params to args', params);
      args.push(params);
    } else if (!pathParams || Object.keys(pathParams).length === 0) {
      // pathParams가 없고 params도 비어있으면 빈 객체 추가
      logger.debug('📦 Adding empty params object');
      args.push({});
    }

    logger.success('🔨 API arguments built successfully', {
      argsCount: args.length,
      args: args.map((arg, index) => ({ index, type: typeof arg, value: arg }))
    });

    return args;
  } catch (error) {
    logger.error('💥 Failed to build API arguments', error);
    showToast.error('API 인자 생성 실패', error instanceof Error ? error.message : '알 수 없는 오류');
    return [];
  }
};

// 📊 테이블 쿼리 처리
export const useTableQuery = (builder: ApiQueryBuilder): ApiQueryResult => {
  logger.info('📊 Starting table query', { queryName: builder.query?.name });

  try {
    const page = usePage();
    const params = page.state?.params; // PageProvider의 state.params 사용
    const query = builder.query;
    const initialSkip = query?.params?.skip || 0;
    const initialTake = builder.pagination?.defaultTake || query?.params?.take || 10;

    logger.debug('📊 Table query initial values', {
      initialSkip,
      initialTake,
      queryParams: query?.params,
      paginationEnabled: builder.pagination?.enabled
    });

    const [skip, setSkip] = useQueryState(
      'skip',
      parseAsInteger.withDefault(initialSkip),
    );
    const [take, setTake] = useQueryState(
      'take',
      parseAsInteger.withDefault(initialTake),
    );

    logger.debug('📊 Current pagination values', { skip, take });

    let queryParams = {
      ...query?.params,
      skip,
      take,
    };

    logger.debug('📊 Final query parameters', queryParams);

    // pathParams와 params를 사용하여 API 인자 배열 구성
    const apiArgs = buildApiArgs(query?.pathParams, queryParams, page.state, params);

    if (apiArgs.length > 0) {
      apiArgs.push({
        query: {
          enabled: !!query?.name,
        },
      });
    }

    if (!query?.name) {
      logger.error('📊 No query name provided for table');
      showToast.error('테이블 쿼리 오류', 'API 쿼리 이름이 제공되지 않았습니다.');
      return {
        data: [],
        meta: undefined,
        isLoading: false,
        skip,
        take,
        setSkip,
        setTake,
      };
    }

    const queryName = query.name as keyof typeof APIManager;
    
    if (!APIManager[queryName]) {
      logger.error('📊 API method not found', { queryName });
      showToast.error('테이블 쿼리 오류', `API 메서드를 찾을 수 없습니다: ${queryName}`);
      return {
        data: [],
        meta: undefined,
        isLoading: false,
        skip,
        take,
        setSkip,
        setTake,
      };
    }

    const getQuery = (APIManager as any)?.[queryName]?.apply?.(null, apiArgs);

    const data = getQuery?.data?.data;
    const pageMeta = getQuery?.data?.meta;
    const isLoading = getQuery?.isLoading;
    const error = getQuery?.error;

    logger.debug('📊 Table query response', {
      dataCount: Array.isArray(data) ? data.length : 'not array',
      meta: pageMeta,
      isLoading,
      hasError: !!error
    });

    if (error) {
      logger.error('📊 Table query error', error);
      showToast.error('테이블 데이터 로드 실패', `데이터를 불러오는 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    } else if (!isLoading && data) {
      logger.success('📊 Table data loaded successfully', {
        count: Array.isArray(data) ? data.length : 'single item',
        pagination: pageMeta
      });
    }

    return {
      data,
      meta: pageMeta,
      isLoading: isLoading || false,
      skip,
      take,
      setSkip,
      setTake,
      error,
    };
  } catch (error) {
    logger.error('💥 Table query execution failed', error);
    showToast.error('테이블 쿼리 실패', error instanceof Error ? error.message : '알 수 없는 오류');
    throw error;
  }
};

// 📋 리스트 쿼리 처리
export const useListQuery = (builder: ApiQueryBuilder): ApiQueryResult => {
  logger.info('📋 Starting list query', { queryName: builder.query?.name });

  try {
    const page = usePage();
    const params = page.state?.params; // PageProvider의 state.params 사용
    const query = builder.query;
    const { valueField, labelField } = builder.listOptions || {
      valueField: '',
      labelField: '',
    };

    logger.debug('📋 List query configuration', {
      queryName: query?.name,
      valueField,
      labelField,
      hasPathParams: !!query?.pathParams,
      hasParams: !!query?.params
    });

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
      logger.error('📋 No query name provided for list');
      showToast.error('리스트 쿼리 오류', 'API 키가 제공되지 않았습니다.');
      return { options: [], isLoading: false };
    }

    if (!valueField || !labelField) {
      logger.error('📋 Missing list options fields', { valueField, labelField });
      showToast.error('리스트 쿼리 설정 오류', 'valueField와 labelField가 필요합니다.');
      return { options: [], isLoading: false };
    }

    logger.debug('📋 Making API call', { queryName: query.name, argsCount: apiArgs.length });

    const queryName = query.name as keyof typeof APIManager;

    if (!APIManager[queryName]) {
      logger.error('📋 API method not found', { queryName });
      showToast.error('리스트 쿼리 오류', `API 메서드를 찾을 수 없습니다: ${queryName}`);
      return { options: [], isLoading: false };
    }

    const getQuery = (APIManager as any)[queryName].apply(null, apiArgs);

    const data = getQuery?.data?.data || [];
    const isLoading = getQuery?.isLoading;
    const error = getQuery?.error;

    logger.debug('📋 List query response', {
      dataCount: Array.isArray(data) ? data.length : 'not array',
      isLoading,
      hasError: !!error
    });

    if (error) {
      logger.error('📋 List query error', error);
      showToast.error('리스트 데이터 로드 실패', `데이터를 불러오는 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
      return { options: [], isLoading: isLoading || false, error };
    }

    if (!data || !Array.isArray(data)) {
      logger.warning('📋 Invalid data format received', { data: typeof data });
      if (!isLoading) {
        showToast.warning('리스트 데이터 형식 오류', '올바르지 않은 데이터 형식이 반환되었습니다.');
      }
      return { options: [], isLoading: isLoading || false };
    }

    const options = data.map((item: any, index: number) => {
      const value = get(item, valueField);
      const text = get(item, labelField) || get(item, valueField, '');

      if (value === undefined) {
        logger.warning(`📋 Item missing valueField '${valueField}' at index ${index}`, item);
      }

      return {
        value,
        text: text || `Item ${index + 1}`, // Fallback text
      };
    });

    logger.success('📋 List options processed successfully', {
      originalDataCount: data.length,
      processedOptionsCount: options.length,
      sampleOption: options[0]
    });

    if (options.length === 0 && !isLoading && data.length === 0) {
      logger.info('📋 No data available for list');
      showToast.info('리스트 데이터 없음', '표시할 데이터가 없습니다.');
    }

    return {
      options,
      isLoading: isLoading || false,
    };
  } catch (error) {
    logger.error('💥 List query execution failed', error);
    showToast.error('리스트 쿼리 실패', error instanceof Error ? error.message : '알 수 없는 오류');
    return { options: [], isLoading: false, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

// 🗂️ 리소스 쿼리 처리
export const useResourceQuery = (builder: ApiQueryBuilder): ApiQueryResult => {
  logger.info('🗂️ Starting resource query', { queryName: builder.query?.name });

  try {
    const page = usePage();
    const location = useLocation();
    const params = page.state?.params; // PageProvider의 state.params 사용
    const query = builder.query;

    logger.debug('🗂️ Resource query context', {
      pathname: location.pathname,
      params,
      hasPageState: !!page.state,
      queryName: query?.name,
      pathParams: query?.pathParams,
      queryParams: query?.params,
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

    logger.info('🗂️ Detected resource type from path', { 
      type, 
      pathname: location.pathname 
    });

    // Resource ID가 있으면 개별 리소스 조회용 함수 호출
    // pathParams와 params를 사용하여 API 인자 배열 구성
    // 리소스의 경우 일반적으로 id가 첫 번째 인자로 전달됨
    const apiArgs = buildApiArgs(query?.pathParams, query?.params, page.state, params);

    logger.debug('🗂️ Built API arguments for resource', { 
      argsCount: apiArgs.length,
      firstArg: apiArgs[0]
    });

    // create 타입이면 데이터를 가져오지 않음
    const shouldFetchData = type !== 'create' && !!query?.name;
    
    // detail/modify 타입이면 ID가 필요함
    const needsId = type === 'detail' || type === 'modify';
    const hasValidArgs = needsId ? apiArgs.length > 0 && apiArgs[0] !== undefined && apiArgs[0] !== null : true;

    logger.debug('🗂️ Query conditions analysis', {
      shouldFetchData,
      needsId,
      hasValidArgs,
      firstArg: apiArgs[0],
      enabled: shouldFetchData && hasValidArgs,
    });

    if (needsId && !hasValidArgs) {
      logger.warning('🗂️ Required ID missing for detail/modify operation', {
        type,
        args: apiArgs
      });
      showToast.warning('리소스 ID 누락', `${type} 작업에 필요한 ID가 제공되지 않았습니다.`);
    }

    if (!query?.name && shouldFetchData) {
      logger.error('🗂️ No query name provided for resource');
      showToast.error('리소스 쿼리 오류', 'API 쿼리 이름이 제공되지 않았습니다.');
      return {
        data: null,
        isLoading: false,
        error: new Error('No query name provided'),
        type,
        id: (params?.groundId || params?.id || apiArgs[0]) as string,
      };
    }

    // 옵션 추가
    apiArgs.push({
      query: {
        enabled: shouldFetchData && hasValidArgs,
      },
    });

    const queryName = query?.name as keyof typeof APIManager;
    
    let getQuery: any = undefined;
    if (query?.name && shouldFetchData) {
      if (!APIManager[queryName]) {
        logger.error('🗂️ API method not found', { queryName });
        showToast.error('리소스 쿼리 오류', `API 메서드를 찾을 수 없습니다: ${queryName}`);
        return {
          data: null,
          isLoading: false,
          error: new Error(`API method not found: ${queryName}`),
          type,
          id: (params?.groundId || params?.id || apiArgs[0]) as string,
        };
      }
      
      getQuery = (APIManager as any)?.[queryName]?.apply?.(null, apiArgs);
    }

    const data = getQuery?.data?.data || getQuery?.data;
    const isLoading = getQuery?.isLoading;
    const error = getQuery?.error;

    logger.debug('🗂️ Resource query response', {
      hasData: !!data,
      dataType: typeof data,
      isLoading,
      hasError: !!error,
      queryEnabled: shouldFetchData && hasValidArgs,
    });

    if (error) {
      logger.error('🗂️ Resource query error', error);
      showToast.error('리소스 데이터 로드 실패', `리소스 데이터를 불러오는 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    } else if (!isLoading && data && shouldFetchData) {
      logger.success('🗂️ Resource data loaded successfully', {
        type,
        hasData: !!data,
        dataKeys: typeof data === 'object' && data ? Object.keys(data) : 'not object'
      });
    } else if (type === 'create') {
      logger.info('🗂️ Create mode - no data fetch required');
    }

    // URL 파라미터에서 ID 추출
    const id = (params?.groundId || params?.id || apiArgs[0]) as string;

    logger.debug('🗂️ Final resource query result', {
      type,
      id,
      hasData: !!data,
      isLoading,
      hasError: !!error
    });

    return {
      data,
      isLoading: isLoading || false,
      error,
      type,
      id,
    };
  } catch (error) {
    logger.error('💥 Resource query execution failed', error);
    showToast.error('리소스 쿼리 실패', error instanceof Error ? error.message : '알 수 없는 오류');
    
    const page = usePage();
    const params = page.state?.params; // PageProvider의 state.params 사용
    const location = useLocation();
    const getTypeFromPath = (pathname: string): string => {
      if (pathname.includes('/create')) return 'create';
      if (pathname.includes('/modify')) return 'modify';
      if (pathname.includes('/detail')) return 'detail';
      if (pathname.includes('/add')) return 'add';
      return 'detail';
    };
    
    return {
      data: null,
      isLoading: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
      type: getTypeFromPath(location.pathname) as 'create' | 'modify' | 'detail' | 'add',
      id: (params?.groundId || params?.id) as string,
    };
  }
};
