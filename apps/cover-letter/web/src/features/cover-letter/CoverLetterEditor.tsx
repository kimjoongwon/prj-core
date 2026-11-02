"use client";

import { makeAutoObservable, runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import {
	type CoverLetterDownloadState,
	type CoverLetterField,
	type CoverLetterInput,
	EMPTY_COVER_LETTER_INPUT,
} from "./cover-letter.types";
import {
	createCoverLetterDocxBlob,
	downloadCoverLetterDocx,
} from "./cover-letter-download";

type CoverLetterDownloadDependencies = {
	createDocumentBlob: (coverLetterInput: CoverLetterInput) => Promise<Blob>;
	saveDocument: (docxBlob: Blob, coverLetterInput: CoverLetterInput) => void;
};

const defaultDownloadDependencies: CoverLetterDownloadDependencies = {
	createDocumentBlob: createCoverLetterDocxBlob,
	saveDocument: downloadCoverLetterDocx,
};

function getCoverLetterParagraphs(body: string) {
	let precedingParagraphsLength = 0;
	return body
		.trim()
		.split(/\r?\n\s*\r?\n/)
		.map((paragraph) => paragraph.replace(/\s*\r?\n\s*/g, " ").trim())
		.filter(Boolean)
		.map((text) => {
			const key = `${precedingParagraphsLength}:${text}`;
			precedingParagraphsLength += text.length + 2;
			return { key, text };
		});
}

export function createCoverLetterEditorState(
	downloadDependencies: CoverLetterDownloadDependencies = defaultDownloadDependencies,
) {
	return makeAutoObservable(
		{
			coverLetterInput: { ...EMPTY_COVER_LETTER_INPUT },
			downloadState: "idle" as CoverLetterDownloadState,
			downloadMessage: "",
			get hasRequiredInput() {
				const { fullName, companyName, positionTitle, body } =
					this.coverLetterInput;
				return Boolean(
					fullName.trim() &&
						companyName.trim() &&
						positionTitle.trim() &&
						body.trim(),
				);
			},
			get isDownloading() {
				return this.downloadState === "downloading";
			},
			updateField(field: CoverLetterField, value: string) {
				this.coverLetterInput[field] = value;
				if (
					this.downloadState === "success" ||
					this.downloadState === "error"
				) {
					this.downloadState = "idle";
					this.downloadMessage = "";
				}
			},
			async downloadDocument() {
				if (!this.hasRequiredInput || this.isDownloading) return;
				this.downloadState = "downloading";
				this.downloadMessage = "Word 문서를 만드는 중입니다…";
				const documentInput = { ...this.coverLetterInput };

				try {
					const docxBlob =
						await downloadDependencies.createDocumentBlob(documentInput);
					downloadDependencies.saveDocument(docxBlob, documentInput);
					runInAction(() => {
						this.downloadState = "success";
						this.downloadMessage = "Word 문서를 다운로드했습니다.";
					});
				} catch {
					runInAction(() => {
						this.downloadState = "error";
						this.downloadMessage =
							"Word 문서를 만들지 못했습니다. 다시 시도해 주세요.";
					});
				}
			},
		},
		{},
		{ autoBind: true, name: "CoverLetterEditorState" },
	);
}

export type CoverLetterEditorState = ReturnType<
	typeof createCoverLetterEditorState
>;

/**
 * 입력과 실시간 미리보기, 브라우저 Word 다운로드를 한 번에 제공하는 업무 Feature입니다.
 * 데이터는 browser memory에만 보관하며 서버나 외부 AI로 전송하지 않습니다.
 */
export const CoverLetterEditor = observer(function CoverLetterEditor() {
	const coverLetterEditorState = useLocalObservable(() =>
		createCoverLetterEditorState(),
	);
	const { coverLetterInput } = coverLetterEditorState;
	const contactLine = [
		coverLetterInput.email.trim(),
		coverLetterInput.phone.trim(),
		coverLetterInput.location.trim(),
	]
		.filter(Boolean)
		.join(" | ");
	const previewParagraphs = getCoverLetterParagraphs(coverLetterInput.body);

	return (
		<div className="cover-letter-editor">
			<section aria-labelledby="cover-letter-details-heading">
				<header>
					<h2 id="cover-letter-details-heading">작성 정보</h2>
					<p>
						입력한 내용은 이 브라우저 탭에서만 사용하며, 필수 항목은 별표(*)로
						표시합니다.
					</p>
				</header>
				<div className="cover-letter-editor__fields">
					<label>
						이름 *
						<input
							autoComplete="name"
							placeholder="이름을 입력하세요"
							value={coverLetterInput.fullName}
							onChange={(event) =>
								coverLetterEditorState.updateField(
									"fullName",
									event.target.value,
								)
							}
						/>
					</label>
					<label>
						이메일
						<input
							autoComplete="email"
							type="email"
							placeholder="이메일 주소를 입력하세요"
							value={coverLetterInput.email}
							onChange={(event) =>
								coverLetterEditorState.updateField("email", event.target.value)
							}
						/>
					</label>
					<label>
						연락처
						<input
							autoComplete="tel"
							placeholder="선택 입력"
							value={coverLetterInput.phone}
							onChange={(event) =>
								coverLetterEditorState.updateField("phone", event.target.value)
							}
						/>
					</label>
					<label>
						거주 지역
						<input
							autoComplete="address-level2"
							placeholder="선택 입력"
							value={coverLetterInput.location}
							onChange={(event) =>
								coverLetterEditorState.updateField(
									"location",
									event.target.value,
								)
							}
						/>
					</label>
					<label>
						작성일
						<input
							placeholder="선택 입력"
							value={coverLetterInput.letterDate}
							onChange={(event) =>
								coverLetterEditorState.updateField(
									"letterDate",
									event.target.value,
								)
							}
						/>
					</label>
					<label>
						지원 회사 *
						<input
							placeholder="지원할 회사를 입력하세요"
							value={coverLetterInput.companyName}
							onChange={(event) =>
								coverLetterEditorState.updateField(
									"companyName",
									event.target.value,
								)
							}
						/>
					</label>
					<label>
						지원 직무 *
						<input
							placeholder="지원할 직무를 입력하세요"
							value={coverLetterInput.positionTitle}
							onChange={(event) =>
								coverLetterEditorState.updateField(
									"positionTitle",
									event.target.value,
								)
							}
						/>
					</label>
					<label>
						제출처 담당자
						<input
							placeholder="선택 입력"
							value={coverLetterInput.recipientName}
							onChange={(event) =>
								coverLetterEditorState.updateField(
									"recipientName",
									event.target.value,
								)
							}
						/>
					</label>
				</div>
				<label className="cover-letter-editor__body-field">
					자기소개서 본문 *
					<textarea
						placeholder="직접 작성한 자기소개서 내용을 입력하세요. 문단은 빈 줄로 구분합니다."
						rows={12}
						value={coverLetterInput.body}
						onChange={(event) =>
							coverLetterEditorState.updateField("body", event.target.value)
						}
					/>
				</label>
				<div className="cover-letter-editor__actions">
					<button
						disabled={
							!coverLetterEditorState.hasRequiredInput ||
							coverLetterEditorState.isDownloading
						}
						type="button"
						onClick={() => void coverLetterEditorState.downloadDocument()}
					>
						{coverLetterEditorState.isDownloading
							? "Word 문서를 만드는 중…"
							: "Word 파일(.docx) 다운로드"}
					</button>
					{!coverLetterEditorState.hasRequiredInput ? (
						<p>
							이름, 지원 회사, 지원 직무, 자기소개서 본문을 입력하면 다운로드할 수
							있습니다.
						</p>
					) : null}
					{coverLetterEditorState.downloadMessage ? (
						<output
							aria-live="polite"
							data-state={coverLetterEditorState.downloadState}
						>
							{coverLetterEditorState.downloadMessage}
						</output>
					) : null}
				</div>
			</section>

			<section aria-labelledby="cover-letter-preview-heading">
				<header>
					<h2 id="cover-letter-preview-heading">미리보기</h2>
					<p>다운로드 파일에 입력한 내용이 그대로 반영됩니다.</p>
				</header>
				<div className="cover-letter-editor__preview">
					{coverLetterEditorState.hasRequiredInput ? (
						<article>
							<header>
								<h3>{coverLetterInput.fullName.trim()}</h3>
								{contactLine ? <p>{contactLine}</p> : null}
							</header>
							{coverLetterInput.letterDate.trim() ? (
								<p>작성일: {coverLetterInput.letterDate.trim()}</p>
							) : null}
							<div>
								<p>지원 회사: {coverLetterInput.companyName.trim()}</p>
								<p>지원 직무: {coverLetterInput.positionTitle.trim()}</p>
								{coverLetterInput.recipientName.trim() ? (
									<p>제출처 담당자: {coverLetterInput.recipientName.trim()}</p>
								) : null}
							</div>
							{previewParagraphs.map((paragraph) => (
								<p key={paragraph.key}>{paragraph.text}</p>
							))}
						</article>
					) : (
						<div className="cover-letter-editor__preview-empty">
							<h3>입력 후 미리보기가 표시됩니다</h3>
							<p>
								경력과 개인정보는 직접 입력한 내용만 문서에 포함됩니다.
							</p>
						</div>
					)}
				</div>
			</section>
		</div>
	);
});

CoverLetterEditor.displayName = "CoverLetterEditor";
