import { APIManager } from '@shared/frontend';
import { Query } from '@shared/types';
import { get, isEmpty } from 'lodash-es';
import { useParams } from 'react-router-dom';

export const useGetQuery = (query?: Query) => {
  let params = useParams();
  const serviceId = window.location.pathname.split('/')[5];
  const apiArgs: unknown[] = [];

  const context = {
    ...params,
    serviceId,
  };

  let queryParams = {
    ...query?.params,
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
  const isFetchedAfterMount = getQuery?.isFetchedAfterMount;

  return {
    data,
    isFetchedAfterMount: isFetchedAfterMount ?? true,
    isLoading,
  };
};
