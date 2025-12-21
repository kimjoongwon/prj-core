import { ReactNode } from "react";
import { Text } from "../Text/Text";

export interface SectionHeaderProps {
	children: ReactNode;
	className?: string;
}

export function SectionHeader({ children, className }: SectionHeaderProps) {
	return (
		<Text
			variant="caption"
			className={`uppercase mb-2${className ? ` ${className}` : ""}`}
		>
			{children}
		</Text>
	);
}
