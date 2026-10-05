import { LanguageCode } from "@cocrepo/constant";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { I18nProvider } from "../../i18n";
import { AlertDialog } from "./AlertDialog";

describe("AlertDialog", () => {
	it("translates heading and body text through the feedback wrapper", () => {
		render(
			<I18nProvider
				languageCode={LanguageCode.ko_KR}
				messages={{
					"Delete item": "항목 삭제",
					"This action cannot be undone.": "이 작업은 되돌릴 수 없습니다.",
				}}
			>
				<AlertDialog.Heading>Delete item</AlertDialog.Heading>
				<AlertDialog.Body>This action cannot be undone.</AlertDialog.Body>
			</I18nProvider>,
		);

		expect(screen.getByText("항목 삭제")).toBeInTheDocument();
		expect(
			screen.getByText("이 작업은 되돌릴 수 없습니다."),
		).toBeInTheDocument();
	});

	it("keeps the HeroUI compound slot API available", () => {
		expect(AlertDialog.Root).toBeDefined();
		expect(AlertDialog.Trigger).toBeDefined();
		expect(AlertDialog.Backdrop).toBeDefined();
		expect(AlertDialog.Container).toBeDefined();
		expect(AlertDialog.Dialog).toBeDefined();
		expect(AlertDialog.Header).toBeDefined();
		expect(AlertDialog.Footer).toBeDefined();
		expect(AlertDialog.Icon).toBeDefined();
		expect(AlertDialog.CloseTrigger).toBeDefined();
	});
});
