'use client'

import { useSelectedLayoutSegment } from 'next/navigation'
import './globals.css'
// import { __DEV__ } from '@apollo/client/utilities/globals'
// import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'
import { Providers } from './providers'
import { Modal, ModalBody, ModalContent } from '@nextui-org/react'

// if (__DEV__) {
//   loadDevMessages()
//   loadErrorMessages()
// }

export default function RootLayout(props: {
  children: React.ReactNode
  modalMount: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>My page title</title>
      </head>
      <body>
        <Providers>
          <div>{props.children}</div>
        </Providers>
      </body>
    </html>
  )
}
