interface HStackProps {
  children: React.ReactNode;
  className?: string;
}

export const HStack = (props: HStackProps) => {
  const { children, className, ...rest } = props;
  return (
    <div className={`flex w-full h-full ${className || ''}`} {...rest}>
      {children}
    </div>
  );
};
