import {
	Document,
	Paragraph,
	Section,
	TextRun,
} from "@react-docx/core";
import type { ReactElement } from "react";
import type { SelfIntroduction } from "../content";

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

/** 빌드 시점에만 @react-docx/core로 렌더링하는 완성 자기소개서 문서입니다. */
export function createSelfIntroductionDocument(
	authoredSelfIntroduction: SelfIntroduction,
): ReactElement {
	return (
		<Document
			title={authoredSelfIntroduction.title}
			creator={authoredSelfIntroduction.name}
			subject={authoredSelfIntroduction.role}
			description={`${authoredSelfIntroduction.name} ${authoredSelfIntroduction.title}`}
			styles={{ default: { document: { run: KOREAN_RUN_PROPERTIES } } }}
		>
			<Section
				properties={{
					page: {
						margin: { top: 936, right: 936, bottom: 936, left: 936 },
					},
				}}
			>
				<Paragraph alignment="center" spacing={{ after: 120 }}>
					<TextRun
						text={authoredSelfIntroduction.title}
						bold
						size={30}
						color="000000"
						{...KOREAN_RUN_PROPERTIES}
					/>
				</Paragraph>
				<Paragraph alignment="center" spacing={{ after: 280 }}>
					<TextRun
						text={`${authoredSelfIntroduction.name} | ${authoredSelfIntroduction.role}`}
						size={20}
						color="000000"
						{...KOREAN_RUN_PROPERTIES}
					/>
				</Paragraph>
				{authoredSelfIntroduction.sections.flatMap((section) => {
					let precedingParagraphsLength = 0;
					return [
						<Paragraph
							key={`${section.title}-heading`}
							spacing={{ before: 160, after: 60 }}
							keepNext
						>
							<TextRun
								text={section.title}
								bold
								size={23}
								color="000000"
								{...KOREAN_RUN_PROPERTIES}
							/>
						</Paragraph>,
						...section.paragraphs.map((paragraph) => {
							const key = `${section.title}-${precedingParagraphsLength}:${paragraph}`;
							precedingParagraphsLength += paragraph.length + 2;
							return (
								<Paragraph key={key} spacing={{ after: 120, line: 276 }}>
									<TextRun
										text={paragraph}
										size={22}
										color="000000"
										{...KOREAN_RUN_PROPERTIES}
									/>
								</Paragraph>
							);
						}),
					];
				})}
			</Section>
		</Document>
	);
}
