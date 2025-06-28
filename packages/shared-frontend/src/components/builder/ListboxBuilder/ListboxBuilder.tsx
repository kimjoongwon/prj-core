import { observer } from 'mobx-react-lite';
import { Spinner } from '@heroui/react';
import { ListboxBuilderProps } from '@shared/types';
import { useApiQuery } from '../../../hooks';
import { usePage } from '../../../provider';
import { Listbox } from '../../inputs/Listbox/Listbox';
import { Text } from '../../ui/Text/Text';

export const ListboxBuilder = observer(
  ({ path, query, ...rest }: ListboxBuilderProps) => {
    const page = usePage();
    const state = page.state;
    const { options, isLoading, error } = useApiQuery(query);

    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-4">
          <Spinner size="sm" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 border border-danger-200 rounded-lg bg-danger-50 dark:bg-danger-950 dark:border-danger-800">
          <Text variant="body2" className="text-danger-600 dark:text-danger-400">
            데이터를 불러오는 중 오류가 발생했습니다.
          </Text>
        </div>
      );
    }

    if (!options || options.length === 0) {
      return (
        <div className="p-4 border border-default-200 rounded-lg bg-default-50 dark:bg-default-950 dark:border-default-100">
          <Text variant="body2" className="text-default-500 dark:text-default-400">
            표시할 데이터가 없습니다.
          </Text>
        </div>
      );
    }

    return <Listbox state={state} path={path} options={options} {...rest} />;
  },
);
