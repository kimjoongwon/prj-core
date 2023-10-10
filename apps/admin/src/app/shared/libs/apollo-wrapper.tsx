'use client';

import { from } from '@apollo/client';
import {
  NextSSRApolloClient,
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { isServer } from '../utils/isServer';
import {
  authLink,
  errorLink,
  httpLink,
  roundTripLink,
  ssrMultipartLink,
} from '@links';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';

const removeTypenameLink = removeTypenameFromVariables();

function makeClient() {
  return new NextSSRApolloClient({
    connectToDevTools: true,
    cache: new NextSSRInMemoryCache({
      typePolicies: {
        PaginatedUser: {
          keyFields: [],
        },
      },
    }),
    link: from(
      isServer()
        ? [
            errorLink,
            ssrMultipartLink,
            roundTripLink,
            authLink,
            removeTypenameLink,
            httpLink,
          ]
        : [errorLink, roundTripLink, authLink, removeTypenameLink, httpLink],
    ),
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
