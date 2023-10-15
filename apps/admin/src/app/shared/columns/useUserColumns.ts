import { User } from '@__generated__/graphql';
import { createColumnHelper } from '@tanstack/react-table';

export const useUserColumns = () => {
  const columnHelper = createColumnHelper<User>();

  const columns = [
    columnHelper.accessor('id', {
      header: '아이디',
    }),
    columnHelper.accessor('id', {
      header: 'id',
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
  ];
  return columns;
};
