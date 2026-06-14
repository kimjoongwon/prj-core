"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Select } from "../../../selection/Select/Select";
import { Card } from "@heroui/react";
import { Typography } from "../../../data-display/Typography";
import { AbilityFormModal } from "../../../form/AbilityFormModal";
import { AbilityRuleList } from "../../../widget/ability/AbilityRuleList";
import type { RoleAbilityManagerProps } from "./type";
import { useRoleAbilityManager } from "./useRoleAbilityManager";

/**
 * RoleAbilityManager Feature 컴포넌트
 *
 * Role별 ABAC 권한을 관리하는 Feature 컴포넌트입니다.
 * Role 선택, Ability 목록 표시, 추가/수정/삭제 기능을 제공합니다.
 *
 * **컴포넌트 계층:**
 * - Widget: AbilityRuleList, AbilityFormModal (순수 UI)
 * - Feature: RoleAbilityManager (비즈니스 로직, 데이터 연결)
 *
 * @example
 * ```tsx
 * <RoleAbilityManager
 *   roles={roles}
 *   selectedRoleId={selectedRoleId}
 *   onRoleChange={handleRoleChange}
 *   onLoadAbilities={loadAbilitiesByRoleId}
 *   onAddAbility={addAbility}
 *   onUpdateAbility={updateAbility}
 *   onDeleteAbility={deleteAbility}
 *   onToggleActive={toggleAbilityActive}
 *   subjects={subjects}
 *   actions={actions}
 * />
 * ```
 */
export const RoleAbilityManager = observer(
	({
		roles,
		selectedRoleId,
		onRoleChange,
		onLoadAbilities,
		onAddAbility,
		onUpdateAbility,
		onDeleteAbility,
		onToggleActive,
		subjects,
		actions,
		onLoadSubjectFields,
	}: RoleAbilityManagerProps) => {
		const {
			state,
			loadAbilities,
			handleSubmitAbility,
			handleDeleteAbility,
			handleToggleActive,
			handleOpenAddModal,
			handleOpenEditModal,
			handleCloseModal,
		} = useRoleAbilityManager({
			selectedRoleId,
			onLoadAbilities,
			onAddAbility,
			onUpdateAbility,
			onDeleteAbility,
			onToggleActive,
			onLoadSubjectFields,
			subjects,
		});

		/**
		 * 선택된 Role 변경 시 Ability 목록 로드
		 */
		useEffect(() => {
			if (selectedRoleId) {
				loadAbilities(selectedRoleId);
			}
		}, [selectedRoleId]);

		/**
		 * Role 변경 핸들러
		 */
		const handleRoleChange = (roleId: string) => {
			onRoleChange?.(roleId);
		};

		// Role 선택 옵션 변환
		const roleOptions = roles.map((role) => ({
			value: role.id,
			text: role.displayName ?? role.name,
		}));

		return (
			<Card className="w-full">
				<Card.Header>
					<div


					 className="flex items-center justify-between w-full"
					>
						<Typography type="h4" weight="normal">
							Role 권한 관리 (ABAC)
						</Typography>
					</div>
				</Card.Header>
				<Card.Content>
					<div className="flex flex-col gap-4">
						{/* Role 선택 영역 */}
						<div className="flex gap-4 items-end">
								<Select
									label="역할 선택"
									placeholder="역할을 선택하세요"
									options={roleOptions}
									value={selectedRoleId ?? ""}
									onChange={(value) => handleRoleChange(String(value ?? ""))}
									className="w-64"
								/>
						</div>

						{/* 에러 메시지 */}
						{state.error && (
							<Typography type="body-sm" className="text-danger font-medium">
								{state.error}
							</Typography>
						)}

						{/* Ability 목록 */}
						{selectedRoleId ? (
							<AbilityRuleList
								rules={state.abilities}
								loading={state.isLoading}
								onAddRule={handleOpenAddModal}
								onEditRule={handleOpenEditModal}
								onDeleteRule={handleDeleteAbility}
								onToggleActive={handleToggleActive}
							/>
						) : (
							<Typography.Paragraph color="muted">
								역할을 선택하면 권한 목록이 표시됩니다.
							</Typography.Paragraph>
						)}
					</div>
				</Card.Content>

				{/* Ability 추가/수정 모달 */}
				<AbilityFormModal
					isOpen={state.isModalOpen}
					onClose={handleCloseModal}
					onSubmit={handleSubmitAbility}
					initialData={state.editingInitialData}
					subjects={subjects}
					actions={actions}
					subjectFields={state.subjectFields}
					loading={state.isSaving}
					mode={state.modalMode}
				/>
			</Card>
		);
	},
);

RoleAbilityManager.displayName = "RoleAbilityManager";
