import { Input, InputProps } from "@heroui/react";

interface MultiInputProps extends InputProps {}

export const MultiInputView = (props: MultiInputProps) => {
  return <Input {...props} />;
};
