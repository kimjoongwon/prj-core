"use client";

import {
	DetailPage,
	DetailPageSurface,
	PageTitleBar,
	DetailSection,
	DetailSectionCard,
	VStack,
} from "@cocrepo/ui";
import {
	Button,
	Checkbox,
	Chip,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import {
	ArrowLeft,
	Edit,
	Save,
	ShieldCheck,
	ShieldX,
	TriangleAlert,
	Trash2,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";

export interface AdminRolesRoleIdPageGrantItem {
	abilityId: string;
	isActive: boolean;
	priority: number;
}

export interface AdminRolesRoleIdPageAbility {
	id: string;
	name: string;
	description?: string;
	subjectId: string;
	actionId: string;
	fields: string[];
	inverted: boolean;
	reason?: string;
	subject?: { id: string; name: string; displayName?: string };
	action?: { id: string; name: string; displayName?: string };
}

export interface AdminRolesRoleIdPageRole {
	id: string;
	name: string;
	displayName?: string | null;
	description?: string | null;
	isSystem: boolean;
	removedAt?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface AdminRolesRoleIdPageChangeSummary {
	added: number;
	removed: number;
	kept: number;
}

export type AdminRolesRoleIdPagePermissionIssueCode =
	| "missingSubject"
	| "missingAbility"
	| "duplicateAbility"
	| "catalogMismatch";

export interface AdminRolesRoleIdPagePermissionIssue {
	code: AdminRolesRoleIdPagePermissionIssueCode;
	severity: "blocking" | "warning";
	message: string;
	technicalDetails?: string[];
}

export type AdminRolesRoleIdPageMenuIssueCode =
	AdminRolesRoleIdPagePermissionIssueCode;
export type AdminRolesRoleIdPageMenuIssue = AdminRolesRoleIdPagePermissionIssue;

export interface AdminRolesRoleIdPageMenuPermission {
	groupId: string;
	groupLabel: string;
	leafId: string;
	leafLabel: string;
	path?: string;
	requiredSubjects: string[];
	isSelected: boolean;
	issues: AdminRolesRoleIdPagePermissionIssue[];
}

export interface AdminRolesRoleIdPageMenuDiagnostic {
	id: string;
	severity: "blocking" | "warning";
	title: string;
	description: string;
	technicalDetails?: string[];
}

export interface AdminRolesRoleIdPagePagePermission {
	groupId: string;
	groupLabel: string;
	pageId: string;
	pageLabel: string;
	pathPattern: string;
	isSelected: boolean;
	issues: AdminRolesRoleIdPagePermissionIssue[];
}

export interface AdminRolesRoleIdPagePageDiagnostic {
	id: string;
	severity: "blocking" | "warning";
	title: string;
	description: string;
	technicalDetails?: string[];
}

export type AdminRolesRoleIdPageCrudActionKey =
	| "create"
	| "read"
	| "update"
	| "delete"
	| "manage";

export interface AdminRolesRoleIdPageCrudActionState {
	action: AdminRolesRoleIdPageCrudActionKey;
	label: string;
	isSelected: boolean;
	isAvailable: boolean;
	issueMessage?: string;
}

export interface AdminRolesRoleIdPageCrudBundle {
	bundleId: string;
	groupLabel: string;
	bundleLabel: string;
	subject: string;
	subjectLabel: string;
	description?: string;
	selectedCount: number;
	availableCount: number;
	actions: AdminRolesRoleIdPageCrudActionState[];
}

export interface AdminRolesRoleIdPageProps {
	role?: AdminRolesRoleIdPageRole;
	menuPermissions: AdminRolesRoleIdPageMenuPermission[];
	menuDiagnostics: AdminRolesRoleIdPageMenuDiagnostic[];
	pagePermissions: AdminRolesRoleIdPagePagePermission[];
	pageDiagnostics: AdminRolesRoleIdPagePageDiagnostic[];
	crudBundles: AdminRolesRoleIdPageCrudBundle[];
	grantedAdvancedAbilities: AdminRolesRoleIdPageAbility[];
	allAdvancedAbilities: AdminRolesRoleIdPageAbility[];
	selectedGrantItems: Record<string, AdminRolesRoleIdPageGrantItem>;
	changeSummary: AdminRolesRoleIdPageChangeSummary;
	isLoading: boolean;
	isLoadingAbilities: boolean;
	isLoadingAllAbilities: boolean;
	isLoadingMenuPermissions: boolean;
	isLoadingPagePermissions: boolean;
	isLoadingCrudBundles: boolean;
	isEditingGrants: boolean;
	hasChanges: boolean;
	hasGlobalAccess: boolean;
	hasBlockingPermissionDiagnostics: boolean;
	hasBlockingPageDiagnostics: boolean;
	isDeleteModalOpen: boolean;
	isSaveModalOpen: boolean;
	isDeleting: boolean;
	isSavingGrants: boolean;
	onClickBackButton: () => void;
	onClickEditButton: () => void;
	onClickOpenDeleteModal: () => void;
	onCloseDeleteModal: () => void;
	onClickDeleteConfirm: () => void;
	onClickEditGrantsButton: () => void;
	onClickCancelEditGrantsButton: () => void;
	onToggleAbilityCheckbox: (abilityId: string) => void;
	onToggleGrantActiveSwitch: (abilityId: string, isActive: boolean) => void;
	onChangeGrantPriorityInput: (abilityId: string, priority: number) => void;
	onToggleMenuPermission: (leafId: string) => void;
	onTogglePagePermission: (pageId: string) => void;
	onToggleCrudAction: (
		bundleId: string,
		action: AdminRolesRoleIdPageCrudActionKey,
	) => void;
	onClickOpenSaveGrantsModal: () => void;
	onCloseSaveGrantsModal: () => void;
	onClickConfirmSaveGrantsButton: () => void;
}

const getAbilityLabel = (
	value?: { displayName?: string; name?: string } | null,
	fallback?: string,
) => String(value?.displayName || value?.name || fallback || "-");

function getIssueChipColor(severity: "blocking" | "warning") {
	return severity === "blocking" ? "danger" : "warning";
}

function TechnicalDetails({
	items,
}: {
	items?: string[];
}) {
	if (!items || items.length === 0) {
		return null;
	}

	return (
		<details className="mt-2 rounded-lg bg-default-100/70 p-2 text-xs text-default-500">
			<summary className="cursor-pointer select-none font-medium text-default-600">
				기술 정보 보기
			</summary>
			<ul className="mt-2 space-y-1">
				{items.map((item) => (
					<li key={item}>{item}</li>
				))}
			</ul>
		</details>
	);
}

function PermissionDiagnosticsPanel({
	title,
	diagnostics,
	hasBlockingDiagnostics,
	emptyDescription,
}: {
	title: string;
	diagnostics: Array<
		AdminRolesRoleIdPageMenuDiagnostic | AdminRolesRoleIdPagePageDiagnostic
	>;
	hasBlockingDiagnostics: boolean;
	emptyDescription: string;
}) {
	return (
		<div className="rounded-2xl border border-divider/80 bg-content1/60 p-4">
			<div className="mb-3 flex items-center gap-2">
				<p className="text-sm font-semibold">{title}</p>
				{diagnostics.length > 0 ? (
					<Chip
						size="sm"
						color={hasBlockingDiagnostics ? "danger" : "warning"}
						variant="flat"
					>
						{hasBlockingDiagnostics ? "수정 필요" : "확인 필요"}
					</Chip>
				) : (
					<Chip size="sm" color="success" variant="flat">
						정상
					</Chip>
				)}
			</div>
			{diagnostics.length > 0 ? (
				<div className="space-y-3">
					{diagnostics.map((diagnostic) => (
						<div
							key={diagnostic.id}
							className="rounded-xl border border-divider/70 bg-background/70 p-3"
						>
							<div className="flex items-center gap-2">
								<Chip
									size="sm"
									color={getIssueChipColor(diagnostic.severity)}
									variant="flat"
								>
									{diagnostic.severity === "blocking" ? "차단" : "경고"}
								</Chip>
								<p className="font-medium">{diagnostic.title}</p>
							</div>
							<p className="mt-2 text-xs text-default-500">
								{diagnostic.description}
							</p>
							<TechnicalDetails items={diagnostic.technicalDetails} />
						</div>
					))}
				</div>
			) : (
				<p className="text-sm text-default-500">{emptyDescription}</p>
			)}
		</div>
	);
}

function GlobalAccessNotice({
	scopeLabel,
}: {
	scopeLabel: string;
}) {
	return (
		<div className="rounded-xl border border-primary/30 bg-primary-50/80 p-3 text-sm text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
			현재 이 역할은 전체 권한(`manage all`)이 연결되어 있어 {scopeLabel}이
			자동 허용됩니다. 세부 조정이 필요하면 고급 권한 목록에서 전체 권한을 먼저
			해제하세요.
		</div>
	);
}

function MenuPermissionSection({
	menuPermissions,
	menuDiagnostics,
	isEditingGrants,
	hasChanges,
	hasBlockingDiagnostics,
	hasGlobalAccess,
	isLoadingMenuPermissions,
	onClickEditGrantsButton,
	onClickCancelEditGrantsButton,
	onClickOpenSaveGrantsModal,
	onToggleMenuPermission,
}: {
	menuPermissions: AdminRolesRoleIdPageMenuPermission[];
	menuDiagnostics: AdminRolesRoleIdPageMenuDiagnostic[];
	isEditingGrants: boolean;
	hasChanges: boolean;
	hasBlockingDiagnostics: boolean;
	hasGlobalAccess: boolean;
	isLoadingMenuPermissions: boolean;
	onClickEditGrantsButton: () => void;
	onClickCancelEditGrantsButton: () => void;
	onClickOpenSaveGrantsModal: () => void;
	onToggleMenuPermission: (leafId: string) => void;
}) {
	const selectedCount = menuPermissions.filter((item) => item.isSelected).length;
	const groups = new Map<
		string,
		{ label: string; items: AdminRolesRoleIdPageMenuPermission[] }
	>();

	for (const permission of menuPermissions) {
		const existing = groups.get(permission.groupId);
		if (existing) {
			existing.items.push(permission);
			continue;
		}
		groups.set(permission.groupId, {
			label: permission.groupLabel,
			items: [permission],
		});
	}

	return (
		<DetailSectionCard>
			<DetailSection>
				<div className="mb-4 flex items-center justify-between gap-3">
					<div>
						<h3 className="text-lg font-semibold">메뉴 권한</h3>
						<p className="mt-1 text-sm text-default-500">
							운영자가 실제로 보게 되는 메뉴 leaf를 기준으로 역할 노출 범위를
							조정합니다.
						</p>
					</div>
					{!isEditingGrants ? (
						<Button
							size="sm"
							variant="flat"
							color="primary"
							startContent={<Edit className="h-3.5 w-3.5" />}
							onPress={onClickEditGrantsButton}
						>
							메뉴 편집
						</Button>
					) : (
						<div className="flex gap-2">
							<Button
								size="sm"
								variant="flat"
								onPress={onClickCancelEditGrantsButton}
							>
								취소
							</Button>
							<Button
								size="sm"
								color="primary"
								startContent={<Save className="h-3.5 w-3.5" />}
								isDisabled={!hasChanges || hasBlockingDiagnostics}
								onPress={onClickOpenSaveGrantsModal}
							>
								저장
							</Button>
						</div>
					)}
				</div>

				{isLoadingMenuPermissions ? (
					<div className="flex items-center justify-center p-8">
						<Spinner size="sm" />
						<span className="ml-2 text-default-500">
							메뉴 권한 구성을 불러오는 중...
						</span>
					</div>
				) : (
					<div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
						<div className="space-y-4">
							{hasGlobalAccess ? (
								<GlobalAccessNotice scopeLabel="모든 메뉴 노출" />
							) : null}
							{groups.size > 0 ? (
								Array.from(groups.entries()).map(([groupId, group]) => {
									const enabledCount = group.items.filter(
										(item) => item.isSelected,
									).length;

									return (
										<div
											key={groupId}
											className="rounded-2xl border border-divider/80 bg-content1/60 p-4"
										>
											<div className="mb-3 flex items-center justify-between gap-3">
												<div>
													<p className="font-semibold">{group.label}</p>
													<p className="text-xs text-default-500">
														{group.items.length}개 화면
													</p>
												</div>
												<Chip size="sm" color="primary" variant="flat">
													{enabledCount}/{group.items.length} 노출
												</Chip>
											</div>
											<div className="space-y-2">
												{group.items.map((item) => {
													const blockingIssues = item.issues.filter(
														(issue) => issue.severity === "blocking",
													);
													const warningIssues = item.issues.filter(
														(issue) => issue.severity === "warning",
													);
													const toggleDisabled =
														hasGlobalAccess ||
														(!item.isSelected && blockingIssues.length > 0);

													return (
														<div
															key={item.leafId}
															className="rounded-xl border border-divider/70 bg-background/70 p-3"
														>
															<div className="flex items-start justify-between gap-3">
																<div className="min-w-0">
																	<div className="flex flex-wrap items-center gap-2">
																		<p className="font-medium">{item.leafLabel}</p>
																		<Chip
																			size="sm"
																			color={
																				item.isSelected ? "success" : "default"
																			}
																			variant="flat"
																		>
																			{item.isSelected ? "노출" : "숨김"}
																		</Chip>
																		{blockingIssues.length > 0 ? (
																			<Chip
																				size="sm"
																				color="danger"
																				variant="flat"
																			>
																				지금은 변경할 수 없음
																			</Chip>
																		) : null}
																		{warningIssues.length > 0 ? (
																			<Chip
																				size="sm"
																				color="warning"
																				variant="flat"
																			>
																				주의
																			</Chip>
																		) : null}
																	</div>
																	<p className="mt-1 text-xs text-default-500">
																		{item.path ?? "경로 없음"}
																	</p>
																</div>
																{isEditingGrants ? (
																	<Checkbox
																		isSelected={item.isSelected}
																		isDisabled={toggleDisabled}
																		onValueChange={() =>
																			onToggleMenuPermission(item.leafId)
																		}
																	/>
																) : null}
															</div>
															{item.issues.length > 0 ? (
																<div className="mt-3 space-y-1">
																	{item.issues.map((issue) => (
																		<div
																			key={`${item.leafId}-${issue.code}-${issue.message}`}
																			className="flex items-start gap-2 text-xs"
																		>
																			<TriangleAlert
																				className="mt-0.5 h-3.5 w-3.5 shrink-0"
																				color={
																					issue.severity === "blocking"
																						? "var(--heroui-danger)"
																						: "var(--heroui-warning)"
																				}
																			/>
																			<span className="text-default-500">
																				{issue.message}
																			</span>
																		</div>
																	))}
																	<TechnicalDetails
																		items={item.issues.flatMap(
																			(issue) =>
																				issue.technicalDetails ?? [],
																		)}
																	/>
																</div>
															) : null}
														</div>
													);
												})}
											</div>
										</div>
									);
								})
							) : (
								<div className="rounded-2xl border border-divider/80 bg-content1/60 p-6 text-sm text-default-500">
									편집 가능한 메뉴 leaf를 구성하지 못했습니다.
								</div>
							)}
						</div>

						<div className="space-y-4">
							<div className="rounded-2xl border border-divider/80 bg-content1/60 p-4">
								<p className="text-sm font-semibold">편집 요약</p>
								<div className="mt-3 flex flex-wrap gap-2">
									<Chip size="sm" color="primary" variant="flat">
										선택 {selectedCount}
									</Chip>
									<Chip size="sm" variant="flat">
										전체 {menuPermissions.length}
									</Chip>
									<Chip
										size="sm"
										color={
											hasBlockingDiagnostics
												? "danger"
												: menuDiagnostics.length > 0
													? "warning"
													: "success"
										}
										variant="flat"
									>
										진단 {menuDiagnostics.length}
									</Chip>
								</div>
								<p className="mt-3 text-xs text-default-500">
									부모 메뉴는 자식 leaf 결과로 자동 계산되며, 저장 시 메뉴/화면/CRUD
									선택과 기존 고급 grant를 함께 동기화합니다.
								</p>
							</div>

							<PermissionDiagnosticsPanel
								title="메뉴 구성 진단"
								diagnostics={menuDiagnostics}
								hasBlockingDiagnostics={hasBlockingDiagnostics}
								emptyDescription="현재 메뉴 설정과 권한 구성이 일치합니다."
							/>
						</div>
					</div>
				)}
			</DetailSection>
		</DetailSectionCard>
	);
}

function PagePermissionSection({
	pagePermissions,
	pageDiagnostics,
	isEditingGrants,
	hasBlockingDiagnostics,
	hasGlobalAccess,
	isLoadingPagePermissions,
	onClickEditGrantsButton,
	onTogglePagePermission,
}: {
	pagePermissions: AdminRolesRoleIdPagePagePermission[];
	pageDiagnostics: AdminRolesRoleIdPagePageDiagnostic[];
	isEditingGrants: boolean;
	hasBlockingDiagnostics: boolean;
	hasGlobalAccess: boolean;
	isLoadingPagePermissions: boolean;
	onClickEditGrantsButton: () => void;
	onTogglePagePermission: (pageId: string) => void;
}) {
	const selectedCount = pagePermissions.filter((item) => item.isSelected).length;
	const groups = new Map<
		string,
		{ label: string; items: AdminRolesRoleIdPagePagePermission[] }
	>();

	for (const permission of pagePermissions) {
		const existing = groups.get(permission.groupId);
		if (existing) {
			existing.items.push(permission);
			continue;
		}
		groups.set(permission.groupId, {
			label: permission.groupLabel,
			items: [permission],
		});
	}

	return (
		<DetailSectionCard>
			<DetailSection>
				<div className="mb-4 flex items-center justify-between gap-3">
					<div>
						<h3 className="text-lg font-semibold">화면 접근</h3>
						<p className="mt-1 text-sm text-default-500">
							메뉴 노출과 별개로 URL 직접 접근을 허용할 화면을 선택합니다.
						</p>
					</div>
					{!isEditingGrants ? (
						<Button
							size="sm"
							variant="flat"
							color="primary"
							startContent={<Edit className="h-3.5 w-3.5" />}
							onPress={onClickEditGrantsButton}
						>
							권한 편집
						</Button>
					) : (
						<Chip size="sm" color="primary" variant="flat">
							메뉴 권한과 함께 저장됩니다
						</Chip>
					)}
				</div>

				{isLoadingPagePermissions ? (
					<div className="flex items-center justify-center p-8">
						<Spinner size="sm" />
						<span className="ml-2 text-default-500">
							화면 접근 구성을 불러오는 중...
						</span>
					</div>
				) : (
					<div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
						<div className="space-y-4">
							{hasGlobalAccess ? (
								<GlobalAccessNotice scopeLabel="모든 화면 접근" />
							) : null}
							{Array.from(groups.entries()).map(([groupId, group]) => (
								<div
									key={groupId}
									className="rounded-2xl border border-divider/80 bg-content1/60 p-4"
								>
									<div className="mb-3 flex items-center justify-between gap-3">
										<div>
											<p className="font-semibold">{group.label}</p>
											<p className="text-xs text-default-500">
												{group.items.length}개 화면
											</p>
										</div>
										<Chip size="sm" color="secondary" variant="flat">
											{
												group.items.filter((item) => item.isSelected).length
											}
											/{group.items.length} 허용
										</Chip>
									</div>
									<div className="space-y-2">
										{group.items.map((item) => {
											const blockingIssues = item.issues.filter(
												(issue) => issue.severity === "blocking",
											);
											const toggleDisabled =
												hasGlobalAccess ||
												(!item.isSelected && blockingIssues.length > 0);

											return (
												<div
													key={item.pageId}
													className="rounded-xl border border-divider/70 bg-background/70 p-3"
												>
													<div className="flex items-start justify-between gap-3">
														<div className="min-w-0">
															<div className="flex flex-wrap items-center gap-2">
																<p className="font-medium">{item.pageLabel}</p>
																<Chip
																	size="sm"
																	color={item.isSelected ? "success" : "default"}
																	variant="flat"
																>
																	{item.isSelected ? "접근 허용" : "접근 차단"}
																</Chip>
															</div>
															<p className="mt-1 text-xs text-default-500">
																{item.pathPattern}
															</p>
														</div>
														{isEditingGrants ? (
															<Checkbox
																isSelected={item.isSelected}
																isDisabled={toggleDisabled}
																onValueChange={() =>
																	onTogglePagePermission(item.pageId)
																}
															/>
														) : null}
													</div>
													{item.issues.length > 0 ? (
														<div className="mt-3 space-y-1">
															{item.issues.map((issue) => (
																<div
																	key={`${item.pageId}-${issue.code}-${issue.message}`}
																	className="flex items-start gap-2 text-xs"
																>
																	<TriangleAlert
																		className="mt-0.5 h-3.5 w-3.5 shrink-0"
																		color={
																			issue.severity === "blocking"
																				? "var(--heroui-danger)"
																				: "var(--heroui-warning)"
																		}
																	/>
																	<span className="text-default-500">
																		{issue.message}
																	</span>
																</div>
															))}
															<TechnicalDetails
																items={item.issues.flatMap(
																	(issue) => issue.technicalDetails ?? [],
																)}
															/>
														</div>
													) : null}
												</div>
											);
										})}
									</div>
								</div>
							))}
						</div>

						<div className="space-y-4">
							<div className="rounded-2xl border border-divider/80 bg-content1/60 p-4">
								<p className="text-sm font-semibold">편집 요약</p>
								<div className="mt-3 flex flex-wrap gap-2">
									<Chip size="sm" color="secondary" variant="flat">
										허용 {selectedCount}
									</Chip>
									<Chip size="sm" variant="flat">
										전체 {pagePermissions.length}
									</Chip>
								</div>
								<p className="mt-3 text-xs text-default-500">
									메뉴가 숨겨져 있어도 이 화면 권한이 켜져 있으면 URL 직접 접근은
									허용됩니다.
								</p>
							</div>
							<PermissionDiagnosticsPanel
								title="화면 접근 구성 진단"
								diagnostics={pageDiagnostics}
								hasBlockingDiagnostics={hasBlockingDiagnostics}
								emptyDescription="현재 화면 접근 설정과 권한 구성이 일치합니다."
							/>
						</div>
					</div>
				)}
			</DetailSection>
		</DetailSectionCard>
	);
}

function CrudBundlesSection({
	crudBundles,
	isLoadingCrudBundles,
	isEditingGrants,
	hasGlobalAccess,
	onClickEditGrantsButton,
	onToggleCrudAction,
}: {
	crudBundles: AdminRolesRoleIdPageCrudBundle[];
	isLoadingCrudBundles: boolean;
	isEditingGrants: boolean;
	hasGlobalAccess: boolean;
	onClickEditGrantsButton: () => void;
	onToggleCrudAction: (
		bundleId: string,
		action: AdminRolesRoleIdPageCrudActionKey,
	) => void;
}) {
	const groups = new Map<
		string,
		{ label: string; items: AdminRolesRoleIdPageCrudBundle[] }
	>();

	for (const bundle of crudBundles) {
		const existing = groups.get(bundle.groupLabel);
		if (existing) {
			existing.items.push(bundle);
			continue;
		}
		groups.set(bundle.groupLabel, {
			label: bundle.groupLabel,
			items: [bundle],
		});
	}

	return (
		<DetailSectionCard>
			<DetailSection>
				<div className="mb-4 flex items-center justify-between gap-3">
					<div>
						<h3 className="text-lg font-semibold">데이터 권한</h3>
						<p className="mt-1 text-sm text-default-500">
							엔티티별 CRUD 권한을 묶음으로 보고 빠르게 조정합니다.
						</p>
					</div>
					{!isEditingGrants ? (
						<Button
							size="sm"
							variant="flat"
							color="primary"
							startContent={<Edit className="h-3.5 w-3.5" />}
							onPress={onClickEditGrantsButton}
						>
							권한 편집
						</Button>
					) : (
						<Chip size="sm" color="primary" variant="flat">
							같은 편집 세션에서 저장됩니다
						</Chip>
					)}
				</div>
				{isLoadingCrudBundles ? (
					<div className="flex items-center justify-center p-8">
						<Spinner size="sm" />
						<span className="ml-2 text-default-500">
							데이터 권한 구성을 불러오는 중...
						</span>
					</div>
				) : (
					<div className="space-y-4">
					{hasGlobalAccess ? (
						<GlobalAccessNotice scopeLabel="모든 데이터 권한" />
					) : null}
					{Array.from(groups.entries()).map(([groupLabel, group]) => (
						<div
							key={groupLabel}
							className="rounded-2xl border border-divider/80 bg-content1/60 p-4"
						>
							<div className="mb-3">
								<p className="font-semibold">{group.label}</p>
								<p className="text-xs text-default-500">
									엔티티별 CRUD 묶음을 제공합니다.
								</p>
							</div>
							<div className="space-y-3">
								{group.items.map((bundle) => (
									<div
										key={bundle.bundleId}
										className="rounded-xl border border-divider/70 bg-background/70 p-3"
									>
										<div className="mb-3 flex flex-wrap items-start justify-between gap-3">
											<div>
												<p className="font-medium">{bundle.bundleLabel}</p>
												<p className="mt-1 text-xs text-default-500">
													{bundle.description ?? bundle.subjectLabel}
												</p>
											</div>
											<div className="flex flex-wrap gap-2">
												<Chip size="sm" color="primary" variant="flat">
													선택 {bundle.selectedCount}
												</Chip>
												<Chip size="sm" variant="flat">
													사용 가능 {bundle.availableCount}
												</Chip>
											</div>
										</div>
										<div className="grid gap-2 md:grid-cols-5">
											{bundle.actions.map((action) => (
												<div
													key={`${bundle.bundleId}-${action.action}`}
													className="rounded-lg border border-divider/70 bg-content1/40 p-3"
												>
													<div className="flex items-center justify-between gap-2">
														<p className="text-sm font-medium">{action.label}</p>
														{isEditingGrants ? (
															<Checkbox
																isSelected={action.isSelected}
																isDisabled={
																	hasGlobalAccess || !action.isAvailable
																}
																onValueChange={() =>
																	onToggleCrudAction(
																		bundle.bundleId,
																		action.action,
																	)
																}
															/>
														) : null}
													</div>
													<div className="mt-2 flex flex-wrap gap-2">
														<Chip
															size="sm"
															color={
																action.isAvailable
																	? action.isSelected
																		? "success"
																		: "default"
																	: "warning"
															}
															variant="flat"
														>
															{!action.isAvailable
																? "미등록"
																: action.isSelected
																	? "허용"
																	: "미허용"}
														</Chip>
													</div>
													{action.issueMessage ? (
														<p className="mt-2 text-xs text-default-500">
															{action.issueMessage}
														</p>
													) : null}
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
					</div>
				)}
			</DetailSection>
		</DetailSectionCard>
	);
}

function AdvancedAbilitiesSection({
	grantedAdvancedAbilities,
	allAdvancedAbilities,
	selectedGrantItems,
	isLoadingAbilities,
	isLoadingAllAbilities,
	isEditingGrants,
	hasGlobalAccess,
	onClickEditGrantsButton,
	onToggleAbilityCheckbox,
	onToggleGrantActiveSwitch,
	onChangeGrantPriorityInput,
}: {
	grantedAdvancedAbilities: AdminRolesRoleIdPageAbility[];
	allAdvancedAbilities: AdminRolesRoleIdPageAbility[];
	selectedGrantItems: Record<string, AdminRolesRoleIdPageGrantItem>;
	isLoadingAbilities: boolean;
	isLoadingAllAbilities: boolean;
	isEditingGrants: boolean;
	hasGlobalAccess: boolean;
	onClickEditGrantsButton: () => void;
	onToggleAbilityCheckbox: (abilityId: string) => void;
	onToggleGrantActiveSwitch: (abilityId: string, isActive: boolean) => void;
	onChangeGrantPriorityInput: (abilityId: string, priority: number) => void;
}) {
	return (
		<DetailSectionCard>
			<DetailSection>
				<div className="mb-4 flex items-center justify-between gap-3">
					<div>
						<h3 className="text-lg font-semibold">고급 권한 목록</h3>
						<p className="mt-1 text-sm text-default-500">
							메뉴/화면/CRUD 묶음으로 다루지 않는 예외 권한은 raw ability 단위로
							확인하고 조정합니다.
						</p>
					</div>
					{!isEditingGrants ? (
						<Button
							size="sm"
							variant="flat"
							color="default"
							startContent={<Edit className="h-3.5 w-3.5" />}
							onPress={onClickEditGrantsButton}
						>
							고급 편집
						</Button>
					) : (
						<Chip size="sm" color="primary" variant="flat">
							메뉴 편집과 함께 저장됩니다
						</Chip>
					)}
				</div>
				{hasGlobalAccess ? (
					<div className="mb-4">
						<GlobalAccessNotice scopeLabel="모든 메뉴, 화면, 데이터 권한" />
					</div>
				) : null}
				{isEditingGrants ? (
					isLoadingAllAbilities ? (
						<div className="flex items-center justify-center p-8">
							<Spinner size="sm" />
							<span className="ml-2 text-default-500">
								전체 권한 로딩 중...
							</span>
						</div>
					) : allAdvancedAbilities.length === 0 ? (
						<div className="py-8 text-center text-default-500">
							등록된 non-menu 권한 정의가 없습니다.
						</div>
					) : (
						<Table aria-label="고급 권한 배치 할당" removeWrapper>
							<TableHeader>
								<TableColumn width={50}>선택</TableColumn>
								<TableColumn>대상 (Subject)</TableColumn>
								<TableColumn>액션 (Action)</TableColumn>
								<TableColumn>유형</TableColumn>
								<TableColumn width={80}>활성</TableColumn>
								<TableColumn width={100}>우선순위</TableColumn>
							</TableHeader>
							<TableBody>
								{allAdvancedAbilities.map((ability) => {
									const grantItem = selectedGrantItems[ability.id];
									const isSelected = Boolean(grantItem);
									return (
										<TableRow key={ability.id}>
											<TableCell>
												<Checkbox
													isSelected={isSelected}
													onValueChange={() =>
														onToggleAbilityCheckbox(ability.id)
													}
												/>
											</TableCell>
											<TableCell>
												<span className="font-medium">
													{getAbilityLabel(ability.subject, ability.subjectId)}
												</span>
											</TableCell>
											<TableCell>
												<span className="font-mono text-sm">
													{getAbilityLabel(ability.action, ability.actionId)}
												</span>
											</TableCell>
											<TableCell>
												{ability.inverted ? (
													<Chip
														size="sm"
														color="danger"
														variant="flat"
														startContent={<ShieldX className="h-3 w-3" />}
													>
														거부
													</Chip>
												) : (
													<Chip
														size="sm"
														color="success"
														variant="flat"
														startContent={<ShieldCheck className="h-3 w-3" />}
													>
														허용
													</Chip>
												)}
											</TableCell>
											<TableCell>
												{isSelected ? (
													<Switch
														size="sm"
														isSelected={grantItem.isActive}
														onValueChange={(value) =>
															onToggleGrantActiveSwitch(ability.id, value)
														}
													/>
												) : null}
											</TableCell>
											<TableCell>
												{isSelected ? (
													<Input
														type="number"
														size="sm"
														min={0}
														max={100}
														value={String(grantItem.priority)}
														onValueChange={(value) =>
															onChangeGrantPriorityInput(
																ability.id,
																Number(value) || 0,
															)
														}
														className="w-20"
													/>
												) : null}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					)
				) : isLoadingAbilities ? (
					<div className="flex items-center justify-center p-8">
						<Spinner size="sm" />
						<span className="ml-2 text-default-500">권한 로딩 중...</span>
					</div>
				) : grantedAdvancedAbilities.length === 0 ? (
					<div className="py-8 text-center text-default-500">
						등록된 non-menu 권한이 없습니다.
					</div>
				) : (
					<Table aria-label="역할 고급 권한 목록" removeWrapper>
						<TableHeader>
							<TableColumn>대상 (Subject)</TableColumn>
							<TableColumn>액션 (Action)</TableColumn>
							<TableColumn>필드</TableColumn>
							<TableColumn>유형</TableColumn>
						</TableHeader>
						<TableBody>
							{grantedAdvancedAbilities.map((ability) => (
								<TableRow key={ability.id}>
									<TableCell>
										<span className="font-medium">
											{getAbilityLabel(ability.subject, ability.subjectId)}
										</span>
									</TableCell>
									<TableCell>
										<span className="font-mono text-sm">
											{getAbilityLabel(ability.action, ability.actionId)}
										</span>
									</TableCell>
									<TableCell>
										{ability.fields.length > 0 ? (
											<div className="flex flex-wrap gap-1">
												{ability.fields.slice(0, 3).map((field) => (
													<Chip key={field} size="sm" variant="flat">
														{field}
													</Chip>
												))}
												{ability.fields.length > 3 ? (
													<Chip size="sm" variant="flat" color="default">
														+{ability.fields.length - 3}
													</Chip>
												) : null}
											</div>
										) : (
											<span className="text-default-400">전체</span>
										)}
									</TableCell>
									<TableCell>
										{ability.inverted ? (
											<Chip
												size="sm"
												color="danger"
												variant="flat"
												startContent={<ShieldX className="h-3 w-3" />}
											>
												거부
											</Chip>
										) : (
											<Chip
												size="sm"
												color="success"
												variant="flat"
												startContent={<ShieldCheck className="h-3 w-3" />}
											>
												허용
											</Chip>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</DetailSection>
		</DetailSectionCard>
	);
}

export const AdminRolesRoleIdPage = observer(
	({
		role,
		menuPermissions,
		menuDiagnostics,
		pagePermissions,
		pageDiagnostics,
		crudBundles,
		grantedAdvancedAbilities,
		allAdvancedAbilities,
		selectedGrantItems,
		changeSummary,
		isLoading,
		isLoadingAbilities,
		isLoadingAllAbilities,
		isLoadingMenuPermissions,
		isLoadingPagePermissions,
		isLoadingCrudBundles,
		isEditingGrants,
		hasChanges,
		hasGlobalAccess,
		hasBlockingPermissionDiagnostics,
		hasBlockingPageDiagnostics,
		isDeleteModalOpen,
		isSaveModalOpen,
		isDeleting,
		isSavingGrants,
		onClickBackButton,
		onClickEditButton,
		onClickOpenDeleteModal,
		onCloseDeleteModal,
		onClickDeleteConfirm,
		onClickEditGrantsButton,
		onClickCancelEditGrantsButton,
		onToggleAbilityCheckbox,
		onToggleGrantActiveSwitch,
		onChangeGrantPriorityInput,
		onToggleMenuPermission,
		onTogglePagePermission,
		onToggleCrudAction,
		onClickOpenSaveGrantsModal,
		onCloseSaveGrantsModal,
		onClickConfirmSaveGrantsButton,
	}: AdminRolesRoleIdPageProps) => {
		if (isLoading) {
			return (
				<DetailPage top={<PageTitleBar title="역할 상세" description="로딩 중..." />}>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex items-center justify-center p-8">
								<span className="text-default-500">로딩 중...</span>
							</div>
						</DetailSectionCard>
					</DetailPageSurface>
				</DetailPage>
			);
		}

		if (!role) {
			return (
				<DetailPage
					top={
						<PageTitleBar
							title="역할 상세"
							description="역할을 찾을 수 없습니다."
						/>
					}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-default-500">역할을 찾을 수 없습니다.</p>
								<Button variant="flat" onPress={onClickBackButton}>
									목록으로
								</Button>
							</div>
						</DetailSectionCard>
					</DetailPageSurface>
				</DetailPage>
			);
		}

		const pageActions: ReactNode = (
			<div className="flex gap-2">
				<Button
					variant="light"
					startContent={<ArrowLeft className="h-4 w-4" />}
					onPress={onClickBackButton}
				>
					목록으로
				</Button>
				{!role.isSystem ? (
					<>
						<Button
							variant="flat"
							color="primary"
							startContent={<Edit className="h-4 w-4" />}
							onPress={onClickEditButton}
						>
							수정
						</Button>
						<Button
							variant="flat"
							color="danger"
							startContent={<Trash2 className="h-4 w-4" />}
							onPress={onClickOpenDeleteModal}
						>
							삭제
						</Button>
					</>
				) : null}
			</div>
		);

		return (
			<DetailPage
				top={
					<PageTitleBar
						title="역할 상세"
						description={`${role.displayName || role.name} 역할의 상세 정보입니다.`}
						actions={pageActions}
					/>
				}
			>
				<DetailPageSurface>
					<VStack gap={4}>
						{role.isSystem ? (
							<div className="rounded-xl bg-warning-50 p-4 dark:bg-warning-900/20">
								<p className="text-sm text-warning-700 dark:text-warning-400">
									<strong>시스템 역할:</strong> 이름 변경과 삭제는 제한되지만,
									메뉴 및 권한 배치는 조정할 수 있습니다.
								</p>
							</div>
						) : null}
						{hasGlobalAccess ? (
							<div className="rounded-xl bg-primary-50 p-4 dark:bg-primary-900/20">
								<p className="text-sm text-primary-700 dark:text-primary-300">
									<strong>전체 권한:</strong> 이 역할은 `manage all`이
									연결되어 있어 모든 메뉴, 화면, 데이터 권한이 자동
									허용됩니다.
								</p>
							</div>
						) : null}
						<DetailSectionCard>
							<DetailSection>
								<h3 className="mb-4 text-lg font-semibold">기본 정보</h3>
								<dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<dt className="mb-1 text-sm text-default-500">역할 식별자</dt>
										<dd className="flex items-center gap-2">
											<span className="font-mono">{role.name}</span>
											{role.isSystem ? (
												<Chip size="sm" color="warning" variant="flat">
													시스템
												</Chip>
											) : null}
										</dd>
									</div>
									<div>
										<dt className="mb-1 text-sm text-default-500">표시명</dt>
										<dd>{role.displayName || "-"}</dd>
									</div>
									<div className="md:col-span-2">
										<dt className="mb-1 text-sm text-default-500">설명</dt>
										<dd className="text-default-600">{role.description || "-"}</dd>
									</div>
								</dl>
							</DetailSection>
						</DetailSectionCard>

						<MenuPermissionSection
							menuPermissions={menuPermissions}
							menuDiagnostics={menuDiagnostics}
							isEditingGrants={isEditingGrants}
							hasChanges={hasChanges}
							hasGlobalAccess={hasGlobalAccess}
							hasBlockingDiagnostics={hasBlockingPermissionDiagnostics}
							isLoadingMenuPermissions={isLoadingMenuPermissions}
							onClickEditGrantsButton={onClickEditGrantsButton}
							onClickCancelEditGrantsButton={onClickCancelEditGrantsButton}
							onClickOpenSaveGrantsModal={onClickOpenSaveGrantsModal}
							onToggleMenuPermission={onToggleMenuPermission}
						/>

						<PagePermissionSection
							pagePermissions={pagePermissions}
							pageDiagnostics={pageDiagnostics}
							isEditingGrants={isEditingGrants}
							hasBlockingDiagnostics={hasBlockingPageDiagnostics}
							hasGlobalAccess={hasGlobalAccess}
							isLoadingPagePermissions={isLoadingPagePermissions}
							onClickEditGrantsButton={onClickEditGrantsButton}
							onTogglePagePermission={onTogglePagePermission}
						/>

						<CrudBundlesSection
							crudBundles={crudBundles}
							isLoadingCrudBundles={isLoadingCrudBundles}
							isEditingGrants={isEditingGrants}
							hasGlobalAccess={hasGlobalAccess}
							onClickEditGrantsButton={onClickEditGrantsButton}
							onToggleCrudAction={onToggleCrudAction}
						/>

						<AdvancedAbilitiesSection
							grantedAdvancedAbilities={grantedAdvancedAbilities}
							allAdvancedAbilities={allAdvancedAbilities}
							selectedGrantItems={selectedGrantItems}
							isLoadingAbilities={isLoadingAbilities}
							isLoadingAllAbilities={isLoadingAllAbilities}
							isEditingGrants={isEditingGrants}
							hasGlobalAccess={hasGlobalAccess}
							onClickEditGrantsButton={onClickEditGrantsButton}
							onToggleAbilityCheckbox={onToggleAbilityCheckbox}
							onToggleGrantActiveSwitch={onToggleGrantActiveSwitch}
							onChangeGrantPriorityInput={onChangeGrantPriorityInput}
						/>

						<DetailSectionCard>
							<DetailSection>
								<h3 className="mb-4 text-lg font-semibold">추가 정보</h3>
								<dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<dt className="mb-1 text-sm text-default-500">상태</dt>
										<dd>
											<Chip
												size="sm"
												color={role.removedAt ? "danger" : "success"}
												variant="flat"
											>
												{role.removedAt ? "삭제됨" : "활성"}
											</Chip>
										</dd>
									</div>
									<div>
										<dt className="mb-1 text-sm text-default-500">생성일</dt>
										<dd>{new Date(role.createdAt).toLocaleString("ko-KR")}</dd>
									</div>
									<div>
										<dt className="mb-1 text-sm text-default-500">수정일</dt>
										<dd>{new Date(role.updatedAt).toLocaleString("ko-KR")}</dd>
									</div>
								</dl>
							</DetailSection>
						</DetailSectionCard>
					</VStack>
				</DetailPageSurface>
				<Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
					<ModalContent>
						<ModalHeader>역할 삭제</ModalHeader>
						<ModalBody>
							<p>이 역할을 삭제하시겠습니까?</p>
						</ModalBody>
						<ModalFooter>
							<Button variant="light" onPress={onCloseDeleteModal}>
								취소
							</Button>
							<Button
								color="danger"
								isLoading={isDeleting}
								onPress={onClickDeleteConfirm}
							>
								삭제
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
				<Modal isOpen={isSaveModalOpen} onClose={onCloseSaveGrantsModal}>
					<ModalContent>
						<ModalHeader>권한 변경 확인</ModalHeader>
						<ModalBody>
							<div className="space-y-2 text-sm">
								<p>추가: {changeSummary.added}건</p>
								<p>제거: {changeSummary.removed}건</p>
								<p>유지: {changeSummary.kept}건</p>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button variant="light" onPress={onCloseSaveGrantsModal}>
								취소
							</Button>
							<Button
								color="primary"
								isLoading={isSavingGrants}
								onPress={onClickConfirmSaveGrantsButton}
							>
								저장
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</DetailPage>
		);
	},
);
