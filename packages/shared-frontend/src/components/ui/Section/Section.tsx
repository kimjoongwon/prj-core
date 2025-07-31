import type { ReactNode } from "react";

export interface SectionProps {
	children: ReactNode;
}

export const Section = (props: SectionProps) => {
	const { children } = props;
	return (
		<div className="border-1 p-4 rounded-xl space-y-4 flex flex-1 flex-col w-full">
			{children}
		</div>
	);
};
