import React from 'react';
import { VStack } from '@shared/frontend';

interface ReservationLayoutProps {
  children: React.ReactNode;
}

const ReservationLayout = (props: ReservationLayoutProps) => {
  const { children } = props;

  return <VStack className="w-full items-center p-4">{children}</VStack>;
};

export default ReservationLayout;
