interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const Text = (props: TextProps) => {
  const { children, className, ...rest } = props;
  return (
    <p {...rest} className={'font-pretendard ' + className}>
      {children}
    </p>
  );
};
