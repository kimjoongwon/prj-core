import { action } from "mobx";
import { useMobxHookForm } from "../../../..";
import { MobxProps } from "@shared/types";
import { Checkbox as NextUICheckbox, CheckboxProps as NextUICheckboxProps } from "@heroui/react";
import { get } from "lodash-es";
import { Text } from "../../../..";
import { observer } from "mobx-react-lite";

export interface CheckboxProps<T> extends MobxProps<T>, NextUICheckboxProps {}

function BaseCheckbox<T extends object>(props: CheckboxProps<T>) {
  const { path = "", state = {}, ...rest } = props;

  const { localState } = useMobxHookForm(get(state, path), state, path);

  const onChange = action((e: React.ChangeEvent<HTMLInputElement>) => {
    localState.value = e.target.checked;
  });

  return (
    <NextUICheckbox {...rest} onChange={onChange} size="lg" isSelected={localState.value}>
      <Text className="font-bold">{props.children}</Text>
    </NextUICheckbox>
  );
}

export const Checkbox = observer(BaseCheckbox);
