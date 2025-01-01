'use client';

import { ReactNode } from 'react';
import { HStack } from '../HStack';
import { VStack } from '../VStack';
import { observer } from 'mobx-react-lite';
import { v4 } from 'uuid';
import { tv } from 'tailwind-variants';

interface ListProps<T> {
  data: T[];
  renderItem: (item: T) => ReactNode;
  horizontal?: boolean;
  className?: string;
  placeholder?: ReactNode;
}

const listView = tv({});

export const List = observer(<T extends any>(props: ListProps<T>) => {
  const { data, renderItem, className, placeholder } = props;

  const renderContainer = (children: ReactNode) => {
    return (
      <div
        key={v4()}
        className={listView({
          className,
        })}
      >
        {children}
      </div>
    );
  };

  if (data.length === 0) {
    return placeholder;
  }

  return renderContainer(data.map(renderItem));
});
