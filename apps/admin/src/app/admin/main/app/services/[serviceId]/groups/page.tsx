'use client';

import React from 'react';
import { GroupsTable } from '@shared/frontend';
import { useGroupsPage } from './_hooks/useGroupsPage';

const GroupsPage = () => {
  const {
    queries: { groups },
    state,
  } = useGroupsPage();

  return <GroupsTable groups={groups} state={state} selectionMode="single" />;
};

export default GroupsPage;
