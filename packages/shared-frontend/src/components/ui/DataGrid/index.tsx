import { Selection } from "@heroui/react";
import { action } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { DataGrid as DataGridComponent, DataGridProps, Key } from "./DataGrid";

export const DataGrid = observer(<T extends any>(props: DataGridProps<T>) => {
  const { data, state, selectionMode, ...rest } = props;

  const localState = useLocalObservable<{
    selection: Selection;
  }>(() => {
    return {
      selection: state.selectedKeys ? new Set(state.selectedKeys) : new Set(),
    };
  });

  const onSelectionChange = action((selection: Selection) => {
    localState.selection = selection;

    const allKeys = data.map((item) => item.id);
    let selectedKeys: Key[] = [];

    if (selection === "all") {
      selectedKeys = allKeys;
    } else {
      selectedKeys = Array.from(selection as Set<Key>);
    }

    if (selectionMode === "single") {
      state.selectedKeys = selectedKeys;
    } else {
      state.selectedKeys = selectedKeys;
    }
  });

  return (
    <DataGridComponent
      {...rest}
      data={data}
      state={state}
      selectionMode={selectionMode}
      selectedKeys={localState.selection}
      onSelectionChange={onSelectionChange}
    />
  );
});

export type { DataGridProps, Key };