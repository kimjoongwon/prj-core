interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}
export const TableRow = (props: TableRowProps) => {
  const { children, className, ...rest } = props;
  return (
    <tr
      className={'last:child:border-b-0 hover:bg-gray-200 ' + className}
      {...rest}
    >
      {children}
    </tr>
  );
};
