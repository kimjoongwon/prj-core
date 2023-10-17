'use client';

import { observer } from 'mobx-react-lite';

interface NodesProps<T> {
  data: T[];
  renderItem: (item: T) => JSX.Element;
}

export const Nodes = observer(<T extends object>(props: NodesProps<T>) => {
  const { data, renderItem } = props;
  return <>{data.map(renderItem)}</>;
});
