import { VStack } from '@shared/frontend';
import React from 'react';

type TimelineItemsLayoutProps = {
  children: React.ReactNode;
};

const TimelineItemsLayout = ({ children }: TimelineItemsLayoutProps) => {
  return <VStack className="w-full">{children}</VStack>;
};

export default TimelineItemsLayout;
