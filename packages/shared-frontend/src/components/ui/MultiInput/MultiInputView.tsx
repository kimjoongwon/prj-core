import { Input, InputProps } from '@nextui-org/react';
import { MobxProps } from '../types';

interface MultiInputProps extends InputProps {}

export const MultiInputView = (props: MultiInputProps) => {
  return <Input {...props} />;
};
