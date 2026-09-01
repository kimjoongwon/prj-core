import { Plus, Trash2 } from "lucide-react";
import { Button } from "../Button/Button";
import { TextField } from "../TextField/TextField";
import type { StringListInputProps } from "./StringListInput.props";

export function StringListInput({
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
}
