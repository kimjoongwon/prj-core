'use client'

import { CoCPagination } from '@components'
import { ButtonGroup, DataGrid } from '@kimjwally/ui'
import { usePage } from './providers/page/hooks/usePage'

export default function Page() {
  const page = usePage()

  return (
    <div>
      <ButtonGroup
        leftButtons={page.table.leftButtons}
        rightButtons={page.table.rightButtons}
      />
      <DataGrid
        headers={page.table.headers}
        rows={page.table.rows}
        onSortChange={(descriptor) => {
          page.state.sortingKey = (descriptor.column as string)
            .split('_')
            .join('.')
          page.state.sortingValue =
            descriptor.direction === 'ascending' ? 'asc' : 'desc'
        }}
      />
      <CoCPagination state={page.state} fromTypename="PaginatedUser" />
    </div>
  )
}
