import { APIManager } from '@shared/frontend';
import { TableBuilder } from '@shared/types';
import { get, isEmpty } from 'lodash-es';
import { useParams, useSearchParams } from 'react-router-dom';

export const useGetTableQuery = (tableBuilder: TableBuilder) => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const query = tableBuilder.query;
  const searchParamsObject = Object.fromEntries(searchParams.entries());

  const serviceId = window.location.pathname.split('/')[5];
  const apiArgs: unknown[] = [];
  const context = {
    ...params,
    serviceId,
  };

  let queryParams = {
    ...query?.params,
    ...searchParamsObject,
  };

  if (query?.mapper) {
    Object.keys(query.mapper).map(key => {
      const value = get(context, key);
      queryParams = {
        ...queryParams,
        [query.mapper[key]]: value,
      };
    });
  }
  if (!isEmpty(queryParams)) {
    apiArgs.push(queryParams);
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
  console.log('getQuery', getQuery);
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
