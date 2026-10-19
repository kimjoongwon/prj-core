"use client";

import { App, DesignSystemProvider } from "@cocrepo/ui";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<DesignSystemProvider>
			<App>
				<App.Content>{children}</App.Content>
				<App.PortalHost />
			</App>
		</DesignSystemProvider>
	);
}
