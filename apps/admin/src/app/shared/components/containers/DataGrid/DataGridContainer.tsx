interface DataGridContainerProps {
  children?: React.ReactNode;
}
export const DataGridContainer = (props: DataGridContainerProps) => {
  return <div>{props.children}</div>;
};
