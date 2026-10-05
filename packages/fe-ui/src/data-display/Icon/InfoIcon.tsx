export interface InfoIconProps {
	size?: number;
	color?: string;
	className?: string;
}

export function InfoIcon({
	size = 20,
	color = "currentColor",
	className,
}: InfoIconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
			<path
				d="M12 16v-4M12 8h.01"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
