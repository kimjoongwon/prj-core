import { render, screen } from "@testing-library/react";
import { App, AppContent, AppGlobalLayer, AppPortalHost } from "./App";

describe("App", () => {
	it("Given global app slots When rendered Then content layer and portal host are available", () => {
		render(
			<App>
				<AppContent>route content</AppContent>
				<AppGlobalLayer>global overlay</AppGlobalLayer>
				<AppPortalHost>portal target</AppPortalHost>
			</App>,
		);

		expect(screen.getByText("route content")).toBeInTheDocument();
		expect(screen.getByText("global overlay")).toBeInTheDocument();
		expect(screen.getByText("portal target")).toHaveAttribute(
			"id",
			"app-portal-host",
		);
	});

	it("Given compound app API When inspected Then it exposes global slots", () => {
		expect(App.Content).toBe(AppContent);
		expect(App.GlobalLayer).toBe(AppGlobalLayer);
		expect(App.PortalHost).toBe(AppPortalHost);
	});
});
