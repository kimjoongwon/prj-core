interface ButtonGroupContainerProps {
  children?: React.ReactNode;
}
export const ButtonGroupContainer = (props: ButtonGroupContainerProps) => {
  return <div className="h-12 rounded-2xl">{props.children}</div>;
};
