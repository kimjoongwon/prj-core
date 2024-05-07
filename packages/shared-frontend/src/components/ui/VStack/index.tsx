interface VStackProps {
  children: React.ReactNode;
  className?: string;
}

export const VStack = (props: VStackProps) => {
  const { children } = props;
  return (
    <div className={`flex flex-1 flex-col ${props.className}`}>{children}</div>
  );
};
