import { ReactNode } from 'react';
import { HStack } from '../HStack';
import { VStack } from '../VStack';
import { observer } from 'mobx-react-lite';

interface ListProps<T> {
  data: T[];
  renderItem: (item: T) => ReactNode;
  horizontal?: boolean;
}

export const List = observer(<T extends any>(props: ListProps<T>) => {
  const { data, renderItem } = props;

  const renderContainer = (children: ReactNode) => {
    if (props.horizontal) {
      return <HStack>{children}</HStack>;
    }

    return <VStack>{children}</VStack>;
  };

  return renderContainer(data.map(renderItem));
});
