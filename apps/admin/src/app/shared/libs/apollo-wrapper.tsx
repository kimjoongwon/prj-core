'use client'

import { SuspenseCache, from } from '@apollo/client'
import {
  NextSSRApolloClient,
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
} from '@apollo/experimental-nextjs-app-support/ssr'
import { isServer } from '../utils/isServer'
import { errorLink } from '../links'
import { httpLink } from '../links/httpLink'
import { ssrMultipartLink } from '../links/ssrMultipartLink'
import { roundTripLink } from '../links/roundTripLink'
import { retryLink } from '../links/retryLink'

function makeClient() {
  return new NextSSRApolloClient({
    connectToDevTools: true,
    cache: new NextSSRInMemoryCache(),
    link: from(
      isServer()
        ? [errorLink, ssrMultipartLink, roundTripLink, httpLink]
        : [errorLink, roundTripLink, httpLink],
    ),
  })
}

function makeSuspenseCache() {
  return new SuspenseCache()
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider
      makeClient={makeClient}
      makeSuspenseCache={makeSuspenseCache}
    >
      {children}
    </ApolloNextAppProvider>
  )
}
