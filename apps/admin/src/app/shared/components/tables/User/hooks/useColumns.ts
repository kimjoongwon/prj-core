import { createColumnHelper } from '@tanstack/react-table'
import { User } from '__generated__/graphql'

export const useColumns = () => {
  const columnHelper = createColumnHelper<User>()

  const columns = [
    columnHelper.accessor('id', {
      header: '아이디',
    }),
    columnHelper.accessor('email', {
      header: '이메일',
    }),
    columnHelper.accessor('profile.nickname', {
      header: '닉네임',
    }),
    columnHelper.accessor('profile.phone', {
      header: '휴대폰',
    }),
  ]
  return columns
}
