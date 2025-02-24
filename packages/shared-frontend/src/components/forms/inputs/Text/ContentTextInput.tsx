import { observer } from 'mobx-react-lite';
import { InputProps, Textarea } from '../../../ui';

type ContentTextInputProps<T> = InputProps<T>;

export const ContentTextInput = observer(
  <T extends object>(props: ContentTextInputProps<T>) => {
    const { state, path } = props;

    return (
      <Textarea
        type="text"
        label="제목"
        placeholder="제목을 입력해주세요."
        state={state}
        path={path}
      />
    );
  },
);
