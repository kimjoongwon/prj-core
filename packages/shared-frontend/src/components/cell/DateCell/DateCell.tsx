import React from 'react';
import { CellContext } from '@tanstack/react-table';
import dayjs from 'dayjs';

export const DateCell = <T extends unknown>(
  cellContext: CellContext<T, unknown>,
) => {
  const { getValue } = cellContext;

  if (!getValue()) {
    return <p>-</p>;
  }

  return <p>{dayjs(getValue() as string).format('YY.MM.DD HH:mm:ss')}</p>;
};
