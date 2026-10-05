import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggleButton } from "./ThemeToggleButton";

const mocks = vi.hoisted(() => ({
	resolvedTheme: "light" as "light" | "dark",
	toggleTheme: vi.fn(),
}));

vi.mock("../../../design-system/provider", () => ({
	useDesignSystemTheme: () => ({
		resolvedTheme: mocks.resolvedTheme,
		toggleTheme: mocks.toggleTheme,
	}),
}));

vi.mock("../../../i18n", () => ({
	useT: () => (value: string) => value,
}));

vi.mock("../../../input/Button/Button", () => ({
	Button: ({
		"aria-label": ariaLabel,
		children,
		onPress,
		startContent,
	}: {
		"aria-label"?: string;
		children?: ReactNode;
		onPress?: () => void;
		startContent?: ReactNode;
	}) => (
		<button type="button" aria-label={ariaLabel} onClick={onPress}>
			{startContent}
			{children}
		</button>
	),
}));

describe("ThemeToggleButton", () => {
	beforeEach(() => {
		mocks.resolvedTheme = "light";
		mocks.toggleTheme.mockReset();
	});

	it("light theme에서는 dark theme 전환 action을 표시한다", () => {
		render(<ThemeToggleButton />);

		const button = screen.getByRole("button", { name: "다크 모드로 전환" });
		expect(button).toHaveTextContent("다크 모드");

		fireEvent.click(button);
		expect(mocks.toggleTheme).toHaveBeenCalledOnce();
	});

	it("dark theme에서는 light theme 전환 action을 표시한다", () => {
		mocks.resolvedTheme = "dark";

		render(<ThemeToggleButton />);

		expect(
			screen.getByRole("button", { name: "라이트 모드로 전환" }),
		).toHaveTextContent("라이트 모드");
	});

	it("compact variant는 접근 가능한 icon button으로 렌더링한다", () => {
		render(<ThemeToggleButton compact />);

		const button = screen.getByRole("button", { name: "다크 모드로 전환" });
		expect(button).not.toHaveTextContent("다크 모드");

		fireEvent.click(button);
		expect(mocks.toggleTheme).toHaveBeenCalledOnce();
	});
});
