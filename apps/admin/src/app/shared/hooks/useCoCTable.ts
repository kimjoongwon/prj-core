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
  columns: ColumnDef<T, string>[]
}) => {
  return useReactTable({
    data: data as T[],
    getCoreRowModel: getCoreRowModel(),
    columns,
  })
}
