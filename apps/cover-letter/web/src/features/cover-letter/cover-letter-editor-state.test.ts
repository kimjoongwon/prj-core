import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createCoverLetterEditorState } from "./CoverLetterEditor";

describe("CoverLetterEditorState", () => {
	it("필수 입력 전에는 파일 생성을 시도하지 않는다", async () => {
		const createDocumentBlob = async () => new Blob(["not used"]);
		const state = createCoverLetterEditorState({
			createDocumentBlob,
			saveDocument: () =>
				assert.fail("a disabled download must not save a file"),
		});

		await state.downloadDocument();

		assert.equal(state.downloadState, "idle");
		assert.equal(state.downloadMessage, "");
	});

	it("입력한 텍스트로만 Blob을 만들고 성공 상태를 표시한다", async () => {
		let generatedInput: { fullName: string; body: string } | undefined;
		let savedBlob: Blob | undefined;
		const state = createCoverLetterEditorState({
			createDocumentBlob: async (coverLetterInput) => {
				generatedInput = coverLetterInput;
				return new Blob(["PK test document"]);
			},
			saveDocument: (docxBlob) => {
				savedBlob = docxBlob;
			},
		});
		state.updateField("fullName", "홍길동");
		state.updateField("companyName", "예시 회사");
		state.updateField("positionTitle", "개발 직무");
		state.updateField("body", "지원 동기를 작성했습니다.");

		await state.downloadDocument();

		assert.equal(generatedInput?.fullName, "홍길동");
		assert.equal(generatedInput?.body, "지원 동기를 작성했습니다.");
		assert.ok(savedBlob instanceof Blob);
		assert.equal(state.downloadState, "success");
		assert.match(state.downloadMessage, /다운로드했습니다/);
		state.updateField("body", "수정한 자기소개서 본문입니다.");
		assert.equal(state.downloadState, "idle");
		assert.equal(state.downloadMessage, "");
	});

	it("다운로드 중 편집해도 한 요청의 입력 snapshot과 진행 상태를 유지한다", async () => {
		let createDocumentRequestCount = 0;
		let resolveDocument: (docxBlob: Blob) => void = () => {};
		const savedInputs: string[] = [];
		const state = createCoverLetterEditorState({
			createDocumentBlob: async () => {
				createDocumentRequestCount += 1;
				return new Promise<Blob>((resolve) => {
					resolveDocument = resolve;
				});
			},
			saveDocument: (_docxBlob, coverLetterInput) => {
				savedInputs.push(coverLetterInput.body);
			},
		});
		state.updateField("fullName", "홍길동");
		state.updateField("companyName", "예시 회사");
		state.updateField("positionTitle", "개발 직무");
		state.updateField("body", "처음 작성한 본문입니다.");

		const firstDownload = state.downloadDocument();
		state.updateField("body", "문서를 만드는 중 수정한 본문입니다.");
		const repeatedDownload = state.downloadDocument();

		assert.equal(createDocumentRequestCount, 1);
		assert.equal(state.downloadState, "downloading");
		assert.match(state.downloadMessage, /만드는 중/);
		resolveDocument(new Blob(["PK test document"]));
		await Promise.all([firstDownload, repeatedDownload]);

		assert.deepEqual(savedInputs, ["처음 작성한 본문입니다."]);
		assert.equal(
			state.coverLetterInput.body,
			"문서를 만드는 중 수정한 본문입니다.",
		);
		assert.equal(state.downloadState, "success");
	});

	it("문서 renderer 오류를 사용자에게 노출하고 다시 편집하면 지운다", async () => {
		const state = createCoverLetterEditorState({
			createDocumentBlob: async () => {
				throw new Error("renderer unavailable");
			},
			saveDocument: () => assert.fail("a failed document must not be saved"),
		});
		state.updateField("fullName", "홍길동");
		state.updateField("companyName", "예시 회사");
		state.updateField("positionTitle", "개발 직무");
		state.updateField("body", "지원 동기를 작성했습니다.");

		await state.downloadDocument();

		assert.equal(state.downloadState, "error");
		assert.match(state.downloadMessage, /만들지 못했습니다/);
		state.updateField("body", "수정한 자기소개서 본문입니다.");
		assert.equal(state.downloadState, "idle");
		assert.equal(state.downloadMessage, "");
	});
});
