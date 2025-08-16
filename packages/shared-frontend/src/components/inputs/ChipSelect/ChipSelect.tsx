import { v4 } from "uuid";
import { Chip } from "../../ui/Chip/Chip";

type SelectionMode = "single" | "multiple" | "none";

export interface ChipSelectProps {
	options: string[];
	selectionMode?: SelectionMode;
	value?: string | string[] | null;
	onSelectionChange?: (value: string | string[] | null) => void;
}

export const ChipSelect = (props: ChipSelectProps) => {
	const { options = [], selectionMode = "multiple", value, onSelectionChange } = props;

	const handleChipPress = (option: string) => {
		if (selectionMode === "none") return;

		if (selectionMode === "single") {
			const newValue = value === option ? null : option;
			onSelectionChange?.(newValue);
		} else if (selectionMode === "multiple") {
			const currentValues = Array.isArray(value) ? value : [];
			let newValue: string[];
			if (currentValues.includes(option)) {
				newValue = currentValues.filter((v) => v !== option);
			} else {
				newValue = [...currentValues, option];
			}
			onSelectionChange?.(newValue);
		}
	};

	const isSelected = (option: string): boolean => {
		if (selectionMode === "single") {
			return value === option;
		}
		if (selectionMode === "multiple") {
			return Array.isArray(value) && value.includes(option);
		}
		return false;
	};

	const getChipColor = (option: string) => {
		if (selectionMode === "none") return "default";
		return isSelected(option) ? "primary" : "default";
	};

	const getChipVariant = (option: string) => {
		if (selectionMode === "none") return "flat";
		return isSelected(option) ? "solid" : "flat";
	};

	return (
		<div className="flex flex-wrap gap-2">
			{options.map((option) => (
				<Chip
					key={v4()}
					variant={getChipVariant(option)}
					color={getChipColor(option)}
					className={selectionMode !== "none" ? "cursor-pointer" : ""}
					onClick={
						selectionMode !== "none"
							? () => handleChipPress(option)
							: undefined
					}
				>
					{option}
				</Chip>
			))}
		</div>
	);
};
