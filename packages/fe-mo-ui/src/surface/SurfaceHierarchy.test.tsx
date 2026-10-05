import type { ReactElement } from "react";
import { ScreenSurface } from "./ScreenSurface";
import { SectionSurface } from "./SectionSurface";
import { Surface, type SurfaceProps } from "./Surface";

describe("mobile surface hierarchy", () => {
	it("ScreenSurface는 가장 바깥 화면 표면에 default variant를 적용해야 한다", () => {
		const screen = ScreenSurface({
			children: "screen",
		}) as ReactElement<SurfaceProps>;

		expect(screen.type).toBe(Surface);
		expect(screen.props.variant).toBe("default");
	});

	it("SectionSurface는 section-level 표면에 secondary variant를 적용해야 한다", () => {
		const section = SectionSurface({
			children: "section",
		}) as ReactElement<SurfaceProps>;

		expect(section.type).toBe(Surface);
		expect(section.props.variant).toBe("secondary");
	});
});
