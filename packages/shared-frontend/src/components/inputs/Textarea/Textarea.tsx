import { TextAreaProps, Textarea } from "@heroui/react";
import { BaseTextareaProps, MobxProps } from "@shared/types";
import { get } from "lodash-es";
import { observer } from "mobx-react-lite";
import { useMobxHookForm } from "../../../hooks";

export const BaseTextarea = observer(<T extends object>(props: BaseTextareaProps<T>) => {
  const { value, state = {}, path = "", ...rest } = props;
  const initialValue = get(state, path, value);
  const { localState } = useMobxHookForm(initialValue, state, path);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    localState.value = e.target.value;
  };

  return <Textarea {...rest} value={localState.value} onChange={handleOnChange} />;
});
