'use client';

import { DataGrid } from '@shared/frontend';

import { observer } from 'mobx-react-lite';
import { usePage } from './_hooks/usePage';

const UserGroupsPage = () => {
  const {
    dataGrid: { columns, data },
  } = usePage();

  return <DataGrid data={data} columns={columns} />;
};

export default observer(UserGroupsPage);
