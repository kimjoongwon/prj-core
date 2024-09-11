import { Chip } from '../Chip/Chip';
import { observer } from 'mobx-react-lite';
import { MobxProps } from '../types';
import { useInputState } from '../../../hooks/useInputState';
import { get } from 'lodash-es';

interface ChipsProps<T> extends MobxProps<T> {}
export const Chips = observer(<T extends object>(props: ChipsProps<T>) => {
  const { state, path } = props;

  const inputState = useInputState<{}, string[]>({
    state,
    path,
    defaultValue: get(state, path) as string[],
  });

  const handleOnClose = (value: string) => {
    if (inputState?.value.includes(value)) {
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
          key={value}
          onClose={() => handleOnClose(value)}
        >
          {value}
        </Chip>
      ))}
    </div>
  );
});
