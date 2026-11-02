import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JSDOM } from "jsdom";
import { act } from "react";
import { CoverLetterEditor } from "./CoverLetterEditor";

function setTextFieldValue(
	field: HTMLInputElement | HTMLTextAreaElement,
	value: string,
) {
	const fieldPrototype =
		field instanceof HTMLTextAreaElement
			? HTMLTextAreaElement.prototype
			: HTMLInputElement.prototype;
	const valueSetter = Object.getOwnPropertyDescriptor(
		fieldPrototype,
		"value",
	)?.set;
	assert.ok(valueSetter, "A native value setter is required for React input events");
	valueSetter.call(field, value);
	field.dispatchEvent(new Event("input", { bubbles: true }));
}

function getPreviewBodyParagraphs(container: HTMLElement) {
	const previewArticle = container.querySelector(
		'[aria-labelledby="cover-letter-preview-heading"] article',
	);
	assert.ok(previewArticle, "The preview article should be rendered");
	return Array.from(previewArticle.querySelectorAll(":scope > p")).map(
		(paragraph) => paragraph.textContent,
	);
}

describe("CoverLetterEditor preview", () => {
	it("중복 문단을 삭제·교체해도 이전 문단을 남기지 않는다", async () => {
		const dom = new JSDOM("<div id=\"root\"></div>", {
			url: "https://onjitda.com/cover-letter/",
		});
		const globalObject = globalThis as Record<string, unknown>;
		const globalNames = [
			"window",
			"document",
			"navigator",
			"HTMLElement",
			"HTMLInputElement",
			"HTMLTextAreaElement",
			"Event",
			"IS_REACT_ACT_ENVIRONMENT",
		] as const;
		const originalGlobalDescriptors = new Map(
			globalNames.map((name) => [
				name,
				Object.getOwnPropertyDescriptor(globalObject, name),
			]),
		);
		const browserGlobals = {
			window: dom.window,
			document: dom.window.document,
			navigator: dom.window.navigator,
			HTMLElement: dom.window.HTMLElement,
			HTMLInputElement: dom.window.HTMLInputElement,
			HTMLTextAreaElement: dom.window.HTMLTextAreaElement,
			Event: dom.window.Event,
			IS_REACT_ACT_ENVIRONMENT: true,
		};
		for (const [name, value] of Object.entries(browserGlobals)) {
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
			await act(async () => root.render(<CoverLetterEditor />));
			const textFields = applicationRoot.querySelectorAll("input");
			const bodyField = applicationRoot.querySelector("textarea");
			assert.ok(bodyField);
			assert.equal(textFields.length, 8);

			await act(async () => {
				setTextFieldValue(textFields[0], "홍길동");
				setTextFieldValue(textFields[5], "예시 회사");
				setTextFieldValue(textFields[6], "개발 직무");
				setTextFieldValue(bodyField, "첫 문단\n\n둘째 문단\n\n첫 문단");
			});
			assert.deepEqual(getPreviewBodyParagraphs(applicationRoot), [
				"첫 문단",
				"둘째 문단",
				"첫 문단",
			]);

			await act(async () => setTextFieldValue(bodyField, "둘째 문단\n\n첫 문단"));
			assert.deepEqual(getPreviewBodyParagraphs(applicationRoot), [
				"둘째 문단",
				"첫 문단",
			]);

			await act(async () => setTextFieldValue(bodyField, "새 문단"));
			assert.deepEqual(getPreviewBodyParagraphs(applicationRoot), ["새 문단"]);
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
