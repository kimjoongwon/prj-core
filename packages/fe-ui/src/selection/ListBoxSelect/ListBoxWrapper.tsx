import type { ReactNode } from "react";

export const ListBoxWrapper = ({ children }: { children: ReactNode }) => (
	<div className="w-full rounded-small border-border border-small px-2 py-2 dark:border-border">
		{children}
	</div>
);
