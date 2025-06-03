import { tv, VariantProps } from 'tailwind-variants';

interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof text> {}

const text = tv({
  base: 'font-pretendard',
  variants: {
    variant: {
      h1: 'text-4xl font-bold text-black',
      h2: 'text-3xl font-bold text-black',
      h3: 'text-2xl font-bold text-black',
      h4: 'text-xl font-bold text-black',
      h5: 'text-lg font-bold text-black',
      h6: 'text-base font-bold text-black',
      caption: 'text-sm font-normal text-gray-500',
      subtitle1: 'text-base font-normal text-gray-500',
      subtitle2: 'text-sm font-normal text-gray-500',
      body1: 'text-base font-normal text-black',
      body2: 'text-sm font-normal text-black',
      title: 'text-xl font-normal text-black',
      label: 'text-sm font-semiBold text-gray-500',
      text: 'text-base font-normal text-black',
    },
  },
  defaultVariants: {
    variant: 'body1',
  },
});

export const Text = (props: TextProps) => {
  const { children, className, variant = 'body1', ...rest } = props;

  return (
    <p {...rest} className={text({ className, variant })}>
      {children}
    </p>
  );
};
