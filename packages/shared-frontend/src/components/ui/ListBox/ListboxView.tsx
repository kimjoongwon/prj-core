import { Listbox, ListboxItem } from '@nextui-org/react';
import { ListboxViewProps } from '@shared/types';
import { v4 } from 'uuid';

export const ListboxView = (props: ListboxViewProps) => {
  const { items, value, ...rest } = props;
  return (
    <Listbox {...rest}>
      {items.map(item => {
        return (
          <ListboxItem key={v4()} value={item.value} href={item.href}>
            {item.title}
          </ListboxItem>
        );
      })}
    </Listbox>
  );
};
