import { observer } from 'mobx-react-lite';
import { Input, InputProps } from '../../../ui';

type LabelInputProps<T> = InputProps<T>;

export const LabelInput = observer(
  <T extends object>(props: LabelInputProps<T>) => {
    const { state, path } = props;

    return (
      <Input
        type="text"
        label="라벨"
        placeholder="라벨을 입력해주세요."
        state={state}
        path={path}
      />
    );
  },
);
