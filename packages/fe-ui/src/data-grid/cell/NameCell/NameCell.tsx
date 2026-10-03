import { Typography } from "../../../data-display/Typography";

export interface NameCellProps {
	value?: string | null;
	variant?: "plain" | "identifier" | "clickable";
	onPress?: () => void;
}

export const NameCell = ({
	value,
	variant = "plain",
	onPress,
}: NameCellProps) => {
	const content = value ?? "-";

	if (variant === "identifier") {
		return (
			<Typography className="font-mono" type="body-sm">
				{content}
			</Typography>
		);
	}

	if (variant === "clickable") {
		return (
			<button
				type="button"
				className="cursor-pointer text-left text-accent hover:underline"
				onClick={onPress}
			>
				{content}
			</button>
		);
	}

	return (
		<div className="min-w-0">
			<Typography truncate type="body-sm" weight="semibold">
				{content}
			</Typography>
		</div>
	);
};
