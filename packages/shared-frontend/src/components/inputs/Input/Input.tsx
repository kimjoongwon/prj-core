import {
	Input as HeroUiInput,
	type InputProps as HeroUiInputProps,
} from "@heroui/react";
import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { ChangeEventHandler } from "react";
import { useFormField } from "@shared/hooks";
import { MobxProps, Validation } from "../../../types";

export type InputProps<T> = MobxProps<T> &
	HeroUiInputProps & {
		validation?: Validation;
	};

export const Input = observer(<T extends object>(props: InputProps<T>) => {
	const {
		path = "",
		state = {},
		onChange,
		onBlur,
		errorMessage = " ",
		type,
		size = "sm",
		validation,
		...rest
	} = props;

	const initialValue = get(state, path) || "";

	const { localState } = useFormField({ initialValue, state, path });

	const handleChange: ChangeEventHandler<HTMLInputElement> | undefined = action(
		(e) => {
			if (type === "number" && typeof Number(e.target.value) === "number") {
				localState.value = Number(e.target.value);
				return;
			}

			localState.value = e.target.value;
			onChange?.(localState.value);
		},
	);

	const handleOnBlur: InputProps<T>["onBlur"] = (e) => {
		onBlur?.(e.target.value as any);
	};

	return (
		<HeroUiInput
			{...rest}
			type={type}
			size={size}
			onChange={handleChange}
			onBlur={handleOnBlur}
			errorMessage={errorMessage}
			value={String(localState.value || "")}
		/>
	);
});
