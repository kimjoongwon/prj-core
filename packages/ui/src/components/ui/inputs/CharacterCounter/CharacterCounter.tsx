import { Text } from "../../data-display/Text/Text";

export interface CharacterCounterProps {
	current: number;
	max: number;
	showWarning?: boolean;
	className?: string;
}

export function CharacterCounter({
	current,
	max,
	showWarning = true,
	className,
}: CharacterCounterProps) {
	const getColorClass = () => {
		if (current > max) {
			return "text-danger";
		}
		if (showWarning && current >= max * 0.8) {
			return "text-warning";
		}
		return "";
	};

	const colorClass = getColorClass();
	const combinedClassName =
		`text-right ${colorClass} ${className || ""}`.trim();

	return (
		<Text variant="caption" className={combinedClassName}>
			{current} / {max}
		</Text>
	);
}
