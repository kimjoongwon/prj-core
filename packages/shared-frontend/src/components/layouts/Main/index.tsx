'use client';

import { VStack } from '../../VStack';
import { MainLayoutProps } from '@shared/types';

export const AdminMainLayout = (props: MainLayoutProps) => {
  const { children } = props;
  return <VStack className="m-4 w-full border-1 rounded-lg">{children}</VStack>;
};
