"use client";

import {
	type AbilityResponseDto,
	getGetAbilitiesByRoleIdQueryKey,
	useGetAbilities,
	useGetAbilitiesByRoleId,
} from "@cocrepo/api/core/abilities";
import { useBatchAssignGrantsToRole } from "@cocrepo/api/core/grants";
import { useDeleteRole, useGetRoleById } from "@cocrepo/api/core/roles";
import { useGetSubjects } from "@cocrepo/api/core/subjects";
import {
	ADMIN_CRUD_BUNDLES,
	ADMIN_MENU_PERMISSION_LEAFS,
	ADMIN_MENU_PERMISSION_SUBJECTS,
	ADMIN_PAGE_ACCESS_ITEMS,
} from "@cocrepo/constant";
import {
	AdminRolesRoleIdPage,
	type AdminRolesRoleIdPageAbility,
	type AdminRolesRoleIdPageCrudActionKey,
	type AdminRolesRoleIdPageCrudBundle,
	type AdminRolesRoleIdPageGrantItem,
	type AdminRolesRoleIdPageMenuDiagnostic,
	type AdminRolesRoleIdPageMenuIssue,
	type AdminRolesRoleIdPageMenuPermission,
	type AdminRolesRoleIdPagePageDiagnostic,
	type AdminRolesRoleIdPagePagePermission,
	type AdminRolesRoleIdPagePermissionIssue,
	type AdminRolesRoleIdPageRelatedAbility,
	type AdminRolesRoleIdPageRole,
} from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const MENU_ACTION_NAME = "manage";
const PAGE_ACTION_NAME = "access";
const GLOBAL_ACTION_NAME = "manage";
const GLOBAL_SUBJECT_NAME = "all";
const MENU_SUBJECT_PREFIX = "menu:";
const PAGE_SUBJECT_PREFIX = "page:";
const ENTITY_SUBJECT_PREFIX = "entity:";
const CRUD_ACTIONS: AdminRolesRoleIdPageCrudActionKey[] = [
	"create",
	"read",
	"update",
	"delete",
	"manage",
];

interface MenuRequirementResolution {
	subjectName: string;
	matchedAbilityIds: string[];
	preferredAbilityId?: string;
}

interface MenuPermissionToggleResolution {
	groupId: string;
	groupSubject: string;
	leafId: string;
	leafSubject: string;
	requirements: MenuRequirementResolution[];
	groupRequirement: MenuRequirementResolution;
	leafRequirement: MenuRequirementResolution;
	hasBlockingIssues: boolean;
}

interface BuildMenuPermissionStateResult {
	menuPermissions: AdminRolesRoleIdPageMenuPermission[];
	menuDiagnostics: AdminRolesRoleIdPageMenuDiagnostic[];
	permissionStateByLeaf: Map<string, MenuPermissionToggleResolution>;
	hasBlockingMenuDiagnostics: boolean;
}

interface PagePermissionToggleResolution {
	pageId: string;
	pageLabel: string;
	subjectName: string;
	matchedAbilityIds: string[];
	preferredAbilityId?: string;
	hasBlockingIssues: boolean;
}

interface BuildPagePermissionStateResult {
	pagePermissions: AdminRolesRoleIdPagePagePermission[];
	pageDiagnostics: AdminRolesRoleIdPagePageDiagnostic[];
	permissionStateByPage: Map<string, PagePermissionToggleResolution>;
	hasBlockingPageDiagnostics: boolean;
}

interface CrudActionResolution {
	bundleId: string;
	action: AdminRolesRoleIdPageCrudActionKey;
	matchedAbilityIds: string[];
	preferredAbilityId?: string;
	isAvailable: boolean;
}

interface BuildCrudBundleStateResult {
	crudBundles: AdminRolesRoleIdPageCrudBundle[];
	actionStateByKey: Map<string, CrudActionResolution>;
}

