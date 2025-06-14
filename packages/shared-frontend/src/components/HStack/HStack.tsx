import { HStackProps } from '@shared/types';

export const HStack = (props: HStackProps) => {
  const { children, className, ...rest } = props;
  return (
    <div className={`flex ${className || ''}`} {...rest}>
      {children}
    </div>
  );
};
