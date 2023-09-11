'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ApolloWrapper } from './shared/libs/apollo-wrapper'
import { ModalProvider } from './shared/components/providers/Modal'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ModalProvider>
        <ApolloWrapper>{children}</ApolloWrapper>
      </ModalProvider>
    </NextUIProvider>
  )
}
