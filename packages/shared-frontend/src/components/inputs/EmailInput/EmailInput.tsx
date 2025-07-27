import { observer } from "mobx-react-lite";
import { Input, InputProps } from "../Input";
import { Validation } from "@shared/types";

type EmailProps<T> = InputProps<T> & {
  validation?: Validation;
};

export const EmailInput = observer(<T extends object>({ validation, ...rest }: EmailProps<T>) => {
  return (
    <Input fullWidth {...rest} type="email" label="이메일" placeholder={"이메일을 입력하세요."} />
  );
});
