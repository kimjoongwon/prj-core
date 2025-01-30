import { APIManager } from '@shared/frontend';
import { TableBuilder } from '@shared/types';
import { get, isEmpty } from 'lodash-es';
import { useParams, useSearchParams } from 'next/navigation';

export const useGetTableQuery = (tableBuilder: TableBuilder) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const query = tableBuilder.query;
  const searchParamsObject = Object.fromEntries(searchParams.entries());
  const apiArgs: unknown[] = [];
  const context = {
    ...params,
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
  if (query?.idMapper) {
    // @ts-ignore
    const resourceId = context?.[query.idMapper];
    apiArgs.push(resourceId);
  }

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
  console.log('apiArgs', apiArgs);
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
  };
};
