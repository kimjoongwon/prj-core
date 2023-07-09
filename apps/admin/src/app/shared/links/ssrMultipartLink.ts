import { SSRMultipartLink } from '@apollo/experimental-nextjs-app-support/ssr'

export const ssrMultipartLink = new SSRMultipartLink({
  stripDefer: true,
})
