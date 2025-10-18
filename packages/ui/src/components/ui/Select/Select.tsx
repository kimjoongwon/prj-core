import {
  Select as NextSelect,
  SelectProps as NextUISelectProps,
  SelectItem,
} from "@heroui/react";
import { tools } from "@cocrepo/toolkit";
import React from "react";
import type { Option } from "../../../types";

export interface SelectProps
  extends Omit<NextUISelectProps, "children" | "onChange" | "selectedKeys"> {
  options?: Option[];
  value?: string;
  onChange?: (value: string) => void;
}

export const Select = (props: SelectProps) => {
  const { options = [], value, onChange, ...rest } = props;

  const _options = tools.cloneDeep(options);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <NextSelect
      variant="bordered"
      {...rest}
      onChange={handleChange}
      selectedKeys={value ? [value] : undefined}
    >
      {_options.map((option) => {
        return (
          <SelectItem key={option.key} textValue={option.value}>
            {option.label}
          </SelectItem>
        );
      })}
    </NextSelect>
  );
};
