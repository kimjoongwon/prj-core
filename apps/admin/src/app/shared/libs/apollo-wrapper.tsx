'use client'

function offsetFromCursor(items: any[], cursor: string, readField: any) {
  // Search from the back of the list because the cursor we're
  // looking for is typically the ID of the last item.
  for (let i = items.length - 1; i >= 0; --i) {
    const item = items[i]
    // Using readField works for both non-normalized objects
    // (returning item.id) and normalized references (returning
    // the id field from the referenced entity object), so it's
    // a good idea to use readField when you're not sure what
    // kind of elements you're dealing with.
    if (readField('id', item) === cursor) {
      // Add one because the cursor identifies the item just
      // before the first item in the page we care about.
      return i + 1
    }
  }
  // Report that the cursor could not be found.
  return -1
}

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
    cache: new NextSSRInMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // users: relayStylePagination(),
            // users: {
            //   keyArgs: false,
            //   merge(existing, incoming, { args, readField, mergeObjects }) {
            //     const merged = {
            //       ...existing,
            //       ...incoming,
            //       edges: [...(existing?.edges || []), ...incoming.edges],
            //     }
            //     // mergeObjects(existing, incoming)
            //     return mergeObjects(existing, incoming)
            //   },
            //   //   read(existing, { args: { page } }) {
            //   //     console.log('page', page)
            //   //     return existing
            //   //   },
            // },
          },
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
