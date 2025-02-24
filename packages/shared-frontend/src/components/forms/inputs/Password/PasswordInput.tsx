import { observer } from 'mobx-react-lite';
import { Input, InputProps, InputValidation } from '../../../ui';

type PasswordInputProps<T> = InputProps<T>;

export const PasswordInput = observer(
  <T extends object>(props: PasswordInputProps<T>) => {
    const { validation, ...rest } = props;

    return (
      <InputValidation validation={validation}>
        <Input
          {...rest}
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          autoComplete="current-password"
          minLength={15}
          required
        />
      </InputValidation>
    );
  },
);
