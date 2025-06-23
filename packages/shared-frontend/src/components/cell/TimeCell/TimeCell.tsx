

import React from 'react';
import { CellContext } from '@tanstack/react-table';
import dayjs from 'dayjs';

export const TimeCell = <T extends unknown>(
  cellContext: CellContext<T, unknown>,
) => {
  const { getValue } = cellContext;

  if (!getValue()) {
    return <p>-</p>;
  }

  return <p>{dayjs(getValue() as string).format('HH:mm')}</p>;
};
