import { ReactNode } from 'react';

type AppLayoutViewProps = {
  children: ReactNode;
};

export const AppLayoutView = (props: AppLayoutViewProps) => {
  const { children } = props;
  return <div className="flex flex-auto w-full flex-col">{children}</div>;
};
