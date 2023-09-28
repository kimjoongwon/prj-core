'use client'

import { from } from '@apollo/client'
import {
  NextSSRApolloClient,
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
} from '@apollo/experimental-nextjs-app-support/ssr'
import { isServer } from '../utils/isServer'
import {
  authLink,
  errorLink,
  httpLink,
  roundTripLink,
  ssrMultipartLink,
} from '@links'
import { createFragmentRegistry } from '@apollo/client/cache'
import { PAGE_INFO } from '@components'

function makeClient() {
  return new NextSSRApolloClient({
    connectToDevTools: true,
    cache: new NextSSRInMemoryCache({
      fragments: createFragmentRegistry(PAGE_INFO),
      typePolicies: {
        PaginatedUser: {
          keyFields: [],
        },
      },
    }),
    link: from(
      isServer()
        ? [errorLink, ssrMultipartLink, roundTripLink, authLink, httpLink]
        : [errorLink, roundTripLink, authLink, httpLink],
    ),
  })
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  )
}
