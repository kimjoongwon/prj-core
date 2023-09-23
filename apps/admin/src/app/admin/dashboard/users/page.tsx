'use client'

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { useState } from '@hooks'
import { gql } from '__generated__'
import { UserTable } from 'app/shared/components/tables/User/UserTable'
import { observer } from 'mobx-react-lite'
import { Provider } from './provider'

function Page() {
  return (
    <Provider>
      <UserTable />
    </Provider>
  )
}

export default Page
