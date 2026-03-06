"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Select } from "../../../input/Select/Select";
import { Text } from "../../../primitive/data-display/Text/Text";
import { HStack } from "../../../layout/HStack/HStack";
import { VStack } from "../../../layout/VStack/VStack";
import { AbilityFormModal } from "../../../widget/ability/AbilityFormModal";
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
			loadSubjectFields,
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

		/**
		 * Subject 변경 시 필드 로드 (모달에서 Subject 선택 시)
		 */
		const handleSubjectFieldsLoad = async (
			subjectName: string,
		): Promise<string[]> => {
			if (!onLoadSubjectFields) return [];

			try {
				return await onLoadSubjectFields(subjectName);
			} catch {
				return [];
			}
		};

		// Role 선택 옵션 변환
		const roleOptions = roles.map((role) => ({
			value: role.id,
			text: role.displayName ?? role.name,
		}));

		return (
			<Card className="w-full">
				<CardHeader>
					<HStack
						justifyContent="between"
						alignItems="center"
						className="w-full"
					>
						<Text variant="title">Role 권한 관리 (ABAC)</Text>
					</HStack>
				</CardHeader>
				<CardBody>
					<VStack gap={4}>
						{/* Role 선택 영역 */}
						<HStack alignItems="end" gap={4}>
							<Select
								label="역할 선택"
								placeholder="역할을 선택하세요"
								options={roleOptions}
								value={selectedRoleId ?? ""}
								onChange={handleRoleChange}
								className="w-64"
							/>
						</HStack>

						{/* 에러 메시지 */}
						{state.error && <Text className="text-danger">{state.error}</Text>}

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
							<Text className="text-default-500">
								역할을 선택하면 권한 목록이 표시됩니다.
							</Text>
						)}
					</VStack>
				</CardBody>

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
