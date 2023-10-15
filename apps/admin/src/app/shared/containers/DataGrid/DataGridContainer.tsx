interface DataGridContainerProps {
  children?: React.ReactNode;
}
export const DataGridContainer = (props: DataGridContainerProps) => {
  return <div className="min-h-unit-24">{props.children}</div>;
};
