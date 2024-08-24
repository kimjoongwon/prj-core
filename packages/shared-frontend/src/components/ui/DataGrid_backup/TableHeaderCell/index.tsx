import { DetailedHTMLProps, ThHTMLAttributes } from 'react';

interface TableHeaderCellProps
  extends DetailedHTMLProps<
    ThHTMLAttributes<HTMLTableHeaderCellElement>,
    HTMLTableHeaderCellElement
  > {}

export const TableHeaderCell = (props: TableHeaderCellProps) => {
  const { children, className, ...rest } = props;
  return (
    <th
      className={'m-0 p-4 border-b border-r last:child:border-r-0 ' + className}
      {...rest}
    >
      {children}
    </th>
  );
};
