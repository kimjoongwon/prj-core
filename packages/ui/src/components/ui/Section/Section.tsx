import type { ReactNode } from "react";

export interface SectionProps {
	children: ReactNode;
}

export const Section = (props: SectionProps) => {
	const { children } = props;
	return (
		<div className="flex w-full flex-1 flex-col space-y-4 rounded-xl border-1 p-4">
			{children}
		</div>
	);
};
