import { LanguageCode } from "@cocrepo/constant";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../../../i18n";
import { LanguageSelectButton } from "./LanguageSelectButton";

const mocks = vi.hoisted(() => ({
	language: {
		languageCode: "en_US" as LanguageCode,
		setLanguageCode: vi.fn(),
	},
}));

vi.mock("@cocrepo/store", () => ({
	useApp: () => ({ language: mocks.language }),
}));

describe("LanguageSelectButton", () => {
	beforeEach(() => {
		mocks.language.languageCode = LanguageCode.en_US;
		mocks.language.setLanguageCode.mockReset();
	});

	it("renders the current language short label", () => {
		render(
			<I18nProvider
				languageCode={LanguageCode.en_US}
				messages={{ "언어 선택": "Language", 영어: "English" }}
			>
				<LanguageSelectButton />
			</I18nProvider>,
		);

		expect(screen.getByRole("button", { name: "Language" })).toHaveTextContent(
			"EN",
		);
	});

	it("updates the app language when a language is selected", async () => {
		render(
			<I18nProvider
				languageCode={LanguageCode.en_US}
				messages={{
					"언어 선택": "Language",
					영어: "English",
					일본어: "Japanese",
				}}
			>
				<LanguageSelectButton />
			</I18nProvider>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Language" }));
		fireEvent.click(await screen.findByText("Japanese"));

		expect(mocks.language.setLanguageCode).toHaveBeenCalledWith(
			LanguageCode.ja_JP,
		);
	});
});
