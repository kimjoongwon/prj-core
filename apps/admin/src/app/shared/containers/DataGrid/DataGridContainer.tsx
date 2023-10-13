interface DataGridContainerProps {
  children?: React.ReactNode;
}
export const DataGridContainer = (props: DataGridContainerProps) => {
  return <div className="h-unit-9xl">{props.children}</div>;
};
