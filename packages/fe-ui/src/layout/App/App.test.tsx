import { render, screen } from "@testing-library/react";
import {
	App,
	AppBody,
	AppFooter,
	AppHeader,
	AppLeftAside,
	AppMain,
	AppRightAside,
} from "./App";

describe("App", () => {
	it("Given named app slots When rendered Then each root landmark is available", () => {
		render(
			<App>
				<AppHeader>header</AppHeader>
				<AppBody>
					<AppLeftAside>left aside</AppLeftAside>
					<AppMain>main content</AppMain>
					<AppRightAside>right aside</AppRightAside>
				</AppBody>
				<AppFooter>footer</AppFooter>
			</App>,
		);

		expect(screen.getByRole("banner")).toHaveTextContent("header");
		expect(screen.getByRole("main")).toHaveTextContent("main content");
		expect(screen.getByRole("contentinfo")).toHaveTextContent("footer");
		expect(screen.getByText("left aside").tagName).toBe("ASIDE");
		expect(screen.getByText("right aside").tagName).toBe("ASIDE");
	});

	it("Given compound app API When inspected Then it still exposes the same slot components", () => {
		expect(App.Header).toBe(AppHeader);
		expect(App.Body).toBe(AppBody);
		expect(App.LeftAside).toBe(AppLeftAside);
		expect(App.Main).toBe(AppMain);
		expect(App.RightAside).toBe(AppRightAside);
		expect(App.Footer).toBe(AppFooter);
	});
});
