"use client";

import { App, DesignSystemProvider } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";

interface ProvidersProps {
	children: ReactNode;
}

export const Providers = observer(function Providers({
	children,
}: ProvidersProps) {
	return (
		<DesignSystemProvider>
			<App>
				<App.Body>
					<App.Main>{children}</App.Main>
				</App.Body>
			</App>
		</DesignSystemProvider>
	);
});
