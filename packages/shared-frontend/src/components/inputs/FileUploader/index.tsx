import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useFormField } from "@shared/hooks";
import { Tool } from "@shared/utils";
import { MobxProps } from "../../../types";
import {
	FileUploader as FileUploaderComponent,
	FileUploaderProps as BaseFileUploaderProps,
} from "./FileUploader";

export interface FileUploaderProps<T>
	extends MobxProps<T>,
		Omit<BaseFileUploaderProps, "value" | "onChange"> {}

export const FileUploader = observer(
	<T extends object>(props: FileUploaderProps<T>) => {
		const { state = {}, path = "", ...rest } = props;

		const initialValue = Tool.get(state, path) || null;
		const { localState } = useFormField({ initialValue, state, path });

		const handleChange: BaseFileUploaderProps["onChange"] = action(
			(fileDto) => {
				localState.value = fileDto;
			},
		);

		return (
			<FileUploaderComponent
				{...rest}
				value={localState.value}
				onChange={handleChange}
			/>
		);
	},
);
