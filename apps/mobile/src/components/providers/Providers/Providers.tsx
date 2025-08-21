import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import type { ThemeMode } from "../ThemeProvider/types";
import { ThemeProvider } from "../ThemeProvider";

export interface ProvidersProps {
	children: ReactNode;
	initialTheme?: ThemeMode;
}

export const Providers: React.FC<ProvidersProps> = observer(
	({ children, initialTheme }) => {
		return (
			<ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
		);
	},
);

Providers.displayName = "Providers";

export default Providers;
