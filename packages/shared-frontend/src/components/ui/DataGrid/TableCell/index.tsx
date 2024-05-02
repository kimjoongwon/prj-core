interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}
export const TableCell = (props: TableCellProps) => {
  const { children, className, ...rest } = props;
  return (
    <td
      className={'m-0 p-4 border-b border-r last:child:border-r-0 ' + className}
      {...rest}
    >
      {children}
    </td>
  );
};
