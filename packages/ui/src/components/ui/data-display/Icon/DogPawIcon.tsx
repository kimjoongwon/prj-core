export interface DogPawIconProps {
	size?: number;
	color?: string;
	className?: string;
}

export function DogPawIcon({
	size = 20,
	color = "currentColor",
	className,
}: DogPawIconProps) {
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
				d="M12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18C10 19.1046 10.8954 20 12 20Z"
				fill={color}
			/>
			<ellipse cx="8.5" cy="15" rx="2" ry="3" fill={color} />
			<ellipse cx="15.5" cy="15" rx="2" ry="3" fill={color} />
			<ellipse cx="6" cy="10" rx="2" ry="2.5" fill={color} />
			<ellipse cx="18" cy="10" rx="2" ry="2.5" fill={color} />
			<path
				d="M12 14C15 14 17 12 17 9.5C17 7 15 5 12 5C9 5 7 7 7 9.5C7 12 9 14 12 14Z"
				fill={color}
			/>
		</svg>
	);
}
