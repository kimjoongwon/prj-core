interface DataGridContainerProps {
  children: React.ReactNode;
}

export const DataGridContainer = (props: DataGridContainerProps) => {
  const { children } = props;
  return <div>{children}</div>;
};
