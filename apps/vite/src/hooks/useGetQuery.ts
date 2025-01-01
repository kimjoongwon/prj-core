import { APIManager } from '@shared/frontend';
import { Query } from '@shared/types';
import { useParams } from 'react-router-dom';

export const useGetQuery = (query?: Query) => {
  const params = useParams();
  const serviceId = window.location.pathname.split('/')[4];
  const apiArgs: unknown[] = [];

  if (query?.hasResourceId) {
    apiArgs.push(params?.resourceId);
  }

  if (query?.hasServiceId) {
    query.params.serviceId = serviceId;
  }

  if (query?.hasParams) {
    apiArgs.push(query?.params);
  }

  apiArgs.push({
    enabled: !!query?.name,
  });

  const queryName = query?.name as keyof typeof APIManager;
  const getQuery = query?.name
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      APIManager?.[queryName]?.apply(null, apiArgs)
    : undefined;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const data = getQuery?.data?.data;
  const isLoading = getQuery?.isLoading;

  return {
    data,
    isLoading,
  };
};
