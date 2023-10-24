import { observer } from 'mobx-react-lite';
import { createContext } from 'react';
interface CategoryEditProviderProps {
  children: React.ReactNode;
}

export const CategoryEditProvider = observer(
  (props: CategoryEditProviderProps) => {
    return <div>{props.children}</div>;
  },
);
