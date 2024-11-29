import { ResponsiveProps } from '@shared/types';

export const Responsive = (props: ResponsiveProps) => {
  return <div className="flex md:hidden">{props.children}</div>;
};
