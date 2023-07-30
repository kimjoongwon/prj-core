import { onError } from '@apollo/client/link/error'

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.log('graphQLErrors', graphQLErrors)
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations,
        )}, Path: ${path}`,
      ),
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})
