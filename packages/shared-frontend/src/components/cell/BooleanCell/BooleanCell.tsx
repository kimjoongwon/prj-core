
import React from 'react';
import { CellContext } from '@tanstack/react-table';
import { Chip } from '@heroui/react';

export const BooleanCell = <T extends unknown>(
  cellContext: CellContext<T, unknown>,
) => {
  const { getValue } = cellContext;
  const value = getValue();

  if (value === null || value === undefined) {
    return <p>-</p>;
  }

  const boolValue = Boolean(value);

  return (
    <Chip color={boolValue ? 'success' : 'default'} size="sm" variant="flat">
      {boolValue ? '예' : '아니오'}
    </Chip>
  );
};
