import {
	Document,
	Paragraph,
	Section,
	Table,
	TableCell,
	TableRow,
	TextRun,
} from "@react-docx/core";
import type { ReactElement } from "react";
import type {
	MobileCareerColumn,
	MobileCareerEntry,
	MobileCommonCapabilityColumn,
	MobileCommonCapabilityEntry,
	SelfIntroduction,
} from "../content";

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
const TABLE_BORDER = { style: "single", size: 4, color: "B8B8B8" } as const;
const TABLE_CELL_MARGINS = { top: 70, bottom: 70, left: 90, right: 90 };

function createTableCell(
	text: string,
	options: { isHeader?: boolean; key: string; width: number },
) {
	return (
		<TableCell
			key={options.key}
			borders={{
				top: TABLE_BORDER,
				bottom: TABLE_BORDER,
				left: TABLE_BORDER,
				right: TABLE_BORDER,
			}}
			margins={TABLE_CELL_MARGINS}
			shading={options.isHeader ? { fill: "F2F2F2" } : undefined}
			verticalAlign="center"
			width={{ size: options.width, type: "pct" }}
		>
			<Paragraph spacing={{ after: 0, line: 240 }}>
				<TextRun
					text={text}
					bold={options.isHeader}
					size={options.isHeader ? 19 : 18}
					color="000000"
					{...KOREAN_RUN_PROPERTIES}
				/>
			</Paragraph>
		</TableCell>
	);
}

function createMobileCareerTable(
	columns: readonly MobileCareerColumn[],
	entries: readonly MobileCareerEntry[],
) {
	const columnWidths = [14, 26, 17, 43];
	return (
		<Table width={{ size: 100, type: "pct" }}>
			<TableRow tableHeader cantSplit>
				{columns.map((column, columnIndex) =>
					createTableCell(column.label, {
						isHeader: true,
						key: `header-${column.key}`,
						width: columnWidths[columnIndex],
					}),
				)}
			</TableRow>
			{entries.map((entry) => (
				<TableRow
					key={`${entry.period}-${entry.companyAndProject}-${entry.technologies}`}
					cantSplit
				>
					{columns.map((column, columnIndex) =>
						createTableCell(entry[column.key], {
							key: `${entry.period}-${entry.companyAndProject}-${column.key}`,
							width: columnWidths[columnIndex],
						}),
					)}
				</TableRow>
			))}
		</Table>
	);
}

function createMobileCommonCapabilitiesTable(
	columns: readonly MobileCommonCapabilityColumn[],
	entries: readonly MobileCommonCapabilityEntry[],
) {
	const columnWidths = [18, 36, 46];
	return (
		<Table width={{ size: 100, type: "pct" }}>
			<TableRow tableHeader cantSplit>
				{columns.map((column, columnIndex) =>
					createTableCell(column.label, {
						isHeader: true,
						key: `header-${column.key}`,
						width: columnWidths[columnIndex],
					}),
				)}
			</TableRow>
			{entries.map((entry) => (
				<TableRow key={`${entry.area}-${entry.projects}`} cantSplit>
					{columns.map((column, columnIndex) =>
						createTableCell(entry[column.key], {
							key: `${entry.area}-${entry.projects}-${column.key}`,
							width: columnWidths[columnIndex],
						}),
					)}
				</TableRow>
			))}
		</Table>
	);
}

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
				<Paragraph
					spacing={{ before: 240, after: 80 }}
					keepNext
					pageBreakBefore
				>
					<TextRun
						text={authoredSelfIntroduction.mobileCareer.title}
						bold
						size={23}
						color="000000"
						{...KOREAN_RUN_PROPERTIES}
					/>
				</Paragraph>
				<Paragraph spacing={{ after: 120 }}>
					<TextRun
						text={authoredSelfIntroduction.mobileCareer.description}
						size={22}
						color="000000"
						{...KOREAN_RUN_PROPERTIES}
					/>
				</Paragraph>
				{createMobileCareerTable(
					authoredSelfIntroduction.mobileCareer.columns,
					authoredSelfIntroduction.mobileCareer.entries,
				)}
				<Paragraph spacing={{ before: 220, after: 80 }} keepNext>
					<TextRun
						text={authoredSelfIntroduction.mobileCareer.commonCapabilities.title}
						bold
						size={23}
						color="000000"
						{...KOREAN_RUN_PROPERTIES}
					/>
				</Paragraph>
				{createMobileCommonCapabilitiesTable(
					authoredSelfIntroduction.mobileCareer.commonCapabilities.columns,
					authoredSelfIntroduction.mobileCareer.commonCapabilities.entries,
				)}
			</Section>
		</Document>
	);
}
