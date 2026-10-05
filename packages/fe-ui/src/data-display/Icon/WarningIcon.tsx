export interface WarningIconProps {
	size?: number;
	color?: string;
	className?: string;
}

export function WarningIcon({
	size = 20,
	color = "currentColor",
	className,
}: WarningIconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				d="M12 2L2 20h20L12 2z"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M12 9v4M12 17h.01"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
