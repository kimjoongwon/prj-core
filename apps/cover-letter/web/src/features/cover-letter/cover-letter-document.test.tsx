import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderCoverLetterDocument } from "./cover-letter-document";

function readUInt16(bytes: Uint8Array, offset: number) {
	return bytes[offset] | (bytes[offset + 1] << 8);
}

function readUInt32(bytes: Uint8Array, offset: number) {
	return (
		(bytes[offset] |
			(bytes[offset + 1] << 8) |
			(bytes[offset + 2] << 16) |
			(bytes[offset + 3] << 24)) >>>
		0
	);
}

async function readZipEntry(bytes: Uint8Array, entryName: string) {
	const decoder = new TextDecoder();
	for (let offset = 0; offset + 46 <= bytes.length; ) {
		if (readUInt32(bytes, offset) !== 0x02014b50) {
			offset += 1;
			continue;
		}
		const compressionMethod = readUInt16(bytes, offset + 10);
		const compressedSize = readUInt32(bytes, offset + 20);
		const filenameLength = readUInt16(bytes, offset + 28);
		const extraLength = readUInt16(bytes, offset + 30);
		const commentLength = readUInt16(bytes, offset + 32);
		const localHeaderOffset = readUInt32(bytes, offset + 42);
		const filename = decoder.decode(
			bytes.slice(offset + 46, offset + 46 + filenameLength),
		);
		offset += 46 + filenameLength + extraLength + commentLength;
		if (filename !== entryName) continue;

		assert.equal(readUInt32(bytes, localHeaderOffset), 0x04034b50);
		const localFilenameLength = readUInt16(bytes, localHeaderOffset + 26);
		const localExtraLength = readUInt16(bytes, localHeaderOffset + 28);
		const fileContentsOffset =
			localHeaderOffset + 30 + localFilenameLength + localExtraLength;
		const compressedContents = bytes.slice(
			fileContentsOffset,
			fileContentsOffset + compressedSize,
		);
		if (compressionMethod === 0) return decoder.decode(compressedContents);
		assert.equal(
			compressionMethod,
			8,
			"DOCX entries must use ZIP deflate or store",
		);
		const contentStream = new Blob([compressedContents])
			.stream()
			.pipeThrough(new DecompressionStream("deflate-raw"));
		return new Response(contentStream).text();
	}
	assert.fail(`Missing ZIP entry: ${entryName}`);
}

describe("renderCoverLetterDocument", () => {
	it("실제 입력 텍스트를 포함한 OOXML ZIP Blob을 만든다", async () => {
		const docxBlob = await renderCoverLetterDocument({
			fullName: "홍길동",
			email: "hong@example.com",
			phone: "010-0000-0000",
			location: "서울특별시",
			letterDate: "2026년 3월 2일",
			companyName: "예시 회사",
			positionTitle: "개발 직무",
			recipientName: "채용 담당자",
			body: "첫 문단입니다.\n\n둘째 문단입니다.\n\n첫 문단입니다.",
		});
		const archive = new Uint8Array(await docxBlob.arrayBuffer());

		assert.ok(docxBlob.size > 500);
		assert.deepEqual(Array.from(archive.slice(0, 2)), [0x50, 0x4b]);
		const documentXml = await readZipEntry(archive, "word/document.xml");
		const stylesXml = await readZipEntry(archive, "word/styles.xml");
		assert.match(documentXml, /자기소개서/);
		assert.match(documentXml, /지원 회사: 예시 회사/);
		assert.match(documentXml, /지원 직무: 개발 직무/);
		assert.match(documentXml, /첫 문단입니다/);
		assert.equal((documentXml.match(/첫 문단입니다/g) ?? []).length, 2);
		assert.doesNotMatch(documentXml, /Dear|Sincerely|Hiring Team/);
		assert.match(documentXml, /w:eastAsia="맑은 고딕"/);
		assert.match(documentXml, /w:eastAsia="ko-KR"/);
		assert.match(stylesXml, /w:eastAsia="맑은 고딕"/);
		assert.match(stylesXml, /w:eastAsia="ko-KR"/);
	});
});
