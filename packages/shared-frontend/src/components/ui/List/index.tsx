import { ReactNode } from 'react';
import { HStack } from '../HStack';
import { VStack } from '../VStack';
import { observer } from 'mobx-react-lite';
import { v4 } from 'uuid';

interface ListProps<T> {
  data: T[];
  renderItem: (item: T) => ReactNode;
  horizontal?: boolean;
  className?: string;
  placeholder?: ReactNode;
}

export const List = observer(<T extends any>(props: ListProps<T>) => {
  const { data, renderItem, className, placeholder } = props;

  const renderContainer = (children: ReactNode) => {
    if (props.horizontal) {
      return (
        <HStack
          key={v4()}
          className={className ? `h-full ${className}` : 'h-full border-1'}
        >
          {children}
        </HStack>
      );
    }

    return (
      <VStack
        key={v4()}
        className={className ? `w-full ${className}` : 'w-full border-1'}
      >
        {children}
      </VStack>
    );
  };

  if (data.length === 0) {
    return placeholder;
  }

  return renderContainer(data.map(renderItem));
});
