import { Input, InputProps } from "@heroui/react";

interface MultiInputViewProps extends InputProps {}

export const MultiInputView = (props: MultiInputViewProps) => {
  return <Input {...props} />;
};
