import { APIManager } from '@shared/frontend';
import { TableBuilder } from '@shared/types';
import { useParams, useSearchParams } from 'react-router-dom';

export const useGetTableQuery = (tableBuilder: TableBuilder) => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const query = tableBuilder.query;
  const searchParamsObject = Object.fromEntries(searchParams.entries());

  const serviceId = window.location.pathname.split('/')[4];
  const apiArgs: unknown[] = [];

  if (query?.hasResourceId) {
    apiArgs.push(params?.resourceId);
  }

  if (query?.hasServiceId) {
    query.params.serviceId = serviceId;
  }

  if (query?.hasParams) {
    apiArgs.push({ ...query?.params, ...searchParamsObject });
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const pageMeta = getQuery?.data?.meta;
  const isLoading = getQuery?.isLoading;

  return {
    data,
    meta: pageMeta,
    isLoading,
  };
};
