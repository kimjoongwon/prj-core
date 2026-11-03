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
				`/cover-letter/documents/%EA%B9%80%EC%A4%91%EC%9B%90-%EC%9E%90%EA%B8%B0%EC%86%8C%EA%B0%9C%EC%84%9C.docx?v=${selfIntroduction.documentVersion}`;

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
			const profileLinks = applicationRoot.querySelectorAll(
				".self-introduction-screen__profiles a",
			);
			assert.equal(profileLinks.length, 2);
			for (const [index, profileLink] of selfIntroduction.profileLinks.entries()) {
				const renderedProfileLink = profileLinks[index];
				assert.equal(renderedProfileLink.textContent, profileLink.label);
				assert.equal(renderedProfileLink.getAttribute("href"), profileLink.href);
				assert.equal(renderedProfileLink.getAttribute("target"), "_blank");
				assert.equal(renderedProfileLink.getAttribute("rel"), "noreferrer");
			}

			const renderedSections = applicationRoot.querySelectorAll(
				".self-introduction-screen__section",
			);
			assert.equal(renderedSections.length, selfIntroduction.sections.length);
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
				const renderedSectionLinks = renderedSection.querySelectorAll(
					".self-introduction-screen__section-links a",
				);
				assert.equal(renderedSectionLinks.length, section.links?.length ?? 0);
				for (const [linkIndex, sectionLink] of (section.links ?? []).entries()) {
					const renderedSectionLink = renderedSectionLinks[linkIndex];
					assert.equal(renderedSectionLink.textContent, sectionLink.label);
					assert.equal(
						renderedSectionLink.getAttribute("href"),
						sectionLink.href,
					);
					assert.equal(renderedSectionLink.getAttribute("target"), "_blank");
					assert.equal(renderedSectionLink.getAttribute("rel"), "noreferrer");
				}
			}
			assert.match(
				applicationRoot.textContent ?? "",
				/O2O 경력코칭 AI 에이전트 서비스에 참여하며/,
			);

			const mobileCareer = applicationRoot.querySelector(
				".self-introduction-screen__mobile-career",
			);
			assert.ok(mobileCareer);
			assert.equal(
				mobileCareer.querySelector("h2")?.textContent,
				selfIntroduction.mobileCareer.title,
			);
			assert.equal(
				mobileCareer.querySelector("p")?.textContent,
				selfIntroduction.mobileCareer.description,
			);
			const mobileCareerTables = mobileCareer.querySelectorAll("table");
			assert.equal(mobileCareerTables.length, 2);
			assert.deepEqual(
				Array.from(mobileCareerTables[0].querySelectorAll("thead th")).map(
					(header) => header.textContent,
				),
				selfIntroduction.mobileCareer.columns.map((column) => column.label),
			);
			const renderedCareerRows = mobileCareerTables[0].querySelectorAll("tbody tr");
			assert.equal(
				renderedCareerRows.length,
				selfIntroduction.mobileCareer.entries.length,
			);
			for (const [index, entry] of selfIntroduction.mobileCareer.entries.entries()) {
				assert.deepEqual(
					Array.from(renderedCareerRows[index].querySelectorAll("td")).map(
						(cell) => cell.textContent,
					),
					selfIntroduction.mobileCareer.columns.map((column) => entry[column.key]),
				);
			}
			assert.equal(
				mobileCareer.querySelector("h3")?.textContent,
				selfIntroduction.mobileCareer.commonCapabilities.title,
			);
			assert.deepEqual(
				Array.from(mobileCareerTables[1].querySelectorAll("thead th")).map(
					(header) => header.textContent,
				),
				selfIntroduction.mobileCareer.commonCapabilities.columns.map(
					(column) => column.label,
				),
			);
			const renderedCapabilityRows = mobileCareerTables[1].querySelectorAll("tbody tr");
			assert.equal(
				renderedCapabilityRows.length,
				selfIntroduction.mobileCareer.commonCapabilities.entries.length,
			);
			for (const [index, entry] of selfIntroduction.mobileCareer.commonCapabilities.entries.entries()) {
				assert.deepEqual(
					Array.from(renderedCapabilityRows[index].querySelectorAll("td")).map(
						(cell) => cell.textContent,
					),
					selfIntroduction.mobileCareer.commonCapabilities.columns.map(
						(column) => entry[column.key],
					),
				);
			}
			assert.match(mobileCareer.textContent ?? "", /중국어·일본어 다국어 지원/);
			assert.match(
				mobileCareer.textContent ?? "",
				/MyHub.*ELPG.*WEGO.*WEGO\+.*두산 밥캣.*mySUNI.*Connect mySUNI.*FCM/,
			);

			const downloadLink = applicationRoot.querySelector(
				".self-introduction-screen__footer a",
			);
			assert.ok(downloadLink);
			assert.equal(downloadLink.getAttribute("href"), downloadHref);
			assert.match(
				downloadLink.getAttribute("href") ?? "",
				new RegExp(`v=${selfIntroduction.documentVersion}$`),
			);
			assert.equal(
				downloadLink.getAttribute("download"),
				selfIntroduction.downloadFileName,
			);
			assert.equal(downloadLink.textContent, "자기소개서 DOCX 다운로드");

			const footerNote = applicationRoot.querySelector(
				".self-introduction-screen__footer-note",
			);
			assert.ok(footerNote);
			assert.match(footerNote.textContent ?? "", /@react-docx\/core/);
			assert.match(footerNote.textContent ?? "", /docx 라이브러리로 빌드 시점에 자동 생성/);

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
