import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

export const useCoCTable = <T>({
  data,
  columns,
}: {
  data: any[]
  columns: any[]
}) => {
  return useReactTable({
    data: data as T[],
    getCoreRowModel: getCoreRowModel(),
    columns,
  })
}
