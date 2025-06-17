import React from 'react';
import { CellContext } from '@tanstack/react-table';

// SVG 폴더 아이콘 컴포넌트들
const FolderOpenIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15zm-6.75-10.5H21V18a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 18v-7.5h9.75z"
      clipRule="evenodd"
    />
  </svg>
);

const FolderClosedIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15z" />
  </svg>
);

interface ExpandableCellProps<T extends unknown>
  extends CellContext<T, unknown> {
  expandable?: boolean;
}

export const ExpandableCell = <T extends unknown>({
  row,
  getValue,
  expandable = true,
}: ExpandableCellProps<T>) => {
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
            className="mr-3 flex items-center justify-center w-7 h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-all duration-200 border border-amber-200 hover:border-amber-300"
          >
            {row.getIsExpanded() ? (
              <FolderOpenIcon className="w-5 h-5" />
            ) : (
              <FolderClosedIcon className="w-5 h-5" />
            )}
          </div>
        ) : expandable ? (
          <div className="w-7 h-7 mr-3" />
        ) : null}
        <span>{getValue<string>()}</span>
      </div>
    </div>
  );
};
