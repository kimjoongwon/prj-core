import { Input, InputProps } from '@nextui-org/react';

interface MultiInputProps extends InputProps {}

export const MultiInputView = (props: MultiInputProps) => {
  return <Input {...props} />;
};
