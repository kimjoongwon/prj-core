'use client';

import React from 'react';
import { DataGrid } from '@shared/frontend';
import { usePage } from './_hooks/usePage';

const UserGroupsPage = () => {
  const {
    dataGrid: { columns, data },
  } = usePage();

  return <DataGrid data={data} columns={columns} />;
};

export default UserGroupsPage;
