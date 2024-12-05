'use client';

import { ReactNode } from 'react';
import { HStack } from '../HStack';
import { VStack } from '../VStack';
import { observer } from 'mobx-react-lite';
import { v4 } from 'uuid';

interface ListProps<T> {
  data: T[];
  renderItem: (item: T) => ReactNode;
  renderContainer?: (children: ReactNode) => ReactNode;
  horizontal?: boolean;
  className?: string;
  placeholder?: ReactNode;
}

export const List = observer(<T extends any>(props: ListProps<T>) => {
  const {
    data,
    renderItem,
    className,
    placeholder,
    renderContainer = (children: ReactNode) => {
      if (props.horizontal) {
        return (
          <HStack key={v4()} className={className}>
            {children}
          </HStack>
        );
      }

      return (
        <VStack key={v4()} className={className}>
          {children}
        </VStack>
      );
    },
  } = props;

  if (data.length === 0) {
    return placeholder;
  }

  return renderContainer(data.map(renderItem));
});
