import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import { MobxProps } from "@cocrepo/type";
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

		const value = tools.get(state, path) || null;
		const formField = useFormField({ value, state, path });

		const handleChange: BaseFileUploaderProps["onChange"] = (fileDto) => {
			formField.setValue(fileDto);
		};

		return (
			<FileUploaderComponent
				{...rest}
				value={formField.state.value}
				onChange={handleChange}
			/>
		);
	},
);
