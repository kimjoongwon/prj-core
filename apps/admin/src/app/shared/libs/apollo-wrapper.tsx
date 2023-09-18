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

function makeClient() {
  return new NextSSRApolloClient({
    connectToDevTools: true,
    cache: new NextSSRInMemoryCache(),
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
