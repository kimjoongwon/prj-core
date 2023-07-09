// import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
// import { __DEV__ } from '@apollo/client/utilities/globals';

import { ApolloWrapper } from './shared/libs/apollo-wrapper'

// if (__DEV__) {
//   // Adds messages only in a dev environment
//   loadDevMessages();
//   loadErrorMessages();
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>My page title</title>
      </head>
      <body>
        <ApolloWrapper>
          <div>app layout</div>
          {children}
        </ApolloWrapper>
      </body>
    </html>
  )
}
