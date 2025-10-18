import { useFormField } from "@cocrepo/hooks";
import { MobxProps } from "@cocrepo/types";
import { tools } from "@cocrepo/toolkit";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import {
  FileUploaderProps as BaseFileUploaderProps,
  FileUploader as FileUploaderComponent,
} from "./FileUploader";

export interface FileUploaderProps<T>
  extends MobxProps<T>,
    Omit<BaseFileUploaderProps, "value" | "onChange"> {}

export const FileUploader = observer(
  <T extends object>(props: FileUploaderProps<T>) => {
    const { state, path, ...rest } = props;

    const initialValue = tools.get(state, path) || null;
    const { localState } = useFormField({ initialValue, state, path });

    const handleChange: BaseFileUploaderProps["onChange"] = action(
      (fileDto) => {
        localState.value = fileDto;
      }
    );

    return (
      <FileUploaderComponent
        {...rest}
        value={localState.value}
        onChange={handleChange}
      />
    );
  }
);
