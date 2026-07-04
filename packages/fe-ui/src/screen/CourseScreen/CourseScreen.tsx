"use client";

import type { DataGridColumnConfig, DataGridState } from "@cocrepo/type";
import { Tooltip } from "@heroui/react";
import { CalendarDays } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Chip, type ChipProps } from "../../data-display/Chip/Chip";
import { DataGrid, DataGridColumnsState } from "../../data-grid";
import { Button } from "../../input/Button/Button";
import { Section } from "../../layout";
import { VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";
import { PageTitleBar } from "../../widget/PageTitleBar";

export type CourseSectionId =
	| "courses"
	| "offerings"
	| "enrollments"
	| "passes";

export interface CourseSection {
	id: CourseSectionId;
	label: string;
	description: string;
	href: string;
	count: number;
	tone: ChipProps["color"];
}

export interface CourseQueryState {
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
}

export interface CourseRow {
	id: string;
	name: string;
	description: string;
	durationLabel: string;
	priceLabel: string;
	activeOfferingCount: number;
	activeEnrollmentCount: number;
	statusLabel: string;
	statusTone: ChipProps["color"];
}

export interface CourseOfferingRow {
	id: string;
	courseName: string;
	name: string;
	spaceLabel: string;
	periodLabel: string;
	timelineName: string;
	timelineHref: string;
	capacity: number;
	enrolledCount: number;
	statusLabel: string;
	statusTone: ChipProps["color"];
}

export interface CourseEnrollmentRow {
	id: string;
	studentName: string;
	courseName: string;
	offeringName: string;
	paymentLabel: string;
	validityLabel: string;
	reservationSummary: string;
	statusLabel: string;
	statusTone: ChipProps["color"];
}

export interface CoursePassRow {
	id: string;
	holderName: string;
	courseName: string;
	passLabel: string;
	issuedAtLabel: string;
	expiresAtLabel: string;
	remainingReservationLabel: string;
	statusLabel: string;
	statusTone: ChipProps["color"];
}

export interface CourseScreenProps {
	activeSectionId: CourseSectionId;
	sections: CourseSection[];
	queryState: CourseQueryState;
	courses: CourseRow[];
	offerings: CourseOfferingRow[];
	enrollments: CourseEnrollmentRow[];
	passes: CoursePassRow[];
	onClickSection: (href: string) => void;
	onClickTimeline: (href: string) => void;
}

interface CourseMetricRow {
	id: string;
	label: string;
	value: string;
}

const readonlyGridState: DataGridState = {
	columns: new DataGridColumnsState(),
	query: {
		values: { skip: 0, take: 100 },
		setValues: async () => new URLSearchParams(),
	},
};

const statusCell = <
	T extends { statusLabel: string; statusTone: ChipProps["color"] },
>(
	row: T,
) => (
	<Chip size="sm" variant="flat" color={row.statusTone}>
		{row.statusLabel}
	</Chip>
);

const courseMetricColumns: DataGridColumnConfig<CourseMetricRow>[] = [
	{ field: "label", label: "항목" },
	{ field: "value", label: "값" },
];

const courseColumns: DataGridColumnConfig<CourseRow>[] = [
	{ field: "name", label: "과정", isRequired: true },
	{ field: "description", label: "설명" },
	{ field: "durationLabel", label: "기간" },
	{ field: "priceLabel", label: "기본가" },
	{
		field: "activeOfferingCount",
		label: "운영",
		cell: ({ row }) =>
			`${row.original.activeOfferingCount}개 반 / ${row.original.activeEnrollmentCount}명`,
	},
	{
		field: "statusLabel",
		label: "상태",
		cell: ({ row }) => statusCell(row.original),
	},
];

const courseEnrollmentColumns: DataGridColumnConfig<CourseEnrollmentRow>[] = [
	{ field: "studentName", label: "수강자", isRequired: true },
	{ field: "courseName", label: "Course" },
	{ field: "offeringName", label: "Offering" },
	{ field: "paymentLabel", label: "Payment" },
	{ field: "validityLabel", label: "유효기간" },
	{ field: "reservationSummary", label: "예약" },
	{
		field: "statusLabel",
		label: "상태",
		cell: ({ row }) => statusCell(row.original),
	},
];

const coursePassColumns: DataGridColumnConfig<CoursePassRow>[] = [
	{ field: "holderName", label: "보유자", isRequired: true },
	{ field: "courseName", label: "Course" },
	{ field: "passLabel", label: "Pass" },
	{ field: "issuedAtLabel", label: "발급일" },
	{ field: "expiresAtLabel", label: "만료일" },
	{ field: "remainingReservationLabel", label: "예약 권리" },
	{
		field: "statusLabel",
		label: "상태",
		cell: ({ row }) => statusCell(row.original),
	},
];

const getCourseMetricRows = ({
	courses,
	offerings,
	enrollments,
	passes,
}: Pick<
	CourseScreenProps,
	"courses" | "offerings" | "enrollments" | "passes"
>): CourseMetricRow[] => [
	{ id: "courses", label: "운영 Course", value: `${courses.length}개` },
	{ id: "offerings", label: "모집 Offering", value: `${offerings.length}개` },
	{
		id: "enrollments",
		label: "활성 Enrollment",
		value: `${enrollments.length}건`,
	},
	{ id: "passes", label: "활성 Pass", value: `${passes.length}건` },
];

const getActiveSectionLabel = (
	activeSectionId: CourseSectionId,
	sections: CourseSection[],
) =>
	sections.find((section) => section.id === activeSectionId)?.label ??
	activeSectionId;

const getCourseOfferingColumns = (
	onClickTimeline: (href: string) => void,
): DataGridColumnConfig<CourseOfferingRow>[] => [
	{ field: "name", label: "개설 반", isRequired: true },
	{ field: "courseName", label: "Course" },
	{ field: "spaceLabel", label: "Space" },
	{ field: "periodLabel", label: "기간" },
	{
		field: "timelineName",
		label: "Timeline",
		cell: ({ row }) => (
			<Tooltip>
				<Tooltip.Trigger>
					<Button
						size="sm"
						variant="flat"
						onPress={() => onClickTimeline(row.original.timelineHref)}
					>
						{row.original.timelineName}
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>타임라인 관리로 이동</Tooltip.Content>
			</Tooltip>
		),
	},
	{
		field: "capacity",
		label: "정원",
		cell: ({ row }) =>
			`${row.original.enrolledCount}/${row.original.capacity}명`,
	},
	{
		field: "statusLabel",
		label: "상태",
		cell: ({ row }) => statusCell(row.original),
	},
];

const getActiveCourseGrid = ({
	activeSectionId,
	courses,
	offerings,
	enrollments,
	passes,
	onClickTimeline,
	sectionLabel,
	isLoading,
}: Pick<
	CourseScreenProps,
	| "activeSectionId"
	| "courses"
	| "offerings"
	| "enrollments"
	| "passes"
	| "onClickTimeline"
> & {
	sectionLabel: string;
	isLoading: boolean;
}) => {
	if (activeSectionId === "courses") {
		return (
			<DataGrid
				config={{
					entity: "Course",
					columns: courseColumns,
					emptyMessage: `표시할 ${sectionLabel} 항목이 없습니다.`,
				}}
				rows={courses}
				totalCount={courses.length}
				state={readonlyGridState}
				isLoading={isLoading}
			/>
		);
	}

	if (activeSectionId === "offerings") {
		return (
			<DataGrid
				config={{
					entity: "CourseOffering",
					columns: getCourseOfferingColumns(onClickTimeline),
					emptyMessage: `표시할 ${sectionLabel} 항목이 없습니다.`,
				}}
				rows={offerings}
				totalCount={offerings.length}
				state={readonlyGridState}
				isLoading={isLoading}
			/>
		);
	}

	if (activeSectionId === "enrollments") {
		return (
			<DataGrid
				config={{
					entity: "CourseEnrollment",
					columns: courseEnrollmentColumns,
					emptyMessage: `표시할 ${sectionLabel} 항목이 없습니다.`,
				}}
				rows={enrollments}
				totalCount={enrollments.length}
				state={readonlyGridState}
				isLoading={isLoading}
			/>
		);
	}

	return (
		<DataGrid
			config={{
				entity: "CoursePass",
				columns: coursePassColumns,
				emptyMessage: `표시할 ${sectionLabel} 항목이 없습니다.`,
			}}
			rows={passes}
			totalCount={passes.length}
			state={readonlyGridState}
			isLoading={isLoading}
		/>
	);
};

export const CourseScreen = observer(
	({
		activeSectionId,
		sections,
		queryState,
		courses,
		offerings,
		enrollments,
		passes,
		onClickSection,
		onClickTimeline,
	}: CourseScreenProps) => {
		const onClickTimelineButton = () => {
			onClickTimeline("/timelines");
		};
		const metricRows = getCourseMetricRows({
			courses,
			offerings,
			enrollments,
			passes,
		});
		const sectionLabel = getActiveSectionLabel(activeSectionId, sections);
		return (
			<VStack fullWidth>
				<PageTitleBar
					title="수강 관리"
					description="Course aggregate root 아래에서 개설 반, 수강 신청, 수강권을 함께 추적하고 운영 일정으로 연결합니다."
					actions={
						<Button
							variant="flat"
							color="primary"
							startContent={<CalendarDays className="size-4" />}
							onPress={onClickTimelineButton}
						>
							타임라인 관리
						</Button>
					}
				/>
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack>
								<DataGrid
									config={{
										entity: "CourseMetric",
										columns: courseMetricColumns,
										emptyMessage: "표시할 수강 지표가 없습니다.",
									}}
									rows={metricRows}
									totalCount={metricRows.length}
									state={readonlyGridState}
								/>
								<div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
									{sections.map((section) => (
										<Button
											key={section.id}
											variant={
												section.id === activeSectionId ? "solid" : "flat"
											}
											color={
												section.id === activeSectionId ? "primary" : "default"
											}
											className="h-auto justify-start whitespace-normal px-4 py-3 text-left"
											onPress={() => onClickSection(section.href)}
										>
											<span className="flex w-full flex-col items-start gap-2">
												<span className="flex w-full items-center justify-between gap-2">
													<span className="font-semibold">{section.label}</span>
													<Chip size="sm" variant="flat" color={section.tone}>
														{section.count}
													</Chip>
												</span>
												<span className="text-muted text-xs">
													{section.description}
												</span>
											</span>
										</Button>
									))}
								</div>
								{queryState.isError ? (
									<p className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-danger text-sm">
										데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
									</p>
								) : (
									getActiveCourseGrid({
										activeSectionId,
										courses,
										offerings,
										enrollments,
										passes,
										onClickTimeline,
										sectionLabel,
										isLoading: queryState.isLoading,
									})
								)}
								{queryState.isFetching && !queryState.isLoading ? (
									<p className="text-muted text-sm">
										{sectionLabel} 목록을 최신 상태로 맞추고 있습니다.
									</p>
								) : null}
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
CourseScreen.displayName = "CourseScreen";
