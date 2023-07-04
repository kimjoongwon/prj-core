'use client';

import { HttpLink, SuspenseCache, from } from '@apollo/client';
import {
  NextSSRApolloClient,
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { isServer } from '../utils/isServer';
import { errorLink } from '../links';

function makeClient() {
  const httpLink = new HttpLink({
    // https://studio.apollographql.com/public/spacex-l4uc6p/
    uri: process.env.NEXT_PUBLIC_API_URL,
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: from(
      isServer()
        ? [
            errorLink,
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ]
        : [errorLink, httpLink],
    ),
  });
}

function makeSuspenseCache() {
  return new SuspenseCache();
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider
      makeClient={makeClient}
      makeSuspenseCache={makeSuspenseCache}
    >
      {children}
    </ApolloNextAppProvider>
  );
}
