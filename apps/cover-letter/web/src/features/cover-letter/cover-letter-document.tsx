import {
	Document,
	Paragraph,
	renderToBlob,
	Section,
	TextRun,
} from "@react-docx/core";
import type { ReactElement } from "react";
import type { CoverLetterInput } from "./cover-letter.types";

const PAGE_MARGIN = 1_080;
const BODY_TEXT_SIZE = 22;
const BODY_PARAGRAPH_SPACING = 220;
const KOREAN_FONT = {
	ascii: "맑은 고딕",
	eastAsia: "맑은 고딕",
	hAnsi: "맑은 고딕",
};
const KOREAN_LANGUAGE = { eastAsia: "ko-KR", value: "ko-KR" };
const KOREAN_RUN_PROPERTIES = {
	font: KOREAN_FONT,
	language: KOREAN_LANGUAGE,
};

function getContactLine(coverLetterInput: CoverLetterInput) {
	return [
		coverLetterInput.email.trim(),
		coverLetterInput.phone.trim(),
		coverLetterInput.location.trim(),
	]
		.filter(Boolean)
		.join(" | ");
}

function getBodyParagraphs(body: string) {
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

/**
 * 입력값만으로 Word 문서 JSX를 만듭니다. placeholder나 예시는 문서에 넣지 않아
 * 사용자가 제공하지 않은 경력·개인 정보가 다운로드 파일에 섞이지 않습니다.
 */
export function createCoverLetterDocument(
	coverLetterInput: CoverLetterInput,
): ReactElement {
	const fullName = coverLetterInput.fullName.trim();
	const companyName = coverLetterInput.companyName.trim();
	const positionTitle = coverLetterInput.positionTitle.trim();
	const recipientName = coverLetterInput.recipientName.trim();
	const letterDate = coverLetterInput.letterDate.trim();
	const contactLine = getContactLine(coverLetterInput);
	const bodyParagraphs = getBodyParagraphs(coverLetterInput.body);
	const documentSubject = [
		companyName ? `지원 회사: ${companyName}` : "",
		positionTitle ? `지원 직무: ${positionTitle}` : "",
	]
		.filter(Boolean)
		.join(" | ");

	return (
		<Document
			title="자기소개서"
			subject={documentSubject || "자기소개서"}
			creator={fullName || "자기소개서 작성 도구"}
			description="브라우저에서 작성한 자기소개서"
			styles={{ default: { document: { run: KOREAN_RUN_PROPERTIES } } }}
		>
			<Section
				properties={{
					page: {
						margin: {
							top: PAGE_MARGIN,
							right: PAGE_MARGIN,
							bottom: PAGE_MARGIN,
							left: PAGE_MARGIN,
						},
					},
				}}
			>
				<Paragraph alignment="center" spacing={{ after: 360 }}>
					<TextRun
						text="자기소개서"
						bold
						size={32}
						{...KOREAN_RUN_PROPERTIES}
					/>
				</Paragraph>
				{fullName ? (
					<Paragraph spacing={{ after: 80 }}>
						<TextRun text={fullName} bold size={30} {...KOREAN_RUN_PROPERTIES} />
					</Paragraph>
				) : null}
				{contactLine ? (
					<Paragraph spacing={{ after: 300 }}>
						<TextRun
							text={contactLine}
							size={20}
							color="444444"
							{...KOREAN_RUN_PROPERTIES}
						/>
					</Paragraph>
				) : null}
				{letterDate ? (
					<Paragraph spacing={{ after: 220 }}>
						<TextRun
							text={`작성일: ${letterDate}`}
							size={BODY_TEXT_SIZE}
							{...KOREAN_RUN_PROPERTIES}
						/>
					</Paragraph>
				) : null}
				{companyName ? (
					<Paragraph spacing={{ after: 80 }}>
						<TextRun
							text={`지원 회사: ${companyName}`}
							size={BODY_TEXT_SIZE}
							{...KOREAN_RUN_PROPERTIES}
						/>
					</Paragraph>
				) : null}
				{positionTitle ? (
					<Paragraph spacing={{ after: 220 }}>
						<TextRun
							text={`지원 직무: ${positionTitle}`}
							size={BODY_TEXT_SIZE}
							{...KOREAN_RUN_PROPERTIES}
						/>
					</Paragraph>
				) : null}
				{recipientName ? (
					<Paragraph spacing={{ after: BODY_PARAGRAPH_SPACING }}>
						<TextRun
							text={`제출처 담당자: ${recipientName}`}
							size={BODY_TEXT_SIZE}
							{...KOREAN_RUN_PROPERTIES}
						/>
					</Paragraph>
				) : null}
				{bodyParagraphs.map((paragraph) => (
					<Paragraph
						key={paragraph.key}
						spacing={{ after: BODY_PARAGRAPH_SPACING }}
					>
						<TextRun
							text={paragraph.text}
							size={BODY_TEXT_SIZE}
							{...KOREAN_RUN_PROPERTIES}
						/>
					</Paragraph>
				))}
			</Section>
		</Document>
	);
}

/** `@react-docx/core`의 browser renderer로 OOXML Blob을 생성합니다. */
export async function renderCoverLetterDocument(
	coverLetterInput: CoverLetterInput,
): Promise<Blob> {
	return renderToBlob(createCoverLetterDocument(coverLetterInput));
}
