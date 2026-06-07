"use client";

import { Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Input } from "../Input/Input";
import type { StringListInputProps } from "./StringListInput.props";

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
	const handleAdd = () => {
		onChange([...value, emptyValue]);
	};

	const handleRemove = (index: number) => {
		onChange(value.filter((_, valueIndex) => valueIndex !== index));
	};

	const handleChange = (index: number, nextValue: string) => {
		const nextValues = [...value];
		nextValues[index] = nextValue;
		onChange(nextValues);
	};

	return (
		<div className={className}>
			{value.map((item, index) => (
				<div key={index} className="flex items-start gap-2">
					<Input
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
							variant="light"
							color="danger"
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
					variant="flat"
					startContent={<Plus className="h-4 w-4" />}
					onPress={handleAdd}
				>
					{addLabel}
				</Button>
			)}
		</div>
	);
});
