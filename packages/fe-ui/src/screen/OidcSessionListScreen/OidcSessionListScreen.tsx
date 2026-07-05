"use client";

import type { OidcSessionDto } from "@cocrepo/api/idp/oidc-sessions";
import { MODEL_TYPE_OPTIONS } from "@cocrepo/constant";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildOidcSessionTableColumns,
	DataGrid,
	DataGridState,
	Screen,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { AlertDialog, Card } from "@heroui/react";
import { Activity, Trash2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { type ReactNode, useEffect } from "react";
import { Button } from "../../input/Button/Button";

/**
 * 좌측 입력 정의 (모델 타입 필터 + accountId 검색)
 */
const leftInputs: InputConfig[] = [
	{
		type: "select",
		id: "modelType",
		placeholder: "모델 타입",
		props: {
			options: MODEL_TYPE_OPTIONS as unknown as Array<{
				value: string;
				label: string;
			}>,
		},
	},
	{
		type: "search",
		id: "accountId",
		placeholder: "Account ID 검색...",
	},
];
export const idpConsoleOidcSessionsPageQueryInputs = [...leftInputs];
export interface OidcSessionListScreenQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	modelType: string;
	accountId: string;
}
export type OidcSessionListScreenSetQueryStates = DataGridSetQueryStates;
export interface OidcSessionListScreenStats {
	totalCount: number;
	byModelType: Record<string, number>;
}
export interface OidcSessionListScreenProps {
	sessions?: OidcSessionDto[];
	totalCount: number;
	isLoading: boolean;
	queryStates: OidcSessionListScreenQueryStates;
	setQueryStates: OidcSessionListScreenSetQueryStates;
	stats?: OidcSessionListScreenStats;
	isRevokingAll: boolean;
	onRevokeSession: (key: string) => void;
	onClickRevokeByGrantButton: (grantId: string) => void;
	onClickRevokeAllButton: () => void;
}
function MetricCard({
	title,
	value,
	description,
	icon,
	color = "default",
	className = "",
}: {
	title: string;
	value: number | string;
	description?: string;
	icon?: ReactNode;
	color?: "default" | "primary";
	className?: string;
}) {
	const valueColor = color === "primary" ? "text-accent" : "text-foreground";
	const iconColor = color === "primary" ? "text-accent" : "text-muted";
	return (
		<Card className={`bg-surface ${className}`}>
			<Card.Content className="flex flex-row items-center gap-4 p-4">
				{icon ? (
					<div
						className={`flex size-10 items-center justify-center rounded-lg bg-surface-secondary ${iconColor}`}
					>
						{icon}
					</div>
				) : null}
				<div className="flex flex-1 flex-col">
					<span className="text-sm text-muted">{title}</span>
					<span className={`text-2xl font-bold ${valueColor}`}>
						{typeof value === "number" ? value.toLocaleString() : value}
					</span>
					{description ? (
						<span className="text-xs text-muted">{description}</span>
					) : null}
				</div>
			</Card.Content>
		</Card>
	);
}

/**
 * OIDC 세션 목록 pure screen입니다.
 */
export const OidcSessionListScreen = observer(
	({
		sessions,
		totalCount,
		isLoading,
		queryStates,
		setQueryStates,
		stats,
		isRevokingAll,
		onRevokeSession,
		onClickRevokeByGrantButton,
		onClickRevokeAllButton,
	}: OidcSessionListScreenProps) => {
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
		const sessionRows = sessions ?? [];
		const byModelType = (stats?.byModelType ?? {}) as Record<string, number>;
		const onClickRevokeSession = (key: string) => {
			onRevokeSession(key);
		};
		const onClickGrantId = (grantId: string) => {
			onClickRevokeByGrantButton(grantId);
		};
		const isRevokeAllDisabled = totalCount === 0 || isRevokingAll;
		const columns = buildOidcSessionTableColumns<OidcSessionDto>({
			onClickGrantId,
			onClickRevokeSession,
		});
		return (
			<VStack>
				<Screen.Header
					title="OIDC 세션/토큰"
					description="OIDC 세션 및 토큰을 조회하고 관리합니다."
					actions={
						isRevokeAllDisabled ? (
							<Button
								color="danger"
								variant="flat"
								startContent={<Trash2 className="h-4 w-4" />}
								isDisabled
								isLoading={isRevokingAll}
							>
								전체 폐기
							</Button>
						) : (
							<AlertDialog>
								<AlertDialog.Trigger>
									<Button
										color="danger"
										variant="flat"
										startContent={<Trash2 className="h-4 w-4" />}
										isLoading={isRevokingAll}
									>
										전체 폐기
									</Button>
								</AlertDialog.Trigger>
								<AlertDialog.Backdrop>
									<AlertDialog.Container size="sm">
										<AlertDialog.Dialog>
											<AlertDialog.Header>
												<AlertDialog.Icon status="danger" />
												<AlertDialog.Heading>
													전체 세션/토큰 폐기
												</AlertDialog.Heading>
											</AlertDialog.Header>
											<AlertDialog.Body>
												조회 가능한 모든 OIDC 세션/토큰을 폐기합니다.
											</AlertDialog.Body>
											<AlertDialog.Footer>
												<Button variant="flat" slot="close">
													취소
												</Button>
												<Button
													color="danger"
													slot="close"
													onPress={onClickRevokeAllButton}
												>
													전체 폐기
												</Button>
											</AlertDialog.Footer>
										</AlertDialog.Dialog>
									</AlertDialog.Container>
								</AlertDialog.Backdrop>
							</AlertDialog>
						)
					}
				/>
				{stats && (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
						<MetricCard
							className="h-full border border-accent/10 bg-accent/5"
							icon={<Activity className="size-5" />}
							title="전체"
							value={stats.totalCount ?? 0}
							color="primary"
							description="현재 저장된 세션/토큰 수"
						/>
						{Object.entries(byModelType).map(([type, count]) => (
							<MetricCard
								key={type}
								className="h-full border border-border bg-surface/80"
								title={type}
								value={count}
								description="모델 타입별 활성 건수"
							/>
						))}
					</div>
				)}
				<SectionSurface className="rounded-2xl border-border/80 bg-surface/70">
					<Section overflow="hidden">
						<Section.Body>
							<DataGrid
								config={{
									entity: "OidcSession",
									columns,
									leftInputs,
									emptyMessage: "등록된 OIDC 세션/토큰이 없습니다.",
								}}
								rows={sessionRows}
								totalCount={totalCount}
								state={gridState}
								isLoading={isLoading}
							/>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
