"use client";

import {
	Autocomplete,
	AutocompleteItem,
	Avatar,
	Button,
	Card,
	CardBody,
	Chip,
} from "@heroui/react";
import { Plus, Search, User } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Text } from "../../../primitive/data-display/Text/Text";
import { HStack } from "../../../layout/HStack/HStack";
import { VStack } from "../../../layout/VStack/VStack";
import { AbilityFormModal } from "../../../widget/ability/AbilityFormModal";
import { AbilityRuleList } from "../../../widget/ability/AbilityRuleList";
import type { UserAbilityManagerProps } from "./type";
import { useUserAbilityManager } from "./useUserAbilityManager";

/**
 * UserAbilityManager Feature 컴포넌트
 *
 * User별 예외 권한을 관리하는 Feature 컴포넌트입니다.
 * - 사용자 검색 (Autocomplete + debounce)
 * - 예외 권한 목록 표시 (AbilityRuleList 위젯 사용)
 * - 예외 권한 추가/수정/삭제 (AbilityFormModal 위젯 사용)
 *
 * Role 기반 권한을 덮어쓰는 예외 권한을 관리합니다.
 *
 * **컴포넌트 계층:**
 * - Widget: AbilityRuleList, AbilityFormModal (순수 UI)
 * - Feature: UserAbilityManager (비즈니스 로직, 데이터 연결)
 *
 * @example
 * ```tsx
 * <UserAbilityManager
 *   onSearchUsers={searchUsers}
 *   onLoadAbilities={loadUserAbilities}
 *   onAddAbility={addUserAbility}
 *   onUpdateAbility={updateUserAbility}
 *   onDeleteAbility={deleteUserAbility}
 *   onToggleActive={toggleUserAbilityActive}
 *   subjects={subjects}
 *   actions={actions}
 * />
 * ```
 */
export const UserAbilityManager = observer(
	({
		onSearchUsers,
		selectedUser: externalSelectedUser,
		onUserSelect,
		onLoadAbilities,
		onAddAbility,
		onUpdateAbility,
		onDeleteAbility,
		onToggleActive,
		subjects,
		actions,
		onLoadSubjectFields,
	}: UserAbilityManagerProps) => {
		const {
			// 검색 상태
			searchQuery,
			searchResults,
			isSearching,
			handleSearchQueryChange,
			// 사용자 상태
			selectedUser,
			handleUserSelect,
			// 상태
			state,
			// Subject 필드 로드
			loadSubjectFields,
			// 모달 핸들러
			handleOpenAddModal,
			handleOpenEditModal,
			handleCloseModal,
			// CRUD 핸들러
			handleSaveAbility,
			handleDeleteAbility,
			handleToggleActive,
		} = useUserAbilityManager({
			selectedUser: externalSelectedUser,
			onUserSelect,
			onSearchUsers,
			onLoadAbilities,
			onAddAbility,
			onUpdateAbility,
			onDeleteAbility,
			onToggleActive,
			onLoadSubjectFields,
		});

		return (
			<Card className="w-full">
				<CardBody>
					<VStack gap={6} fullWidth>
						{/* 헤더 */}
						<HStack alignItems="center" justifyContent="between" fullWidth>
							<Text variant="title">사용자 예외 권한 관리</Text>
						</HStack>

						{/* 사용자 검색 영역 */}
						<Autocomplete
							label="사용자 검색"
							placeholder="이름 또는 이메일로 검색..."
							startContent={<Search className="h-4 w-4 text-default-400" />}
							inputValue={searchQuery}
							onInputChange={handleSearchQueryChange}
							isLoading={isSearching}
							items={searchResults}
							onSelectionChange={(key) => {
								if (key) {
									const user = searchResults.find((u) => u.id === key);
									if (user) {
										handleUserSelect(user);
									}
								}
							}}
							classNames={{
								base: "w-full",
							}}
						>
							{(user) => (
								<AutocompleteItem key={user.id} textValue={user.name}>
									<HStack alignItems="center" gap={8}>
										<Avatar
											size="sm"
											name={user.name}
											className="flex-shrink-0"
										/>
										<VStack gap={0}>
											<span className="text-sm font-medium">{user.name}</span>
											<span className="text-xs text-default-500">
												{user.email}
											</span>
										</VStack>
										{user.roleDisplayName && (
											<Chip size="sm" variant="flat" className="ml-auto">
												{user.roleDisplayName}
											</Chip>
										)}
									</HStack>
								</AutocompleteItem>
							)}
						</Autocomplete>

						{/* 선택된 사용자 정보 및 권한 목록 */}
						{selectedUser ? (
							<VStack gap={4} fullWidth>
								{/* 선택된 사용자 정보 */}
								<HStack alignItems="center" justifyContent="between" fullWidth>
									<HStack alignItems="center" gap={12}>
										<Avatar
											size="md"
											name={selectedUser.name}
											icon={<User className="h-5 w-5" />}
										/>
										<VStack gap={0}>
											<HStack alignItems="center" gap={8}>
												<span className="text-base font-semibold">
													{selectedUser.name}
												</span>
												{selectedUser.roleDisplayName && (
													<Chip size="sm" variant="flat" color="primary">
														{selectedUser.roleDisplayName}
													</Chip>
												)}
											</HStack>
											<span className="text-sm text-default-500">
												{selectedUser.email}
											</span>
										</VStack>
									</HStack>

									<Button
										color="primary"
										startContent={<Plus className="h-4 w-4" />}
										onPress={handleOpenAddModal}
									>
										예외 추가
									</Button>
								</HStack>

								{/* 구분선 */}
								<div className="h-px w-full bg-divider" />

								{/* 에러 메시지 */}
								{state.error && (
									<Text className="text-danger">{state.error}</Text>
								)}

								{/* 예외 권한 목록 */}
								<VStack gap={2} fullWidth>
									<span className="text-sm font-medium text-default-600">
										예외 권한 목록 (Role 기본 권한을 덮어씀)
									</span>
									<AbilityRuleList
										rules={state.abilities}
										loading={state.isLoading}
										onEditRule={handleOpenEditModal}
										onDeleteRule={handleDeleteAbility}
										onToggleActive={handleToggleActive}
									/>
								</VStack>
							</VStack>
						) : (
							/* 사용자 미선택 안내 */
							<VStack
								alignItems="center"
								justifyContent="center"
								gap={4}
								className="py-12"
							>
								<User className="h-12 w-12 text-default-300" />
								<Text className="text-default-500">
									사용자를 검색하여 선택해주세요
								</Text>
							</VStack>
						)}
					</VStack>
				</CardBody>

				{/* Ability 추가/수정 모달 */}
				<AbilityFormModal
					isOpen={state.isModalOpen}
					onClose={handleCloseModal}
					onSubmit={handleSaveAbility}
					initialData={state.editingAbility}
					subjects={subjects}
					actions={actions}
					subjectFields={state.subjectFields}
					loading={state.isSaving}
					mode={state.formMode === "add" ? "create" : "edit"}
				/>
			</Card>
		);
	},
);

UserAbilityManager.displayName = "UserAbilityManager";