const AdminRolesRoleDetailRoute = observer(() => {
	const { roleId } = useParams<{ roleId: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
	const [isEditingGrants, setIsEditingGrants] = useState(false);
	const [selectedGrantItems, setSelectedGrantItems] = useState<
		Record<string, AdminRolesRoleIdPageGrantItem>
	>({});
	const [hasChanges, setHasChanges] = useState(false);

	const { data: response, isLoading } = useGetRoleById(roleId);
	const role = response?.data as AdminRolesRoleIdPageRole | undefined;

	const { data: abilitiesResponse, isLoading: isLoadingAbilities } =
		useGetAbilitiesByRoleId(roleId);
	const grantedAbilityDtos = abilitiesResponse?.data ?? [];

	const {
		data: allAbilitiesResponse,
		isLoading: isLoadingAllAbilities,
		isError: isAllAbilitiesError,
	} = useGetAbilities();
	const allAbilityDtos = allAbilitiesResponse?.data ?? [];

	const {
		data: subjectsResponse,
		isLoading: isLoadingSubjects,
		isError: isSubjectsError,
	} = useGetSubjects();
	const subjectDtos = subjectsResponse?.data ?? [];

	const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole({
		mutation: {
			onSuccess: () => {
				setIsDeleteModalOpen(false);
				router.push("/roles" as Route);
			},
		},
	});

	const { mutate: saveBatchGrants, isPending: isSavingGrants } =
		useBatchAssignGrantsToRole({
			mutation: {
				onSuccess: () => {
					setIsSaveModalOpen(false);
					setIsEditingGrants(false);
					setHasChanges(false);
					queryClient.invalidateQueries({
						queryKey: getGetAbilitiesByRoleIdQueryKey(roleId),
					});
				},
			},
		});

	const currentIds = new Set(grantedAbilityDtos.map((ability) => ability.id));
	const activeSelectedAbilityIds = isEditingGrants
		? new Set(Object.keys(selectedGrantItems))
		: currentIds;
	const hasGlobalAccess = hasGlobalAccessAbilitySelected(
		activeSelectedAbilityIds,
		allAbilityDtos,
	);
	const {
		menuPermissions,
		menuDiagnostics,
		permissionStateByLeaf,
		hasBlockingMenuDiagnostics,
	} = buildMenuPermissionState({
		allAbilities: allAbilityDtos,
		subjectNames: subjectDtos.map((subject) => subject.name),
		selectedAbilityIds: activeSelectedAbilityIds,
		hasGlobalAccess,
		isConfigError: isAllAbilitiesError || isSubjectsError,
	});
	const {
		pagePermissions,
		pageDiagnostics,
		permissionStateByPage,
		hasBlockingPageDiagnostics,
	} = buildPagePermissionState({
		allAbilities: allAbilityDtos,
		subjectNames: subjectDtos.map((subject) => subject.name),
		selectedAbilityIds: activeSelectedAbilityIds,
		hasGlobalAccess,
		isConfigError: isAllAbilitiesError || isSubjectsError,
	});
	const { crudBundles, actionStateByKey } = buildCrudBundleState({
		allAbilities: allAbilityDtos,
		selectedAbilityIds: activeSelectedAbilityIds,
		hasGlobalAccess,
	});
	const grantedAdvancedAbilities = grantedAbilityDtos
		.filter((ability) => isAdvancedRoleDetailAbility(ability))
		.map(mapAbilityItem);
	const allAdvancedAbilities = allAbilityDtos
		.filter((ability) => isAdvancedRoleDetailAbility(ability))
		.map(mapAbilityItem);
	const hasBlockingPermissionDiagnostics =
		hasBlockingMenuDiagnostics || hasBlockingPageDiagnostics;
	const nextIds = new Set(Object.keys(selectedGrantItems));
	const changeSummary = (() => {
		const added = [...nextIds].filter((id) => !currentIds.has(id));
		const removed = [...currentIds].filter((id) => !nextIds.has(id));
		const kept = [...nextIds].filter((id) => currentIds.has(id));
		return { added: added.length, removed: removed.length, kept: kept.length };
	})();

	const onClickEditGrantsButton = () => {
		const nextItems = Object.fromEntries(
			grantedAbilityDtos.map((ability) => [
				ability.id,
				{
					abilityId: ability.id,
					isActive: true,
					priority: 0,
				} satisfies AdminRolesRoleIdPageGrantItem,
			]),
		);
		setSelectedGrantItems(nextItems);
		setIsEditingGrants(true);
		setHasChanges(false);
	};

	return (
		<AdminRolesRoleIdPage
			role={role}
			menuPermissions={menuPermissions}
			menuDiagnostics={menuDiagnostics}
			pagePermissions={pagePermissions}
			pageDiagnostics={pageDiagnostics}
			crudBundles={crudBundles}
			grantedAdvancedAbilities={grantedAdvancedAbilities}
			allAdvancedAbilities={allAdvancedAbilities}
			selectedGrantItems={selectedGrantItems}
			changeSummary={changeSummary}
			isLoading={isLoading}
			isLoadingAbilities={isLoadingAbilities}
			isLoadingAllAbilities={isLoadingAllAbilities}
			isLoadingMenuPermissions={isLoadingAllAbilities || isLoadingSubjects}
			isLoadingPagePermissions={isLoadingAllAbilities || isLoadingSubjects}
			isLoadingCrudBundles={isLoadingAllAbilities}
			isEditingGrants={isEditingGrants}
			hasChanges={hasChanges}
			hasGlobalAccess={hasGlobalAccess}
			hasBlockingPermissionDiagnostics={hasBlockingPermissionDiagnostics}
			hasBlockingPageDiagnostics={hasBlockingPageDiagnostics}
			isDeleteModalOpen={isDeleteModalOpen}
			isSaveModalOpen={isSaveModalOpen}
			isDeleting={isDeleting}
			isSavingGrants={isSavingGrants}
			onClickBackButton={() => {
				router.push("/roles" as Route);
			}}
			onClickEditButton={() => {
				router.push(`/roles/${roleId}/edit` as Route);
			}}
			onClickOpenDeleteModal={() => {
				setIsDeleteModalOpen(true);
			}}
			onCloseDeleteModal={() => {
				setIsDeleteModalOpen(false);
			}}
			onClickDeleteConfirm={() => {
				deleteRole({ id: roleId });
			}}
			onClickEditGrantsButton={onClickEditGrantsButton}
			onClickCancelEditGrantsButton={() => {
				setIsEditingGrants(false);
				setHasChanges(false);
			}}
			onToggleMenuPermission={(leafId) => {
				if (hasGlobalAccess) {
					return;
				}
				const resolution = permissionStateByLeaf.get(leafId);
				if (!resolution) {
					return;
				}

				setSelectedGrantItems((current) => {
					const next = { ...current };
					const isSelected = isRequirementSelected(
						resolution.requirements,
						new Set(Object.keys(current)),
					);

					if (!isSelected && resolution.hasBlockingIssues) {
						return current;
					}

					if (isSelected) {
						for (const abilityId of resolution.leafRequirement
							.matchedAbilityIds) {
							delete next[abilityId];
						}

						const isStandaloneLeaf =
							resolution.groupSubject === resolution.leafSubject;
						if (!isStandaloneLeaf) {
							const nextIdsAfterLeafRemoval = new Set(Object.keys(next));
							const siblingLeaves = ADMIN_MENU_PERMISSION_LEAFS.filter(
								(leaf) =>
									leaf.groupId === resolution.groupId && leaf.leafId !== leafId,
							);
							const hasSelectedSibling = siblingLeaves.some((leaf) => {
								const siblingResolution = permissionStateByLeaf.get(
									leaf.leafId,
								);
								if (!siblingResolution) {
									return false;
								}
								return siblingResolution.leafRequirement.matchedAbilityIds.some(
									(abilityId) => nextIdsAfterLeafRemoval.has(abilityId),
								);
							});

							if (!hasSelectedSibling) {
								for (const abilityId of resolution.groupRequirement
									.matchedAbilityIds) {
									delete next[abilityId];
								}
							}
						}
					} else {
						for (const requirement of resolution.requirements) {
							const alreadySelected = requirement.matchedAbilityIds.some(
								(abilityId) => Boolean(next[abilityId]),
							);
							if (alreadySelected || !requirement.preferredAbilityId) {
								continue;
							}
							next[requirement.preferredAbilityId] = buildGrantItem(
								requirement.preferredAbilityId,
								current[requirement.preferredAbilityId],
							);
						}
					}

					return next;
				});
				setHasChanges(true);
			}}
			onTogglePagePermission={(pageId) => {
				if (hasGlobalAccess) {
					return;
				}
				const resolution = permissionStateByPage.get(pageId);
				if (!resolution) {
					return;
				}

				setSelectedGrantItems((current) => {
					const next = { ...current };
					const isSelected = resolution.matchedAbilityIds.some((abilityId) =>
						Object.hasOwn(current, abilityId),
					);

					if (!isSelected && resolution.hasBlockingIssues) {
						return current;
					}

					if (isSelected) {
						for (const abilityId of resolution.matchedAbilityIds) {
							delete next[abilityId];
						}
					} else if (resolution.preferredAbilityId) {
						next[resolution.preferredAbilityId] = buildGrantItem(
							resolution.preferredAbilityId,
							current[resolution.preferredAbilityId],
						);
					}

					return next;
				});
				setHasChanges(true);
			}}
			onToggleCrudAction={(bundleId, action) => {
				if (hasGlobalAccess) {
					return;
				}
				const resolution = actionStateByKey.get(`${bundleId}:${action}`);
				if (!resolution) {
					return;
				}

				setSelectedGrantItems((current) => {
					const next = { ...current };
					const isSelected = resolution.matchedAbilityIds.some((abilityId) =>
						Object.hasOwn(current, abilityId),
					);

					if (isSelected) {
						for (const abilityId of resolution.matchedAbilityIds) {
							delete next[abilityId];
						}
					} else if (resolution.preferredAbilityId) {
						next[resolution.preferredAbilityId] = buildGrantItem(
							resolution.preferredAbilityId,
							current[resolution.preferredAbilityId],
						);
					}

					return next;
				});
				setHasChanges(true);
			}}
			onToggleAbilityCheckbox={(abilityId) => {
				setSelectedGrantItems((current) => {
					const next = { ...current };
					if (next[abilityId]) {
						delete next[abilityId];
					} else {
						next[abilityId] = {
							abilityId,
							isActive: true,
							priority: 0,
						};
					}
					return next;
				});
				setHasChanges(true);
			}}
			onToggleGrantActiveSwitch={(abilityId, isActive) => {
				setSelectedGrantItems((current) => ({
					...current,
					[abilityId]: {
						...(current[abilityId] ?? {
							abilityId,
							isActive: true,
							priority: 0,
						}),
						isActive,
					},
				}));
				setHasChanges(true);
			}}
			onChangeGrantPriorityInput={(abilityId, priority) => {
				setSelectedGrantItems((current) => ({
					...current,
					[abilityId]: {
						...(current[abilityId] ?? {
							abilityId,
							isActive: true,
							priority: 0,
						}),
						priority,
					},
				}));
				setHasChanges(true);
			}}
			onClickOpenSaveGrantsModal={() => {
				setIsSaveModalOpen(true);
			}}
			onCloseSaveGrantsModal={() => {
				setIsSaveModalOpen(false);
			}}
			onClickConfirmSaveGrantsButton={() => {
				saveBatchGrants({
					roleId,
					data: {
						roleGrants: Object.values(selectedGrantItems),
					},
				});
			}}
			onClickOpenAbilityDetail={(abilityId) => {
				router.push(`/abilities/${abilityId}` as Route);
			}}
		/>
	);
});

function buildMenuPermissionState({
	allAbilities,
	subjectNames,
	selectedAbilityIds,
	hasGlobalAccess,
	isConfigError,
}: {
	allAbilities: AbilityResponseDto[];
	subjectNames: string[];
	selectedAbilityIds: Set<string>;
	hasGlobalAccess: boolean;
	isConfigError: boolean;
}): BuildMenuPermissionStateResult {
	if (isConfigError) {
		return {
			menuPermissions: [],
			menuDiagnostics: [
				{
					id: "menu-config-load-failed",
					severity: "blocking",
					title: "메뉴 권한 구성을 불러오지 못했습니다.",
					description:
						"subjects 또는 abilities 조회에 실패했습니다. 잠시 후 다시 시도해 주세요.",
				},
			],
			permissionStateByLeaf: new Map(),
			hasBlockingMenuDiagnostics: true,
		};
	}

	const subjectNameSet = new Set(subjectNames);
	const canonicalAbilityMap = new Map<string, AbilityResponseDto[]>();
	for (const ability of allAbilities) {
		if (!isCanonicalMenuAbility(ability) || !ability.subject?.name) {
			continue;
		}
		const current = canonicalAbilityMap.get(ability.subject.name) ?? [];
		current.push(ability);
		canonicalAbilityMap.set(ability.subject.name, current);
	}

	const menuPermissions: AdminRolesRoleIdPageMenuPermission[] = [];
	const menuDiagnostics: AdminRolesRoleIdPageMenuDiagnostic[] = [];
	const permissionStateByLeaf = new Map<
		string,
		MenuPermissionToggleResolution
	>();

	for (const leaf of ADMIN_MENU_PERMISSION_LEAFS) {
		const issues: AdminRolesRoleIdPageMenuIssue[] = [];
		const requirements = leaf.requiredSubjects.map((subjectName) => {
			const matchedAbilities = canonicalAbilityMap.get(subjectName) ?? [];
			const preferredAbility = pickPreferredCanonicalAbility(matchedAbilities);

			if (!hasGlobalAccess && !subjectNameSet.has(subjectName)) {
				issues.push({
					code: "missingSubject",
					severity: "blocking",
					message: `${leaf.leafLabel} 메뉴에 필요한 시스템 설정이 아직 등록되지 않았습니다.`,
					technicalDetails: [`누락 subject: ${subjectName}`],
				});
			}

			if (!hasGlobalAccess && matchedAbilities.length === 0) {
				issues.push({
					code: "missingAbility",
					severity: "blocking",
					message: `${leaf.leafLabel} 메뉴를 역할에 연결할 기본 권한이 아직 준비되지 않았습니다.`,
					technicalDetails: [
						`누락 ability: ${MENU_ACTION_NAME} ${subjectName}`,
					],
				});
			} else if (!hasGlobalAccess && matchedAbilities.length > 1) {
				issues.push({
					code: "duplicateAbility",
					severity: "warning",
					message: `${leaf.leafLabel} 메뉴 권한이 여러 개라 최신 구성을 기준으로 연결합니다.`,
					technicalDetails: [
						`중복 ability: ${MENU_ACTION_NAME} ${subjectName} (${matchedAbilities.length}개)`,
					],
					relatedAbilities: mapRelatedAbilities(
						matchedAbilities,
						preferredAbility?.id,
					),
				});
			}

			return {
				subjectName,
				matchedAbilityIds: matchedAbilities.map((ability) => ability.id),
				preferredAbilityId: preferredAbility?.id,
			} satisfies MenuRequirementResolution;
		});

		const mergedIssues = mergePermissionIssues(issues);
		const issuesWithDiagnostics = mergedIssues.map((issue, index) => ({
			issue,
			diagnostic: {
				id: `${leaf.leafId}-${issue.code}-${index}`,
				severity: issue.severity,
				title: `${leaf.groupLabel} / ${leaf.leafLabel}`,
				description: issue.message,
				technicalDetails: issue.technicalDetails,
				relatedAbilities: issue.relatedAbilities,
			} satisfies AdminRolesRoleIdPageMenuDiagnostic,
		}));

		if (!hasGlobalAccess) {
			menuDiagnostics.push(
				...issuesWithDiagnostics.map(({ diagnostic }) => diagnostic),
			);
		}

		const groupRequirement =
			requirements.find(
				(requirement) => requirement.subjectName === leaf.groupSubject,
			) ?? requirements[0];
		const leafRequirement =
			requirements.find(
				(requirement) => requirement.subjectName === leaf.leafSubject,
			) ?? requirements[requirements.length - 1];
		const isSelected =
			hasGlobalAccess ||
			isRequirementSelected(requirements, selectedAbilityIds);

		menuPermissions.push({
			groupId: leaf.groupId,
			groupLabel: leaf.groupLabel,
			leafId: leaf.leafId,
			leafLabel: leaf.leafLabel,
			path: leaf.path,
			requiredSubjects: leaf.requiredSubjects,
			isSelected,
			issues: mergedIssues,
		});

		permissionStateByLeaf.set(leaf.leafId, {
			groupId: leaf.groupId,
			groupSubject: leaf.groupSubject,
			leafId: leaf.leafId,
			leafSubject: leaf.leafSubject,
			requirements,
			groupRequirement,
			leafRequirement,
			hasBlockingIssues: mergedIssues.some(
				(issue) => issue.severity === "blocking",
			),
		});
	}

	if (!hasGlobalAccess) {
		const catalogSubjectSet = new Set(ADMIN_MENU_PERMISSION_SUBJECTS);
		for (const [subjectName, matches] of canonicalAbilityMap.entries()) {
			if (catalogSubjectSet.has(subjectName)) {
				continue;
			}

			menuDiagnostics.push({
				id: `catalog-mismatch-${subjectName}`,
				severity: "warning",
				title: "정리되지 않은 메뉴 권한이 있습니다",
				description:
					"현재 코드에 연결되지 않은 메뉴 권한이 시스템에 남아 있습니다. 권한 구성을 정리해 주세요.",
				technicalDetails: [
					`연결되지 않은 menu subject: ${subjectName}`,
					`중복 count: ${matches.length}`,
				],
				relatedAbilities: mapRelatedAbilities(matches),
			});
		}
	}

	return {
		menuPermissions,
		menuDiagnostics,
		permissionStateByLeaf,
		hasBlockingMenuDiagnostics: menuDiagnostics.some(
			(diagnostic) => diagnostic.severity === "blocking",
		),
	};
}

function buildPagePermissionState({
	allAbilities,
	subjectNames,
	selectedAbilityIds,
	hasGlobalAccess,
	isConfigError,
}: {
	allAbilities: AbilityResponseDto[];
	subjectNames: string[];
	selectedAbilityIds: Set<string>;
	hasGlobalAccess: boolean;
	isConfigError: boolean;
}): BuildPagePermissionStateResult {
	if (isConfigError) {
		return {
			pagePermissions: [],
			pageDiagnostics: [
				{
					id: "page-config-load-failed",
					severity: "blocking",
					title: "화면 접근 구성을 불러오지 못했습니다.",
					description:
						"subjects 또는 abilities 조회에 실패했습니다. 잠시 후 다시 시도해 주세요.",
				},
			],
			permissionStateByPage: new Map(),
			hasBlockingPageDiagnostics: true,
		};
	}

	const subjectNameSet = new Set(subjectNames);
	const canonicalAbilityMap = new Map<string, AbilityResponseDto[]>();
	for (const ability of allAbilities) {
		if (!isCanonicalPageAbility(ability) || !ability.subject?.name) {
			continue;
		}
		const current = canonicalAbilityMap.get(ability.subject.name) ?? [];
		current.push(ability);
		canonicalAbilityMap.set(ability.subject.name, current);
	}

	const pagePermissions: AdminRolesRoleIdPagePagePermission[] = [];
	const pageDiagnostics: AdminRolesRoleIdPagePageDiagnostic[] = [];
	const permissionStateByPage = new Map<
		string,
		PagePermissionToggleResolution
	>();

	for (const item of ADMIN_PAGE_ACCESS_ITEMS) {
		const issues: AdminRolesRoleIdPageMenuIssue[] = [];
		const matchedAbilities = canonicalAbilityMap.get(item.subject) ?? [];
		const preferredAbility = pickPreferredCanonicalAbility(matchedAbilities);

		if (!hasGlobalAccess && !subjectNameSet.has(item.subject)) {
			issues.push({
				code: "missingSubject",
				severity: "blocking",
				message: `${item.pageLabel} 화면에 필요한 시스템 설정이 아직 등록되지 않았습니다.`,
				technicalDetails: [`누락 subject: ${item.subject}`],
			});
		}

		if (!hasGlobalAccess && matchedAbilities.length === 0) {
			issues.push({
				code: "missingAbility",
				severity: "blocking",
				message: `${item.pageLabel} 화면을 역할에 연결할 기본 권한이 아직 준비되지 않았습니다.`,
				technicalDetails: [`누락 ability: ${PAGE_ACTION_NAME} ${item.subject}`],
			});
		} else if (!hasGlobalAccess && matchedAbilities.length > 1) {
			issues.push({
				code: "duplicateAbility",
				severity: "warning",
				message: `${item.pageLabel} 화면 권한이 여러 개라 최신 구성을 기준으로 연결합니다.`,
				technicalDetails: [
					`중복 ability: ${PAGE_ACTION_NAME} ${item.subject} (${matchedAbilities.length}개)`,
				],
				relatedAbilities: mapRelatedAbilities(
					matchedAbilities,
					preferredAbility?.id,
				),
			});
		}

		const mergedIssues = mergePermissionIssues(issues);
		if (!hasGlobalAccess) {
			for (const issue of mergedIssues) {
				pageDiagnostics.push({
					id: `${item.pageId}-${issue.code}-${issue.message}`,
					severity: issue.severity,
					title: `${item.groupLabel} / ${item.pageLabel}`,
					description: issue.message,
					technicalDetails: issue.technicalDetails,
					relatedAbilities: issue.relatedAbilities,
				});
			}
		}

		pagePermissions.push({
			groupId: item.groupId,
			groupLabel: item.groupLabel,
			pageId: item.pageId,
			pageLabel: item.pageLabel,
			pathPattern: item.pathPattern,
			isSelected:
				hasGlobalAccess ||
				matchedAbilities.some((ability) => selectedAbilityIds.has(ability.id)),
			issues: mergedIssues,
		});

		permissionStateByPage.set(item.pageId, {
			pageId: item.pageId,
			pageLabel: item.pageLabel,
			subjectName: item.subject,
			matchedAbilityIds: matchedAbilities.map((ability) => ability.id),
			preferredAbilityId: preferredAbility?.id,
			hasBlockingIssues: mergedIssues.some(
				(issue) => issue.severity === "blocking",
			),
		});
	}

	if (!hasGlobalAccess) {
		const catalogSubjectSet = new Set(
			ADMIN_PAGE_ACCESS_ITEMS.map((item) => item.subject),
		);
		for (const [subjectName, matches] of canonicalAbilityMap.entries()) {
			if (catalogSubjectSet.has(subjectName)) {
				continue;
			}

			pageDiagnostics.push({
				id: `page-catalog-mismatch-${subjectName}`,
				severity: "warning",
				title: "정리되지 않은 화면 권한이 있습니다",
				description:
					"현재 코드에 연결되지 않은 화면 권한이 시스템에 남아 있습니다. 권한 구성을 정리해 주세요.",
				technicalDetails: [
					`연결되지 않은 page subject: ${subjectName}`,
					`중복 count: ${matches.length}`,
				],
				relatedAbilities: mapRelatedAbilities(matches),
			});
		}
	}

	return {
		pagePermissions,
		pageDiagnostics,
		permissionStateByPage,
		hasBlockingPageDiagnostics: pageDiagnostics.some(
			(diagnostic) => diagnostic.severity === "blocking",
		),
	};
}

function buildCrudBundleState({
	allAbilities,
	selectedAbilityIds,
	hasGlobalAccess,
}: {
	allAbilities: AbilityResponseDto[];
	selectedAbilityIds: Set<string>;
	hasGlobalAccess: boolean;
}): BuildCrudBundleStateResult {
	const canonicalCrudAbilityMap = new Map<string, AbilityResponseDto[]>();
	const entitySubjectMeta = new Map<
		string,
		{ displayName?: string; bundleLabel?: string }
	>();

	for (const ability of allAbilities) {
		if (
			!isCrudAbility(ability) ||
			!ability.subject?.name ||
			!ability.action?.name
		) {
			continue;
		}

		const key = `${ability.subject.name}:${ability.action.name}`;
		const current = canonicalCrudAbilityMap.get(key) ?? [];
		current.push(ability);
		canonicalCrudAbilityMap.set(key, current);

		entitySubjectMeta.set(ability.subject.name, {
			displayName: ability.subject.displayName ?? undefined,
			bundleLabel: ability.subject.displayName
				? `${ability.subject.displayName} 데이터`
				: undefined,
		});
	}

	const knownBundleSubjects = new Set(
		ADMIN_CRUD_BUNDLES.map((bundle) => bundle.subject),
	);
	const extraBundleSubjects = Array.from(entitySubjectMeta.keys())
		.filter((subject) => !knownBundleSubjects.has(subject))
		.sort();
	const extraBundles = extraBundleSubjects.map((subject) => {
		const meta = entitySubjectMeta.get(subject);
		return {
			bundleId: subject.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
			groupLabel: "기타 데이터",
			bundleLabel: meta?.bundleLabel ?? subject,
			subject,
			description: "코드 catalog에 등록되지 않은 엔티티 권한입니다.",
			actions: CRUD_ACTIONS,
		};
	});

	const bundles = [...ADMIN_CRUD_BUNDLES, ...extraBundles];
	const actionStateByKey = new Map<string, CrudActionResolution>();
	const crudBundles: AdminRolesRoleIdPageCrudBundle[] = bundles.map(
		(bundle) => {
			const subjectMeta = entitySubjectMeta.get(bundle.subject);
			const actions = CRUD_ACTIONS.map((action) => {
				const matchedAbilities =
					canonicalCrudAbilityMap.get(`${bundle.subject}:${action}`) ?? [];
				const preferredAbility = pickPreferredCrudAbility(matchedAbilities);
				const issueMessage =
					matchedAbilities.length === 0
						? "기본 권한이 아직 등록되지 않았습니다."
						: matchedAbilities.length > 1
							? "조건이 다른 권한이 함께 있어 기본 권한을 우선 사용합니다."
							: undefined;

				actionStateByKey.set(`${bundle.bundleId}:${action}`, {
					bundleId: bundle.bundleId,
					action,
					matchedAbilityIds: matchedAbilities.map((ability) => ability.id),
					preferredAbilityId: preferredAbility?.id,
					isAvailable: hasGlobalAccess || matchedAbilities.length > 0,
				});

				return {
					action,
					label: getCrudActionLabel(action),
					isSelected:
						hasGlobalAccess ||
						matchedAbilities.some((ability) =>
							selectedAbilityIds.has(ability.id),
						),
					isAvailable: hasGlobalAccess || matchedAbilities.length > 0,
					issueMessage: hasGlobalAccess ? undefined : issueMessage,
				};
			});

			return {
				bundleId: bundle.bundleId,
				groupLabel: bundle.groupLabel,
				bundleLabel: bundle.bundleLabel,
				subject: bundle.subject,
				subjectLabel: subjectMeta?.displayName ?? bundle.subject,
				description: bundle.description,
				selectedCount: actions.filter((action) => action.isSelected).length,
				availableCount: actions.filter((action) => action.isAvailable).length,
				actions,
			};
		},
	);

	return {
		crudBundles,
		actionStateByKey,
	};
}

function isRequirementSelected(
	requirements: MenuRequirementResolution[],
	selectedAbilityIds: Set<string>,
): boolean {
	return requirements.every((requirement) =>
		requirement.matchedAbilityIds.some((abilityId) =>
			selectedAbilityIds.has(abilityId),
		),
	);
}

function buildGrantItem(
	abilityId: string,
	current?: AdminRolesRoleIdPageGrantItem,
): AdminRolesRoleIdPageGrantItem {
	return (
		current ?? {
			abilityId,
			isActive: true,
			priority: 0,
		}
	);
}

function mapRelatedAbilities(
	matches: AbilityResponseDto[],
	preferredAbilityId?: string,
): AdminRolesRoleIdPageRelatedAbility[] | undefined {
	if (matches.length === 0) {
		return undefined;
	}

	return matches.map((ability) => ({
		id: ability.id,
		label: ability.name,
		href: `/abilities/${ability.id}`,
		isPreferred: ability.id === preferredAbilityId,
	}));
}

function mergePermissionIssues(
	issues: AdminRolesRoleIdPagePermissionIssue[],
): AdminRolesRoleIdPagePermissionIssue[] {
	const merged = new Map<string, AdminRolesRoleIdPagePermissionIssue>();

	for (const issue of issues) {
		const key = `${issue.code}:${issue.severity}:${issue.message}`;
		const existing = merged.get(key);
		if (!existing) {
			merged.set(key, {
				...issue,
				technicalDetails: issue.technicalDetails
					? [...new Set(issue.technicalDetails)]
					: undefined,
				relatedAbilities: issue.relatedAbilities
					? dedupeRelatedAbilities(issue.relatedAbilities)
					: undefined,
			});
			continue;
		}

		existing.technicalDetails = [
			...new Set([
				...(existing.technicalDetails ?? []),
				...(issue.technicalDetails ?? []),
			]),
		];
		existing.relatedAbilities = dedupeRelatedAbilities([
			...(existing.relatedAbilities ?? []),
			...(issue.relatedAbilities ?? []),
		]);
	}

	return Array.from(merged.values()).map((issue) => ({
		...issue,
		technicalDetails:
			issue.technicalDetails && issue.technicalDetails.length > 0
				? issue.technicalDetails
				: undefined,
		relatedAbilities:
			issue.relatedAbilities && issue.relatedAbilities.length > 0
				? issue.relatedAbilities
				: undefined,
	}));
}

function dedupeRelatedAbilities(
	items: AdminRolesRoleIdPageRelatedAbility[],
): AdminRolesRoleIdPageRelatedAbility[] {
	const merged = new Map<string, AdminRolesRoleIdPageRelatedAbility>();

	for (const item of items) {
		const existing = merged.get(item.id);
		if (!existing) {
			merged.set(item.id, item);
			continue;
		}
		if (item.isPreferred) {
			merged.set(item.id, item);
		}
	}

	return Array.from(merged.values());
}

function pickPreferredCanonicalAbility(
	matches: AbilityResponseDto[],
): AbilityResponseDto | undefined {
	return [...matches].sort((left, right) =>
		right.createdAt.localeCompare(left.createdAt),
	)[0];
}

function isMenuSubjectName(subjectName?: string): subjectName is string {
	return subjectName?.startsWith(MENU_SUBJECT_PREFIX) ?? false;
}

function isPageSubjectName(subjectName?: string): subjectName is string {
	return subjectName?.startsWith(PAGE_SUBJECT_PREFIX) ?? false;
}

function isEntitySubjectName(subjectName?: string): subjectName is string {
	return subjectName?.startsWith(ENTITY_SUBJECT_PREFIX) ?? false;
}

function isCanonicalMenuAbility(ability: AbilityResponseDto): boolean {
	return (
		isMenuSubjectName(ability.subject?.name) &&
		ability.action?.name === MENU_ACTION_NAME
	);
}

function isCanonicalPageAbility(ability: AbilityResponseDto): boolean {
	return (
		isPageSubjectName(ability.subject?.name) &&
		ability.action?.name === PAGE_ACTION_NAME
	);
}

function isGlobalAccessAbility(ability: AbilityResponseDto): boolean {
	return (
		!ability.inverted &&
		ability.subject?.name === GLOBAL_SUBJECT_NAME &&
		ability.action?.name === GLOBAL_ACTION_NAME
	);
}

function hasGlobalAccessAbilitySelected(
	selectedAbilityIds: Set<string>,
	allAbilities: AbilityResponseDto[],
): boolean {
	return allAbilities.some(
		(ability) =>
			isGlobalAccessAbility(ability) && selectedAbilityIds.has(ability.id),
	);
}

function isCrudAbility(ability: AbilityResponseDto): boolean {
	return (
		!ability.inverted &&
		isEntitySubjectName(ability.subject?.name) &&
		Boolean(ability.action?.name) &&
		CRUD_ACTIONS.includes(
			ability.action!.name as AdminRolesRoleIdPageCrudActionKey,
		)
	);
}

function isAdvancedRoleDetailAbility(ability: AbilityResponseDto): boolean {
	return (
		!isMenuSubjectName(ability.subject?.name) &&
		!isPageSubjectName(ability.subject?.name) &&
		!isCrudAbility(ability)
	);
}

function hasAbilityConditions(ability: AbilityResponseDto): boolean {
	if (!ability.conditions || typeof ability.conditions !== "object") {
		return false;
	}

	return Object.keys(ability.conditions as Record<string, unknown>).length > 0;
}

function pickPreferredCrudAbility(
	matches: AbilityResponseDto[],
): AbilityResponseDto | undefined {
	return [...matches].sort((left, right) => {
		const leftHasConditions = hasAbilityConditions(left);
		const rightHasConditions = hasAbilityConditions(right);
		if (leftHasConditions !== rightHasConditions) {
			return Number(leftHasConditions) - Number(rightHasConditions);
		}
		return right.createdAt.localeCompare(left.createdAt);
	})[0];
}

function getCrudActionLabel(action: AdminRolesRoleIdPageCrudActionKey): string {
	switch (action) {
		case "create":
			return "생성";
		case "read":
			return "조회";
		case "update":
			return "수정";
		case "delete":
			return "삭제";
		case "manage":
			return "전체 관리";
		default:
			return action;
	}
}

function mapAbilityItem(
	ability: AbilityResponseDto,
): AdminRolesRoleIdPageAbility {
	return {
		id: ability.id,
		name: ability.name,
		description: ability.description ?? undefined,
		subjectId: ability.subjectId,
		actionId: ability.actionId,
		fields: ability.fields,
		conditions:
			ability.conditions && typeof ability.conditions === "object"
				? (ability.conditions as Record<string, unknown>)
				: undefined,
		inverted: ability.inverted,
		reason: ability.reason ?? undefined,
		subject: ability.subject
			? {
					id: ability.subjectId,
					name: ability.subject.name,
					displayName: ability.subject.displayName ?? undefined,
				}
			: undefined,
		action: ability.action
			? {
					id: ability.actionId,
					name: ability.action.name,
					displayName: ability.action.displayName ?? undefined,
				}
			: undefined,
	};
}

export default AdminRolesRoleDetailRoute;
