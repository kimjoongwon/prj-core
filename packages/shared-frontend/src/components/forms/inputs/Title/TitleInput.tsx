import { observer } from 'mobx-react-lite';
import { Input, InputProps } from '../../../ui';

type TitleInputProps<T> = InputProps<T>;

export const TitleInput = observer(
  <T extends object>(props: TitleInputProps<T>) => {
    const { state, path } = props;

    return (
      <Input
        type="text"
        label="제목"
        placeholder="제목을 입력해주세요."
        state={state}
        path={path}
      />
    );
  },
);
