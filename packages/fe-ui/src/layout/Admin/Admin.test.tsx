import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	Admin,
	AdminBody,
	AdminFooter,
	AdminHeader,
	AdminLeftAside,
	AdminMain,
	AdminRightAside,
} from "./Admin";

describe("Admin", () => {
	it("Given admin slots When rendered Then admin landmarks are available", () => {
		render(
			<Admin>
				<AdminHeader>header</AdminHeader>
				<AdminBody>
					<AdminLeftAside>left aside</AdminLeftAside>
					<AdminMain>main content</AdminMain>
					<AdminRightAside>right aside</AdminRightAside>
				</AdminBody>
				<AdminFooter>footer</AdminFooter>
			</Admin>,
		);

		expect(screen.getByRole("banner")).toHaveTextContent("header");
		expect(screen.getByRole("main")).toHaveTextContent("main content");
		expect(screen.getByRole("contentinfo")).toHaveTextContent("footer");
		expect(screen.getByText("left aside").tagName).toBe("ASIDE");
		expect(screen.getByText("right aside").tagName).toBe("ASIDE");
	});

	it("Given compound admin API When inspected Then it exposes admin slots", () => {
		expect(Admin.Header).toBe(AdminHeader);
		expect(Admin.Body).toBe(AdminBody);
		expect(Admin.LeftAside).toBe(AdminLeftAside);
		expect(Admin.Main).toBe(AdminMain);
		expect(Admin.RightAside).toBe(AdminRightAside);
		expect(Admin.Footer).toBe(AdminFooter);
	});
});
