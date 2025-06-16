import { APIManager } from '@shared/api-client';
import { ResourceBuilder } from '@shared/types';
import { useParams, useLocation } from 'react-router';

export const useGetResourceQuery = (resourceBuilder: ResourceBuilder) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const query = resourceBuilder.query;

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

  const type = getTypeFromPath(location.pathname);

  console.log(
    'id:',
    id,
    'type:',
    type,
    'pathname:',
    location.pathname,
    'query:',
    query,
  );
  const apiArgs: unknown[] = [];

  // Resource ID가 있으면 개별 리소스 조회용 함수 호출
  if (id && query?.name) {
    // 예: useGetGroundById 형태의 함수 호출
    const queryName = query.name as keyof typeof APIManager;
    apiArgs.push(id);

    // 옵션 추가
    if (apiArgs.length > 0) {
      apiArgs.push({
        query: {
          enabled: !!id,
        },
      });
    }

    const getQuery = APIManager?.[queryName]?.apply(null, apiArgs);

    const data = getQuery?.data?.data || getQuery?.data;
    const isLoading = getQuery?.isLoading;
    const error = getQuery?.error;

    return {
      data,
      isLoading,
      error,
      id,
      type,
    };
  }

  return {
    data: undefined,
    isLoading: false,
    error: null,
    id,
    type,
  };
};
