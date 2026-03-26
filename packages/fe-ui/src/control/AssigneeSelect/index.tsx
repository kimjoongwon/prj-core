import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	AssigneeSelect as BaseAssigneeSelect,
	type AssigneeSelectProps as BaseAssigneeSelectProps,
	type Assignee,
} from "./AssigneeSelect";

export interface AssigneeSelectProps<T>
	extends MobxProps<T>,
		Omit<BaseAssigneeSelectProps, "value" | "onChange"> {}

export const AssigneeSelect = observer(
	<T extends object>(props: AssigneeSelectProps<T>) => {
		const { path, state, ...rest } = props;

		const initialValue = tools.get(state, path) ?? "";

		const formField = useFormField({
			value: initialValue,
			state,
			path,
		});

		const handleChange = (value: string) => {
			formField.setValue(value);
		};

		return (
			<BaseAssigneeSelect
				{...rest}
				value={formField.state.value as string}
				onChange={handleChange}
			/>
		);
	},
);

export type { BaseAssigneeSelectProps as PureAssigneeSelectProps };
export type { Assignee };
export { AssigneeSelect as PureAssigneeSelect } from "./AssigneeSelect";
