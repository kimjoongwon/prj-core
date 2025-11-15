import { useFormField } from "@cocrepo/hooks";
import { MobxProps } from "@cocrepo/types";
import { tools } from "@cocrepo/toolkit";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import {
  ChipSelect as BaseChipSelect,
  type ChipSelectProps as BaseChipSelectProps,
} from "./ChipSelect";

export interface ChipSelectProps<T>
  extends MobxProps<T>,
    Omit<BaseChipSelectProps, "value" | "onSelectionChange"> {}

export const ChipSelect = observer(
  <T extends object>(props: ChipSelectProps<T>) => {
    const { state, path, options = [], selectionMode = "multiple" } = props;

    const value = useMemo(() => {
      const currentValue = tools.get(state, path);
      if (selectionMode === "single") {
        return currentValue;
      }
      return Array.isArray(currentValue) ? currentValue : [];
    }, [state, path, selectionMode]);

    const formField = useFormField({ value, state, path });

    const handleSelectionChange = (value: string | string[] | null) => {
      formField.setValue(value);
    };

    return (
      <BaseChipSelect
        options={options}
        selectionMode={selectionMode}
        value={formField.state.value}
        onSelectionChange={handleSelectionChange}
      />
    );
  }
);

// Re-export types for backwards compatibility
export type { BaseChipSelectProps as PureChipSelectProps };
