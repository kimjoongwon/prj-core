import { setContext } from '@apollo/client/link/context';
import { getItem } from '../libs/storage';

export const authLink = setContext(async (_, { headers }) => {
  const tenantId = getItem('tenantId');
  const accessToken = getItem('accessToken');

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${accessToken}`,
      'tenant-id': tenantId ? tenantId : '',
    },
  };
});
