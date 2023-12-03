interface ButtonGroupContainerProps {
  children?: React.ReactNode;
}
export const ButtonGroupContainer = (props: ButtonGroupContainerProps) => {
  return <div className="rounded-2xl">{props.children}</div>;
};
