import { observer } from 'mobx-react-lite';
import { Spinner } from '@heroui/react';
import { ListboxBuilderProps } from '@shared/types';
import { useGetListQuery } from '../../../hooks/useGetListQuery';
import { usePage } from '../../../providers';
import { Listbox } from '../../inputs/Listbox/Listbox';

export const ListboxBuilder = observer(
  ({ path, query, ...rest }: ListboxBuilderProps) => {
    const page = usePage();
    const state = page.state;
    const { options, isLoading } = useGetListQuery(query);

    if (isLoading) {
      return <Spinner />;
    }

    return <Listbox state={state} path={path} options={options} {...rest} />;
  },
);
