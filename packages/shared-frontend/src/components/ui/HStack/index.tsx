interface HStackProps {
  children: React.ReactNode;
  className?: string;
}

export const HStack = (props: HStackProps) => {
  const { children, className, ...rest } = props;
  return (
    <div className={`flex flex-1 ${className || ''}`} {...rest}>
      {children}
    </div>
  );
};
