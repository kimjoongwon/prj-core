import { Tab, Tabs } from '@nextui-org/react';
import { Key } from 'react';
import { TabsProps } from '.';
import { usePathname } from 'next/navigation';
import { useLocalObservable } from 'mobx-react-lite';
import { observer } from 'mobx-react-lite';

export const TabsView = observer((props: TabsProps) => {
  const { items } = props;
  const pathname = usePathname();

  const state = useLocalObservable<{ selectedValue: Key }>(() => ({
    selectedValue: pathname,
  }));

  return (
    <Tabs
      selectedKey={state.selectedValue as string}
      onSelectionChange={key => {
        state.selectedValue = key;
        items.find(item => item.value === key)?.onClick?.();
      }}
    >
      {items.map(item => (
        <Tab key={item.value} title={item.text} />
      ))}
    </Tabs>
  );
});
