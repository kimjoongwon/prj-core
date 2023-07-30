import './globals.css'
import { __DEV__ } from '@apollo/client/utilities/globals'
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'
import { Providers } from './providers'

if (__DEV__) {
  loadDevMessages()
  loadErrorMessages()
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>My page title</title>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
