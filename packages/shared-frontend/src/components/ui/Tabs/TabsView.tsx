import { Tab, Tabs } from '@nextui-org/react';
import React, { useState } from 'react';
import { TabsProps } from '.';

export const TabsView = (props: TabsProps) => {
  const { items } = props;
  const defaultItem = items.find(item => item?.default);
  const [value, setValue] = useState('');

  return (
    <Tabs
      selectedKey={value || defaultItem?.value}
      // @ts-ignore
      onSelectionChange={(value: string) => {
        const item = items.find(item => item.value === value);
        setValue(value);
        item?.onClick?.(item);
      }}
    >
      {items.map(item => (
        <Tab key={item.value} title={item.title} />
      ))}
    </Tabs>
  );
};
