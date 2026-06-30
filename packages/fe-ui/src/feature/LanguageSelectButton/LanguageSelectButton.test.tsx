import { LanguageCode } from "@cocrepo/constant";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../../i18n";
import { LanguageSelectButton } from "./LanguageSelectButton";

describe("LanguageSelectButton", () => {
	it("renders the translated current language label", () => {
		render(
			<I18nProvider
				languageCode={LanguageCode.en_US}
				messages={{ "언어 선택": "Language", 영어: "English" }}
			>
				<LanguageSelectButton value={LanguageCode.en_US} onChange={vi.fn()} />
			</I18nProvider>,
		);

		expect(screen.getByRole("button", { name: "Language" })).toHaveTextContent(
			"English",
		);
	});

	it("calls onChange when a language is selected", async () => {
		const onChange = vi.fn();
		render(
			<I18nProvider
				languageCode={LanguageCode.en_US}
				messages={{
					"언어 선택": "Language",
					영어: "English",
					일본어: "Japanese",
				}}
			>
				<LanguageSelectButton value={LanguageCode.en_US} onChange={onChange} />
			</I18nProvider>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Language" }));
		fireEvent.click(await screen.findByText("Japanese"));

		expect(onChange).toHaveBeenCalledWith(LanguageCode.ja_JP);
	});
});
