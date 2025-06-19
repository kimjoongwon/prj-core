import { observer } from 'mobx-react-lite';
import { Spinner } from '@heroui/react';
import { ListboxBuilderProps } from '@shared/types';
import { useGetListQuery } from '../../../hooks/useGetListQuery';
import { usePageState } from '../../../providers';
import { Listbox } from '../../inputs/Listbox/Listbox';

export const ListboxBuilder = observer(
  ({ path, query, ...rest }: ListboxBuilderProps) => {
    const pageState = usePageState();
    const { options, isLoading } = useGetListQuery(query);

    if (isLoading) {
      return <Spinner />;
    }

    return (
      <Listbox state={pageState} path={path} options={options} {...rest} />
    );
  },
);
