import { render } from "@testing-library/react-native";
import { View } from "react-native";
import { CustomHeader } from "./index";

jest.mock("react-native-safe-area-context", () => ({
	useSafeAreaInsets: () => ({
		bottom: 0,
		left: 0,
		right: 0,
		top: 0,
	}),
}));

describe("CustomHeader", () => {
	it("모바일 헤더 배경은 테마별 가장 밝은 surface 계열을 사용해야 한다", () => {
		const { UNSAFE_getAllByType } = render(<CustomHeader title="예약" />);

		const root = UNSAFE_getAllByType(View)[0];
		const rootClassNames = root.props.className.split(/\s+/);

		expect(rootClassNames).toEqual(
			expect.arrayContaining(["bg-surface", "dark:bg-surface-tertiary"]),
		);
	});
});
