"use client";

import type { InquiryDto } from "@cocrepo/api/core/inquiries";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
	SelectOption,
} from "@cocrepo/type";
import {
	buildInquiryTableColumns,
	DataGrid,
	DataGridState,
	HStack,
	Screen,
	Section,
	SectionSurface,
	Typography,
	VStack,
} from "@cocrepo/ui";
import { Card } from "@heroui/react";
import { AlertTriangle, CheckCircle, Inbox, Loader2, Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { type ReactNode, useEffect } from "react";
import { Button } from "../../input/Button/Button";

const searchInput: InputConfig = {
	type: "search",
	id: "search",
	placeholder: "제목 또는 고객 ID로 검색",
};
const statusInput: InputConfig = {
	type: "select",
	id: "inquiryStatus",
	label: "상태",
	placeholder: "전체 상태",
	props: {
		options: [],
	},
};
export const adminInquiriesPageQueryInputs = [searchInput, statusInput];
export interface InquiryListScreenQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	inquiryStatus: string;
}
export type InquiryListScreenSetQueryStates = DataGridSetQueryStates;
export interface InquiryStats {
	total: number;
	newCount: number;
	inProgress: number;
	resolved: number;
	slaBreached: number;
}
export interface InquiryListScreenProps {
	inquiries?: InquiryDto[];
	totalCount: number;
	stats: InquiryStats;
	statusOptions: SelectOption[];
	activeStatus?: string;
	isLoading: boolean;
	queryStates: InquiryListScreenQueryStates;
	setQueryStates: InquiryListScreenSetQueryStates;
	onClickNewInquiry: () => void;
	onClickInquiryRow: (inquiryId: bigint) => void;
	onClickStatusFilter: (status: string | undefined) => void;
}
const metricCardColorStyles = {
	default: {
		icon: "text-muted",
		value: "text-foreground",
	},
	primary: {
		icon: "text-accent",
		value: "text-accent",
	},
	success: {
		icon: "text-success",
		value: "text-success",
	},
	warning: {
		icon: "text-warning",
		value: "text-warning",
	},
	danger: {
		icon: "text-danger",
		value: "text-danger",
	},
};
function MetricCard({
	title,
	value,
	icon,
	color = "default",
	onPress,
	className = "",
}: {
	title: string;
	value: number | string;
	icon?: ReactNode;
	color?: keyof typeof metricCardColorStyles;
	onPress?: () => void;
	className?: string;
}) {
	const styles = metricCardColorStyles[color];
	return (
		<Card
			role={onPress ? "button" : undefined}
			tabIndex={onPress ? 0 : undefined}
			onClick={onPress}
			className={`bg-surface ${onPress ? "cursor-pointer" : ""} ${className}`}
		>
			<Card.Content className="p-4">
				<HStack alignItems="center" gap="section">
					{icon ? (
						<div
							className={`flex size-10 items-center justify-center rounded-lg bg-surface-secondary ${styles.icon}`}
						>
							{icon}
						</div>
					) : null}
					<div className="flex flex-1 flex-col">
						<Typography type="body-sm" color="muted">
							{title}
						</Typography>
						<Typography.Heading level={3} className={styles.value}>
							{typeof value === "number" ? value.toLocaleString() : value}
						</Typography.Heading>
					</div>
				</HStack>
			</Card.Content>
		</Card>
	);
}
function InquiryStatsGrid({
	stats,
	activeStatus,
	onStatusClick,
}: {
	stats: InquiryStats;
	activeStatus?: string;
	onStatusClick: (status: string | undefined) => void;
}) {
	const cards = [
		{
			key: "all",
			title: "전체",
			value: stats.total,
			icon: <Inbox className="size-5" />,
			color: "default" as const,
			status: undefined,
		},
		{
			key: "NEW",
			title: "신규",
			value: stats.newCount,
			icon: <Inbox className="size-5" />,
			color: "primary" as const,
			status: "NEW",
		},
		{
			key: "IN_PROGRESS",
			title: "진행중",
			value: stats.inProgress,
			icon: <Loader2 className="size-5" />,
			color: "warning" as const,
			status: "IN_PROGRESS",
		},
		{
			key: "RESOLVED",
			title: "해결",
			value: stats.resolved,
			icon: <CheckCircle className="size-5" />,
			color: "success" as const,
			status: "RESOLVED",
		},
		{
			key: "SLA_BREACH",
			title: "SLA 위반",
			value: stats.slaBreached,
			icon: <AlertTriangle className="size-5" />,
			color: "danger" as const,
			status: "SLA_BREACH",
		},
	];
	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-5">
			{cards.map((card) => (
				<MetricCard
					key={card.key}
					title={card.title}
					value={card.value}
					icon={card.icon}
					color={card.color}
					onPress={() => onStatusClick(card.status)}
					className={`cursor-pointer transition-all ${activeStatus === card.status ? "ring-2 ring-focus" : ""}`}
				/>
			))}
		</div>
	);
}
function InquiriesScreenFallback() {
	return (
		<VStack gap="page">
			<SectionSurface className="h-32 rounded-2xl border-border/80 bg-surface">
				<Section>
					<Section.Body>{null}</Section.Body>
				</Section>
			</SectionSurface>
		</VStack>
	);
}
export const InquiryListScreen = observer(
	({
		inquiries,
		totalCount,
		stats,
		statusOptions,
		activeStatus,
		isLoading,
		queryStates,
		setQueryStates,
		onClickNewInquiry,
		onClickInquiryRow,
		onClickStatusFilter,
	}: InquiryListScreenProps) => {
		const gridState = useLocalObservable(
			() =>
				new DataGridState({
					queryStates,
					setQueryStates,
				}),
		);
		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const inquiryRows = inquiries ?? [];
		const columns = buildInquiryTableColumns<InquiryDto>();
		const leftInputs: InputConfig[] = [
			searchInput,
			{
				...statusInput,
				props: {
					...statusInput.props,
					options: statusOptions,
				},
			},
		];
		if (isLoading) {
			return <InquiriesScreenFallback />;
		}
		return (
			<VStack gap="page">
				<Screen.Header
					title="문의 관리"
					description="고객 문의를 접수/처리/해결합니다."
					actions={
						<Button
							variant="primary"
							startContent={<Plus className="size-4" />}
							onPress={onClickNewInquiry}
						>
							문의 접수
						</Button>
					}
				/>
				<VStack>
					<SectionSurface className="rounded-2xl border-border/80 bg-surface">
						<Section>
							<Section.Body>
								<div className="mb-4 border-b border-border/80 pb-4">
									<Section.Header title="문의 현황" />
								</div>
								<InquiryStatsGrid
									stats={stats}
									activeStatus={activeStatus}
									onStatusClick={onClickStatusFilter}
								/>
							</Section.Body>
						</Section>
					</SectionSurface>
					<SectionSurface className="rounded-2xl border-border/80 bg-surface">
						<Section>
							<Section.Body>
								<div className="mb-4 border-b border-border/80 pb-4">
									<Section.Header title="문의 목록" />
								</div>
								<DataGrid
									config={{
										toolbar: {
											leftInputs,
										},
										table: {
											entity: "Inquiry",
											columns,
											onRowClick: (inquiry) => {
												onClickInquiryRow(inquiry.id);
											},
											emptyMessage: "표시할 문의가 없습니다.",
										},
									}}
									rows={inquiryRows}
									totalCount={totalCount}
									state={gridState}
								/>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			</VStack>
		);
	},
);
