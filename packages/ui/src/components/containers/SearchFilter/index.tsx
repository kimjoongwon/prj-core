import { observer } from 'mobx-react-lite';
import { SearchFilterContainerView } from './SearchFilterContainerView';
import { ContainerProps } from '../../../types';

export interface SearchFilterContainerProps extends ContainerProps {}

export const SearchFilterContainer = observer(
  (props: SearchFilterContainerProps) => {
    return (
      <SearchFilterContainerView>{props.children}</SearchFilterContainerView>
    );
  },
);
