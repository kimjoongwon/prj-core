import { observer } from 'mobx-react-lite';
import { Input, InputProps } from '../../../ui';

type PasswordInputProps<T> = InputProps<T>;

export const PasswordInput = observer(
  <T extends object>(props: PasswordInputProps<T>) => {
    const { state, path } = props;

    return (
      <Input
        type="password"
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요."
        state={state}
        path={path}
        autoComplete="current-password"
        minLength={15}
        required
      />
    );
  },
);
