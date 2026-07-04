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
		return <span className="font-mono text-sm">{content}</span>;
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
			<span className="block truncate text-sm font-semibold tracking-tight text-foreground">
				{content}
			</span>
		</div>
	);
};
