import { ReactNode } from 'react';

type AppLayoutViewProps = {
  children: ReactNode;
};

export const AppLayoutView = (props: AppLayoutViewProps) => {
  const { children } = props;
  return <div className="px-4 flex flex-auto w-full flex-col">{children}</div>;
};
