

import React from 'react';
import { CellContext } from '@tanstack/react-table';
import dayjs from 'dayjs';

export const DateTimeCell = <T extends unknown>(
  cellContext: CellContext<T, unknown>,
) => {
  const { getValue } = cellContext;

  if (!getValue()) {
    return <p>-</p>;
  }

  return <p>{dayjs(getValue() as string).format('YYYY.MM.DD HH:mm')}</p>;
};
