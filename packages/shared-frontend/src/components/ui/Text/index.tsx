interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {}

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'caption'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'title';
}

export const Text = (props: TextProps) => {
  const { children, className, variant = 'body1', ...rest } = props;

  const variants = {
    h1: 'text-4xl font-bold text-primary-500',
    h2: 'text-3xl font-bold text-primary-500',
    h3: 'text-2xl font-bold text-primary-500',
    h4: 'text-xl font-bold text-primary-500',
    h5: 'text-lg font-bold text-primary-500',
    h6: 'text-base font-bold text-primary-500',
    caption: 'text-sm font-normal text-gray-500',
    subtitle1: 'text-base font-normal text-gray-500',
    subtitle2: 'text-sm font-normal text-gray-500',
    body1: 'text-base font-normal text-gray-500',
    body2: 'text-sm font-normal text-gray-500',
    title: 'text-xl font-bold text-primary-500',
  };

  return (
    <p {...rest} className={`font-pretendard ${variants[variant]}` + className}>
      {children}
    </p>
  );
};
