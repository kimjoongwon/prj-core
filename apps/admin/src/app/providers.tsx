'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ApolloWrapper } from './shared/libs/apollo-wrapper'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <ApolloWrapper>{children}</ApolloWrapper>
      </NextThemesProvider>
    </NextUIProvider>
  )
}
