import { APIManager } from '@shared/api-client';
import { ResourceBuilder } from '@shared/types';
import { useParams } from 'react-router';

export const useGetResourceQuery = (resourceBuilder: ResourceBuilder) => {
  const { id } = useParams<{ id: string }>();
  const query = resourceBuilder.query;

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
    };
  }

  return {
    data: undefined,
    isLoading: false,
    error: null,
    id,
  };
};
