import { Chip } from '../Chip';
import { observer } from 'mobx-react-lite';
import { MobxProps } from '@shared/types';
import { useInputState } from '../../hooks/useInputState';
import { get } from 'lodash-es';
import { v4 } from 'uuid';

interface ChipsProps<T> extends MobxProps<T> {}
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
      {
        // @ts-ignore
        inputState?.value?.map(value => (
          <Chip
            variant="flat"
            color="primary"
            key={v4()}
            onClose={() => handleOnClose(value)}
          >
            {value}
          </Chip>
        ))
      }
    </div>
  );
});
