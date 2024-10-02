'use client';

import React from 'react';
import { TabsView } from './TabsView';

export interface Tab {
  title: string;
  value: string;
  default?: boolean;
  onClick?: (item: Tab) => void;
}

export interface TabsProps {
  items: Tab[];
}

export const Tabs = (props: TabsProps) => {
  return <TabsView {...props} />;
};
