import { fireEvent, render, screen } from "@testing-library/react-native";
import { TouchableOpacity } from "react-native";
import { Text } from "../../Text";
import { ThemeProvider, useTheme } from "../theme-provider";

// 테스트용 컴포넌트
const TestComponent = () => {
	const { theme, isDark, toggleTheme } = useTheme();

	return (
		<>
			<Text testID="theme-indicator">{isDark ? "dark" : "light"}</Text>
			<Text testID="primary-color">{theme.colors.primary.DEFAULT}</Text>
			<Text testID="background-color">{theme.colors.background}</Text>
			<TouchableOpacity testID="toggle-button" onPress={toggleTheme}>
				<Text>Toggle Theme</Text>
			</TouchableOpacity>
		</>
	);
};

describe("ThemeProvider", () => {
	it("라이트 모드가 기본값으로 설정되어야 함", () => {
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>,
		);

		expect(screen.getByTestId("theme-indicator").props.children).toBe("light");
		expect(screen.getByTestId("primary-color").props.children).toBe("#006fee");
		expect(screen.getByTestId("background-color").props.children).toBe(
			"#ffffff",
		);
	});

	it("다크 모드로 전환되어야 함", () => {
		render(
			<ThemeProvider initialTheme="dark">
				<TestComponent />
			</ThemeProvider>,
		);

		expect(screen.getByTestId("theme-indicator").props.children).toBe("dark");
		expect(screen.getByTestId("primary-color").props.children).toBe("#006fee");
		expect(screen.getByTestId("background-color").props.children).toBe(
			"#000000",
		);
	});

	it("테마 토글이 동작해야 함", () => {
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>,
		);

		// 초기 상태는 라이트 모드
		expect(screen.getByTestId("theme-indicator").props.children).toBe("light");

		// 다크 모드로 전환
		fireEvent.press(screen.getByTestId("toggle-button"));
		expect(screen.getByTestId("theme-indicator").props.children).toBe("dark");
		expect(screen.getByTestId("background-color").props.children).toBe(
			"#000000",
		);

		// 라이트 모드로 다시 전환
		fireEvent.press(screen.getByTestId("toggle-button"));
		expect(screen.getByTestId("theme-indicator").props.children).toBe("light");
		expect(screen.getByTestId("background-color").props.children).toBe(
			"#ffffff",
		);
	});

	it("테마 컨텍스트 없이 사용하면 에러가 발생해야 함", () => {
		// console.error를 모킹하여 에러 로그를 숨김
		const consoleSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});

		expect(() => {
			render(<TestComponent />);
		}).toThrow("useTheme must be used within a ThemeProvider");

		consoleSpy.mockRestore();
	});

	it("모든 색상 토큰이 올바르게 로드되어야 함", () => {
		const ColorTestComponent = () => {
			const { theme } = useTheme();

			return (
				<>
					<Text testID="success-color">{theme.colors.success.DEFAULT}</Text>
					<Text testID="warning-color">{theme.colors.warning.DEFAULT}</Text>
					<Text testID="danger-color">{theme.colors.danger.DEFAULT}</Text>
					<Text testID="secondary-color">{theme.colors.secondary.DEFAULT}</Text>
				</>
			);
		};

		render(
			<ThemeProvider>
				<ColorTestComponent />
			</ThemeProvider>,
		);

		expect(screen.getByTestId("success-color").props.children).toBe("#17c964");
		expect(screen.getByTestId("warning-color").props.children).toBe("#f5a524");
		expect(screen.getByTestId("danger-color").props.children).toBe("#f31260");
		expect(screen.getByTestId("secondary-color").props.children).toBe(
			"#7828c8",
		);
	});
});
