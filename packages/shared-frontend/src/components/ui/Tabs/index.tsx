'use client';

import React from 'react';
import { TabsView } from './TabsView';

export interface Tab {
  text: string;
  value: string;
  onClick?: () => void;
}

export interface TabsProps {
  items: Tab[];
}

export const Tabs = (props: TabsProps) => {
  return <TabsView {...props} />;
};
