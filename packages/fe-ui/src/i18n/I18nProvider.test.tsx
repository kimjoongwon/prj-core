import { LanguageCode } from "@cocrepo/constant";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { I18nProvider, useT } from "./I18nProvider";

function Probe() {
	const t = useT();

	return (
		<div>
			<p>{t("로그아웃")}</p>
			<p>{t("미등록 키")}</p>
			<p>{t("총 {{count}}건", undefined, { count: 3 })}</p>
		</div>
	);
}

describe("I18nProvider", () => {
	it("uses catalog messages and falls back to the key itself", () => {
		render(
			<I18nProvider
				languageCode={LanguageCode.en_US}
				messages={{ 로그아웃: "Log out", "총 {{count}}건": "{{count}} items" }}
			>
				<Probe />
			</I18nProvider>,
		);

		expect(screen.getByText("Log out")).toBeInTheDocument();
		expect(screen.getByText("미등록 키")).toBeInTheDocument();
		expect(screen.getByText("3 items")).toBeInTheDocument();
	});
});
