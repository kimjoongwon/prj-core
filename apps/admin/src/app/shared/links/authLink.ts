import { setContext } from '@apollo/client/link/context';
import { storage } from '@libs';
import { authStore } from '@stores';

export const authLink = setContext(async (_, { headers }) => {
  const tenantId = storage.getItem('tenantId');
  const accessToken = authStore.accessToken;

  return {
    headers: {
      ...headers,
      authorization: accessToken
        ? `Bearer ${accessToken}`
        : undefined,
      'tenant-id': tenantId ? tenantId : '',
    },
  };
});
