import { ReactNode } from 'react';

interface ResponsiveProps {
  children: ReactNode;
}

export const Responsive = (props: ResponsiveProps) => {
  return <div className="flex md:hidden">{props.children}</div>;
};
