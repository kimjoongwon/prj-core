import { observer } from 'mobx-react-lite';
import { Input, InputProps } from '../Input/Input';
type State = { email: string };
type EmailProps = InputProps<State>;

export const EmailInput = observer(({ state, path = 'email' }: EmailProps) => {
  return (
    <Input
      type="email"
      label="이메일"
      path={path}
      state={state}
      placeholder={'이메일을 입력하세요.'}
    />
  );
});
