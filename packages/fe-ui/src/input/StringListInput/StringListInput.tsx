import { Plus, Trash2 } from "lucide-react";
import { Button } from "../Button/Button";
import { TextField } from "../TextField/TextField";
import type { StringListInputProps } from "./StringListInput.props";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useCallback, useEffect, useId } from "react";
import { useInputStateInspection } from "@cocrepo/hook";

export function createStringListInputState(initialValue: string[] = []) {
	return makeAutoObservable(
		{
			value: [...initialValue],
			setValue(nextValue: string[]) {
				this.value = nextValue;
			},
		},
		{},
		{ autoBind: true, name: "StringListInputState" },
	);
}
export type StringListInputState = ReturnType<typeof createStringListInputState>;

export const StringListInput = observer(function StringListInput({
	value,
	onChange,
	errors,
	isReadOnly = false,
	placeholder,
	addLabel = "추가",
	removeLabel = "삭제",
	className = "space-y-2",
	inputClassName = "flex-1",
	emptyValue = "",
}: StringListInputProps) {
	const internalState = useLocalObservable(() =>
		createStringListInputState(value ?? []),
	);
	const inputStateId = useId();
	const inspection = useInputStateInspection();
	const isControlled = value !== undefined;
	const selectedValue = (isControlled ? value : internalState.value) ?? [];
	const reader = useCallback(
		() => (isControlled ? value : internalState.value),
		[internalState, isControlled, value],
	);
	useEffect(
		() => inspection?.registerInputState(inputStateId, reader),
		[inspection, inputStateId, reader, selectedValue],
	);
	const updateValue = (nextValue: string[]) => {
		if (!isControlled) internalState.setValue(nextValue);
		onChange?.(nextValue);
	};
	const handleAdd = () => {
		updateValue([...selectedValue, emptyValue]);
	};

	const handleRemove = (index: number) => {
		updateValue(selectedValue.filter((_, valueIndex) => valueIndex !== index));
	};

	const handleChange = (index: number, nextValue: string) => {
		const nextValues = [...selectedValue];
		nextValues[index] = nextValue;
		updateValue(nextValues);
	};

	return (
		<div className={className}>
			{selectedValue.map((item, index) => (
				<div key={index} className="flex items-start gap-2">
					<TextField
						size="sm"
						placeholder={placeholder}
						value={item}
						onValueChange={(nextValue) => handleChange(index, nextValue)}
						isInvalid={Boolean(errors?.[index])}
						errorMessage={errors?.[index]}
						isReadOnly={isReadOnly}
						className={inputClassName}
					/>
					{!isReadOnly && (
						<Button
							isIconOnly
							size="sm"
							variant="ghost"


							onPress={() => handleRemove(index)}
							aria-label={removeLabel}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					)}
				</div>
			))}
			{!isReadOnly && (
				<Button
					size="sm"
					variant="tertiary"
					startContent={<Plus className="h-4 w-4" />}
					onPress={handleAdd}
				>
					{addLabel}
				</Button>
			)}
		</div>
	);
});
