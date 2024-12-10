import { Listbox, ListboxItem } from '@nextui-org/react';
import { ListBoxProps } from '.';

export interface ListboxViewProps extends ListBoxProps<any> {
  value: any;
}

export const ListboxView = (props: ListboxViewProps) => {
  const { items, value, ...rest } = props;
  return (
    <Listbox {...rest}>
      {items.map(item => {
        return (
          <ListboxItem
            variant="bordered"
            key={item.value.toString()}
            // @ts-ignore
            color={item.active ? 'primary' : 'default'}
            value={item.value}
            href={item.href}
          >
            {item.title}
          </ListboxItem>
        );
      })}
    </Listbox>
  );
};
