'use client';

import React from 'react';
import { CellContext } from '@tanstack/react-table';
import dayjs from 'dayjs';

export const DateCell = <T extends unknown>(
  cellContext: CellContext<T, string>,
) => {
  const { getValue } = cellContext;

  if (!getValue()) {
    return <p>-</p>;
  }

  return <p>{dayjs(getValue()).format('YY.MM.DD HH:mm:ss')}</p>;
};
