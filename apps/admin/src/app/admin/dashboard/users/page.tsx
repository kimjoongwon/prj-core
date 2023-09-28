'use client'

import { CoCPagination } from '@components'
import { Button, ButtonGroup, DataGrid } from '@kimjwally/ui'
import { usePage } from './hooks/usePage'
import { observer } from 'mobx-react-lite'

export default function Page() {
  const page = usePage()

  return (
    <div>
      <ButtonGroup
        leftButtons={page.table.leftButtons}
        rightButtons={page.table.rightButtons}
      />
      <DataGrid headers={page.table.headers} rows={page.table.rows} />
      <CoCPagination state={page.state} fromTypename="PaginatedUser" />
    </div>
  )
}
