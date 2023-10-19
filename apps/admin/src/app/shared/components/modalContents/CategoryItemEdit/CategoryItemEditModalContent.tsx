'use client';

import { CategoryItemForm } from '@components';
import { observer } from 'mobx-react-lite';
import React from 'react';
interface CategoryItemEditModalContentProps {
  state: {
    name: string;
  };
}

export const CategoryItemEditModalContent = observer(
  (props: CategoryItemEditModalContentProps) => {
    const { state } = props;

    return <CategoryItemForm state={state} />;
  },
);
