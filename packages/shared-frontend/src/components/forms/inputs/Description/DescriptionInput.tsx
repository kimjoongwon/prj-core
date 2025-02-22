import { observer } from 'mobx-react-lite';
import { Input, InputProps } from '../../../ui';

type DescriptionInputProps<T> = InputProps<T>;

export const DescriptionInput = observer(
  <T extends object>(props: DescriptionInputProps<T>) => {
    const { state, path } = props;

    return (
      <Input
        type="text"
        label="설명"
        placeholder="설명을 입력해주세요."
        state={state}
        path={path}
      />
    );
  },
);
