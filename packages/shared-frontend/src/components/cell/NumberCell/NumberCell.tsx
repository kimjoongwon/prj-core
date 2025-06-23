'use client';

import React from 'react';
import { CellContext } from '@tanstack/react-table';

export const NumberCell = <T extends unknown>(
  cellContext: CellContext<T, unknown>,
) => {
  const { getValue } = cellContext;
  const value = getValue();

  if (value === null || value === undefined) {
    return <p>-</p>;
  }

  const numValue = Number(value);
  if (isNaN(numValue)) {
    return <p>-</p>;
  }

  return <p>{numValue.toLocaleString()}</p>;
};
