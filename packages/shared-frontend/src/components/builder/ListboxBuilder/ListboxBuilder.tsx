import { observer } from 'mobx-react-lite';
import { Spinner } from '@heroui/react';
import { ListboxBuilderProps } from '@shared/types';
import { useApiQuery } from '../../../hooks';
import { usePage } from '../../../provider';
import { Listbox } from '../../inputs/Listbox/Listbox';

export const ListboxBuilder = observer(
  ({ path, query, ...rest }: ListboxBuilderProps) => {
    const page = usePage();
    const state = page.state;
    const { options, isLoading } = useApiQuery({
      type: 'list',
      query: { name: query.apiKey, params: query.params },
      listOptions: {
        valueField: query.valueField,
        labelField: query.labelField,
      },
    });

    if (isLoading) {
      return <Spinner />;
    }

    return <Listbox state={state} path={path} options={options} {...rest} />;
  },
);
