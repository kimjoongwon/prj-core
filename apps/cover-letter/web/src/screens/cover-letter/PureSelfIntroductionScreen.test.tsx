import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JSDOM } from "jsdom";
import { act } from "react";
import { selfIntroduction } from "../../content";
import { PureSelfIntroductionScreen } from "./PureSelfIntroductionScreen";

describe("PureSelfIntroductionScreen", () => {
	it("완성된 원고와 정적 DOCX 다운로드 링크를 표시한다", async () => {
		const dom = new JSDOM("<div id=\"root\"></div>", {
			url: "https://onjitda.com/cover-letter/",
		});
		const globalObject = globalThis as Record<string, unknown>;
		const globalNames = [
			"window",
			"document",
			"navigator",
			"HTMLElement",
			"IS_REACT_ACT_ENVIRONMENT",
		] as const;
		const originalGlobalDescriptors = new Map(
			globalNames.map((name) => [
				name,
				Object.getOwnPropertyDescriptor(globalObject, name),
			]),
		);

		for (const [name, value] of Object.entries({
			window: dom.window,
			document: dom.window.document,
			navigator: dom.window.navigator,
			HTMLElement: dom.window.HTMLElement,
			IS_REACT_ACT_ENVIRONMENT: true,
		})) {
			Object.defineProperty(globalObject, name, {
				configurable: true,
				writable: true,
				value,
			});
		}

		try {
			const applicationRoot = dom.window.document.getElementById("root");
			assert.ok(applicationRoot);
			const { createRoot } = await import("react-dom/client");
			const root = createRoot(applicationRoot);
			const downloadHref =
				"/cover-letter/documents/%EA%B9%80%EC%A4%91%EC%9B%90-%EC%9E%90%EA%B8%B0%EC%86%8C%EA%B0%9C%EC%84%9C.docx";

			await act(async () => {
				root.render(
					<PureSelfIntroductionScreen
						downloadFileName={selfIntroduction.downloadFileName}
						downloadHref={downloadHref}
						selfIntroduction={selfIntroduction}
					/>,
				);
			});

			assert.equal(
				applicationRoot.querySelector("h1")?.textContent,
				selfIntroduction.title,
			);
			assert.match(applicationRoot.textContent ?? "", new RegExp(selfIntroduction.name));
			assert.match(applicationRoot.textContent ?? "", new RegExp(selfIntroduction.role));

			const renderedSections = applicationRoot.querySelectorAll("section");
			assert.equal(renderedSections.length, 5);
			for (const [index, section] of selfIntroduction.sections.entries()) {
				const renderedSection = renderedSections[index];
				assert.equal(
					renderedSection.querySelector("h2")?.textContent,
					section.title,
				);
				assert.deepEqual(
					Array.from(renderedSection.querySelectorAll("p")).map(
						(paragraph) => paragraph.textContent,
					),
					section.paragraphs,
				);
			}

			const downloadLink = applicationRoot.querySelector("a");
			assert.ok(downloadLink);
			assert.equal(downloadLink.getAttribute("href"), downloadHref);
			assert.equal(
				downloadLink.getAttribute("download"),
				selfIntroduction.downloadFileName,
			);
			assert.equal(downloadLink.textContent, "자기소개서 DOCX 다운로드");

			await act(async () => root.unmount());
		} finally {
			for (const [name, descriptor] of originalGlobalDescriptors) {
				if (descriptor === undefined) delete globalObject[name];
				else Object.defineProperty(globalObject, name, descriptor);
			}
			dom.window.close();
		}
	});
});
