import { render, screen } from "@testing-library/react";
import {
	Auth,
	AuthAside,
	AuthBody,
	AuthFooter,
	AuthHeader,
	AuthMain,
} from "./Auth";

describe("Auth", () => {
	it("Given centered auth slots When rendered Then auth content is in main landmark", () => {
		render(
			<Auth>
				<AuthBody>
					<AuthMain>login form</AuthMain>
				</AuthBody>
			</Auth>,
		);

		expect(screen.getByRole("main")).toHaveTextContent("login form");
	});

	it("Given split auth slots When rendered Then aside and main landmarks are available", () => {
		render(
			<Auth>
				<AuthHeader>header</AuthHeader>
				<AuthBody>
					<AuthAside>intro panel</AuthAside>
					<AuthMain>auth form</AuthMain>
				</AuthBody>
				<AuthFooter>footer</AuthFooter>
			</Auth>,
		);

		expect(screen.getByRole("banner")).toHaveTextContent("header");
		expect(screen.getByText("intro panel").tagName).toBe("ASIDE");
		expect(screen.getByRole("main")).toHaveTextContent("auth form");
		expect(screen.getByRole("contentinfo")).toHaveTextContent("footer");
	});

	it("Given compound auth API When inspected Then it exposes auth slots", () => {
		expect(Auth.Header).toBe(AuthHeader);
		expect(Auth.Body).toBe(AuthBody);
		expect(Auth.Aside).toBe(AuthAside);
		expect(Auth.Main).toBe(AuthMain);
		expect(Auth.Footer).toBe(AuthFooter);
	});
});
