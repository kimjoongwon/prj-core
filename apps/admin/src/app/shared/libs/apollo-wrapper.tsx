'use client';

import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
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
import { __DEV__ } from '@apollo/client/utilities/globals';

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const removeTypenameLink = removeTypenameFromVariables();

function makeClient() {
  return new NextSSRApolloClient({
    connectToDevTools: true,
    cache: new NextSSRInMemoryCache({
      typePolicies: {
        Users: {
          keyFields: ['pageInfo', ['endCursor']],
        },
      },
    }),
    link: from(
      isServer()
        ? [
            ssrMultipartLink,
            errorLink,
            roundTripLink,
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
