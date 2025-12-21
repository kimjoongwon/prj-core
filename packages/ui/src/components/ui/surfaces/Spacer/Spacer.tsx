export interface SpacerProps {
	size?: number;
	direction?: "horizontal" | "vertical";
	className?: string;
}

import React from "react";

/**
 * Spacer component that creates empty space with configurable size using Tailwind's spacing units
 */
export const Spacer: React.FC<SpacerProps> = ({
	size = 4,
	direction = "vertical",
	className = "",
}) => {
	const spacingClass = `${direction === "horizontal" ? "w" : "h"}-[${size}px]`;

	return <div className={`${spacingClass} ${className}`} aria-hidden="true" />;
};
