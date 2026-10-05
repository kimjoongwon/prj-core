import { Surface as HeroSurface } from "heroui-native";
import type { ReactElement } from "react";
import { Surface, type SurfaceProps } from "./index";

describe("Surface", () => {
	const renderSurface = (props: SurfaceProps): ReactElement<SurfaceProps> =>
		(
			Surface as unknown as {
				render: (props: SurfaceProps, ref: null) => ReactElement;
			}
		).render(props, null) as ReactElement<SurfaceProps>;

	it("기본 Surface를 secondary variant로 heroui-native에 위임해야 한다", () => {
		const surface = renderSurface({ children: "panel" });

		expect(surface.type).toBe(HeroSurface);
		expect(surface.props.variant).toBe("secondary");
		expect(surface.props.className).toBeUndefined();
	});

	it("호출자 className을 variant 토큰과 병합해 그대로 전달해야 한다", () => {
		const surface = renderSurface({
			children: "warning",
			className: "gap-3 p-4",
		});

		expect(surface.props.className).toBe("gap-3 p-4");
		expect(surface.props.variant).toBe("secondary");
	});
});
