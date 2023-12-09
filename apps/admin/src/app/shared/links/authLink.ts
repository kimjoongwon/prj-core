import { setContext } from '@apollo/client/link/context';
import { isServer } from '../utils/isServer';

export const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = isServer() ? '' : localStorage.getItem('accessToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
