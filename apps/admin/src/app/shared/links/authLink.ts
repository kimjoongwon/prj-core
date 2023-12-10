import { setContext } from '@apollo/client/link/context';
import { isServer } from '../utils/isServer';

export const authLink = setContext((_, { headers }) => {
  const token = isServer() ? '' : localStorage.getItem('accessToken');
  const tenantId = isServer() ? '' : localStorage.getItem('tenantId');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'tenant-id': tenantId ? tenantId : '',
    },
  };
});
