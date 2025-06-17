'use client';

import React from 'react';
import { CellContext } from '@tanstack/react-table';

interface ExpandableCellProps<T extends unknown>
  extends CellContext<T, unknown> {
  expandable?: boolean;
}

export const ExpandableCell = <T extends unknown>({
  row,
  getValue,
  expandable = true,
  ...cellContext
}: ExpandableCellProps<T>) => {
  console.log('----------');
  console.log('row.getIsExpanded()', row.getIsExpanded());
  return (
    <div
      style={{
        paddingLeft: expandable ? `${row.depth * 2}rem` : undefined,
      }}
    >
      <div className="flex items-center">
        {expandable && row.getCanExpand() ? (
          <div
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: 'pointer' },
            }}
            className="mr-2 flex items-center justify-center w-4 h-4"
          >
            {row.getIsExpanded() ? '📂' : '📁'}
          </div>
        ) : expandable ? (
          <div className="w-4 h-4 mr-2" />
        ) : null}
        <span>{getValue<string>()}</span>
      </div>
    </div>
  );
};
