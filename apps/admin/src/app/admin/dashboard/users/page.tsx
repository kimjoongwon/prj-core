'use client'

import { UsersDataGrid, UsersPagination } from '@components'
import { UsersPageProviders } from '@providers'

export default function Page() {
  return (
    <UsersPageProviders>
      <UsersDataGrid />
      <UsersPagination />
    </UsersPageProviders>
  )
}
