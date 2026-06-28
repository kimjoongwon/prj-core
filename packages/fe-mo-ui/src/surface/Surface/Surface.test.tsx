import type { ReactElement } from "react";
import { Surface, type SurfaceProps } from "./index";

describe("Surface", () => {
	const renderSurface = (props: SurfaceProps): ReactElement<SurfaceProps> =>
		(
			Surface as unknown as {
				render: (props: SurfaceProps, ref: null) => ReactElement;
			}
		).render(props, null) as ReactElement<SurfaceProps>;

	it("기본 Surface를 깨끗한 light surface로 렌더링해야 한다", () => {
		const surface = renderSurface({ children: "panel" });
		const rootClassNames = surface.props.className?.split(/\s+/);

		expect(rootClassNames).toEqual(
			expect.arrayContaining([
				"bg-white",
				"border-border",
				"dark:bg-neutral-700/95",
			]),
		);
		expect(surface.props.variant).toBe("secondary");
	});

	it("호출자 className override를 기본 surface palette보다 뒤에 적용해야 한다", () => {
		const surface = renderSurface({
			children: "warning",
			className: "bg-danger",
		});
		const rootClassNames = surface.props.className?.split(/\s+/);

		expect(rootClassNames).toEqual(expect.arrayContaining(["bg-danger"]));
		expect(surface.props.className).not.toContain("bg-white");
	});
});
