'use client';

import React from 'react';
import { Container } from '@shared/frontend';
import { observer } from 'mobx-react-lite';

interface ReservationServiceLayoutProps {
  children: React.ReactNode;
}

const ReservationServiceLayout = observer(
  (props: ReservationServiceLayoutProps) => {
    return <Container className="h-full">{props.children}</Container>;
  },
);

export default ReservationServiceLayout;
