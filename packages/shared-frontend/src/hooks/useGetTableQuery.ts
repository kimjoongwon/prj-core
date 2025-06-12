import { APIManager } from '@shared/api-client';
import { TableBuilder } from '@shared/types';
import { isEmpty } from 'lodash-es';
import { parseAsInteger, useQueryState } from 'nuqs';

export const useGetTableQuery = (tableBuilder: TableBuilder) => {
  const query = tableBuilder.query;
  const [skip, setSkip] = useQueryState('skip', parseAsInteger.withDefault(0));
  const [take, setTake] = useQueryState('take', parseAsInteger.withDefault(10));
  const apiArgs: unknown[] = [];

  let queryParams = {
    ...query?.params,
    skip,
    take,
  };

  if (JSON.stringify(queryParams) === '{}') {
    apiArgs.push({});
  }

  if (!isEmpty(queryParams)) {
    apiArgs.push(queryParams);
  }

  if (apiArgs.length > 0) {
    apiArgs.push({
      query: {
        enabled: !!query?.name,
      },
    });
  }

  const queryName = query?.name as keyof typeof APIManager;
  const getQuery = query?.name
    ? // @ts-ignore
      APIManager?.[queryName]?.apply(null, apiArgs)
    : undefined;

  // @ts-ignore
  const data = getQuery?.data?.data;
  // @ts-ignore
  const pageMeta = getQuery?.data?.meta;
  const isLoading = getQuery?.isLoading;

  return {
    data,
    meta: pageMeta,
    isLoading,
    skip,
    take,
    setSkip,
    setTake,
  };
};
