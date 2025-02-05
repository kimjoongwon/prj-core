import { APIManager } from '@shared/frontend';
import { TableBuilder } from '@shared/types';
import { isEmpty } from 'lodash-es';
import { useSearchParams } from 'next/navigation';

export const useGetTableQuery = (tableBuilder: TableBuilder) => {
  const searchParams = useSearchParams();
  const query = tableBuilder.query;
  const searchParamsObject = Object.fromEntries(searchParams.entries());
  const apiArgs: unknown[] = [];

  let queryParams = {
    ...query?.params,
    ...searchParamsObject,
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
  console.log('isLoading', isLoading);
  return {
    data,
    meta: pageMeta,
    isLoading,
  };
};
