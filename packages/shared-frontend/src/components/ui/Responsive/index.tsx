import { ResponsiveProps } from '../../../types/components';

export const Responsive = (props: ResponsiveProps) => {
  return <div className="flex md:hidden">{props.children}</div>;
};
