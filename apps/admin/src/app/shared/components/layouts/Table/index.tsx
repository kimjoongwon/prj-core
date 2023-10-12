interface TableContainerProps {
  children: React.ReactNode;
}

export const TableLayout = (props: TableContainerProps) => {
  const { children } = props;

  return <div className="space-y-4 p-20">{children}</div>;
};
