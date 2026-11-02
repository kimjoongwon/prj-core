import type { CoverLetterInput } from "./cover-letter.types";

function getDocumentFilename(coverLetterInput: CoverLetterInput) {
	const printableFullName = [...coverLetterInput.fullName]
		.map((character) =>
			(character.codePointAt(0) ?? 32) < 32 ? "-" : character,
		)
		.join("");
	const safeFullName = printableFullName
		.trim()
		.replace(/[\\/:*?"<>|]/g, "-")
		.replace(/\s+/g, " ")
		.replace(/^[.-]+|[. -]+$/g, "");
	return `${safeFullName ? `${safeFullName}-` : ""}자기소개서.docx`;
}

/** 다운로드를 요청할 때만 Word renderer를 로드해 초기 작성 화면을 가볍게 유지합니다. */
export async function createCoverLetterDocxBlob(
	coverLetterInput: CoverLetterInput,
): Promise<Blob> {
	const { renderCoverLetterDocument } = await import("./cover-letter-document");
	return renderCoverLetterDocument(coverLetterInput);
}

/** 브라우저 밖에서는 호출하지 않는 사용자 제스처 전용 파일 저장 경계입니다. */
export function downloadCoverLetterDocx(
	docxBlob: Blob,
	coverLetterInput: CoverLetterInput,
) {
	const objectUrl = URL.createObjectURL(docxBlob);
	const downloadLink = document.createElement("a");
	downloadLink.href = objectUrl;
	downloadLink.download = getDocumentFilename(coverLetterInput);
	downloadLink.style.display = "none";
	document.body.append(downloadLink);
	downloadLink.click();
	downloadLink.remove();
	URL.revokeObjectURL(objectUrl);
}
