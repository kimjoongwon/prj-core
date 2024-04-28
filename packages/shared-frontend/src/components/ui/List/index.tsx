import { ReactNode } from 'react';
import { HStack } from '../HStack';
import { VStack } from '../VStack';
import { observer } from 'mobx-react-lite';
import { uniqueId } from 'lodash-es';

interface ListProps<T> {
  data: T[];
  renderItem: (item: T) => ReactNode;
  horizontal?: boolean;
  className?: string;
}

export const List = observer(<T extends any>(props: ListProps<T>) => {
  const { data, renderItem, className } = props;

  const renderContainer = (children: ReactNode) => {
    if (props.horizontal) {
      return (
        <HStack key={uniqueId()} className={className}>
          {children}
        </HStack>
      );
    }

    return (
      <VStack key={uniqueId()} className={className}>
        {children}
      </VStack>
    );
  };

  return renderContainer(data.map(renderItem));
});
