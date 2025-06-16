import { VStackProps } from '@shared/types';

export const VStack = (props: VStackProps) => {
  const { children } = props;
  return <div className={`flex flex-col ${props.className}`}>{children}</div>;
};
