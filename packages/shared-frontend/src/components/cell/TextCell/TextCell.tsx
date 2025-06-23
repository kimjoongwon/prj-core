

import React from 'react';
import { CellContext } from '@tanstack/react-table';

export const TextCell = <T extends unknown>(
  cellContext: CellContext<T, unknown>,
) => {
  const { getValue, row } = cellContext;
  const value = getValue();

  if (!value && value !== 0) {
    return <p>-</p>;
  }

  return <p>{String(value)}</p>;
};
