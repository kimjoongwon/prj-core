import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderToBuffer } from "@react-docx/core";
import { selfIntroduction } from "../content";
import { createSelfIntroductionDocument } from "./createSelfIntroductionDocument";

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

		const localFilenameLength = readUInt16(bytes, localHeaderOffset + 26);
		const localExtraLength = readUInt16(bytes, localHeaderOffset + 28);
		const fileContentsOffset =
			localHeaderOffset + 30 + localFilenameLength + localExtraLength;
		const compressedContents = bytes.slice(
			fileContentsOffset,
			fileContentsOffset + compressedSize,
		);
		if (compressionMethod === 0) return decoder.decode(compressedContents);
		assert.equal(compressionMethod, 8, "DOCX entries must use ZIP deflate or store");
		const contentStream = new Blob([compressedContents])
			.stream()
			.pipeThrough(new DecompressionStream("deflate-raw"));
		return new Response(contentStream).text();
	}
	assert.fail(`Missing ZIP entry: ${entryName}`);
}

describe("createSelfIntroductionDocument", () => {
	it("완성 원고 전체와 한글 문서 서식을 포함한 OOXML을 만든다", async () => {
		const docxBuffer = await renderToBuffer(
			createSelfIntroductionDocument(selfIntroduction),
		);
		const archive = new Uint8Array(docxBuffer);
		const documentXml = await readZipEntry(archive, "word/document.xml");
		const stylesXml = await readZipEntry(archive, "word/styles.xml");

		assert.deepEqual(Array.from(archive.slice(0, 2)), [0x50, 0x4b]);
		assert.match(documentXml, /자기소개서/);
		assert.match(documentXml, /김중원/);
		assert.match(documentXml, /웹·모바일 풀스택 개발자/);
		for (const section of selfIntroduction.sections) {
			assert.match(documentXml, new RegExp(section.title));
			for (const paragraph of section.paragraphs) {
				assert.match(documentXml, new RegExp(paragraph));
			}
		}
		assert.match(documentXml, /w:eastAsia="맑은 고딕"/);
		assert.match(documentXml, /w:eastAsia="ko-KR"/);
		assert.match(stylesXml, /w:eastAsia="맑은 고딕"/);
		assert.match(stylesXml, /w:eastAsia="ko-KR"/);
		assert.doesNotMatch(documentXml, /w:pBdr/);
	});
});
