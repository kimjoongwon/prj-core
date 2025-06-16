import { observer } from 'mobx-react-lite';
import { ChipsProps } from '@shared/types';
import { get } from 'lodash-es';
import { v4 } from 'uuid';
import { useInputState } from '../../../hooks/useInputState';
import { Chip } from '../../ui/Chip';
export const Chips = observer(<T extends object>(props: ChipsProps<T>) => {
  const { state, path } = props;

  const inputState = useInputState<{}, string[]>({
    // @ts-ignore
    state,
    path,
    // @ts-ignore
    defaultValue: get(state, path) as string[],
  });

  const handleOnClose = (value: string) => {
    if (inputState?.value.includes(value)) {
      // @ts-ignore
      inputState.value = inputState.value.filter(v => v !== value);
    } else {
      inputState.value.push(value);
    }
  };

  return (
    <div className="space-x-2">
      {inputState?.value?.map(value => (
        <Chip
          variant="flat"
          color="primary"
          key={v4()}
          onClose={() => handleOnClose(value)}
        >
          {value}
        </Chip>
      ))}
    </div>
  );
});
