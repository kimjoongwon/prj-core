import { observer } from 'mobx-react-lite';
import { Input, InputProps } from '../../../ui';

type NameInputProps<T> = InputProps<T>;

export const NameInput = observer(
  <T extends object>(props: NameInputProps<T>) => {
    const { state, path } = props;

    return (
      <Input
        type="text"
        label="이름"
        placeholder="이름을 입력해주세요."
        state={state}
        path={path}
      />
    );
  },
);
