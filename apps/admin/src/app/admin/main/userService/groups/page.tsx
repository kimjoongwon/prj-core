'use client';

import {
  DataGrid,
  DateCell,
  GroupDto,
  useFindGroupsByPageOptions,
} from '@shared/frontend';
import { createColumnHelper } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';

const UserGroupsPage = () => {
  const { data: findGroupsByPageOptionsQueryData } =
    useFindGroupsByPageOptions();

  const groups = findGroupsByPageOptionsQueryData?.data || [];

  const columnHelper = createColumnHelper<GroupDto>();

  const columns = [
    columnHelper.accessor('name', {
      header: '그룹명',
    }),
    columnHelper.accessor('createdAt', {
      header: '생성일',
      cell: DateCell,
    }),
  ];

  return <DataGrid data={groups} columns={columns} />;
};

export default observer(UserGroupsPage);
