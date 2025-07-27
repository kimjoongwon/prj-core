import { observer } from "mobx-react-lite";
import { Input, InputProps } from "../Input";
import { Validation } from "@shared/types";

type PasswordProps<T> = InputProps<T> & {
  validation?: Validation;
};

export const PasswordInput = observer(
  <T extends object>({ validation, ...rest }: PasswordProps<T>) => {
    return (
      <Input
        {...rest}
        fullWidth
        type="password"
        label="비밀번호"
        placeholder={"비밀번호를 입력하세요."}
      />
    );
  },
);
