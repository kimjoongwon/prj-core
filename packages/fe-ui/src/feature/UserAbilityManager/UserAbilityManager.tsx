"use client";

import { Avatar, Card, ListBox } from "@heroui/react";
import { Plus, Search, User } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Chip } from "../../data-display/Chip/Chip";
import { Typography } from "../../data-display/Typography";
import { AbilityFormModal } from "../../form/AbilityFormModal";
import { Input } from "../../input/Input/Input";
import { AbilityRuleList } from "../../widget/AbilityRuleList";
import type { AbilityUser, UserAbilityManagerProps } from "./type";
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
				<Card.Content>
					<div>
						{/* 헤더 */}
						<div className="flex">
							<Typography type="h4" weight="normal">
								사용자 예외 권한 관리
							</Typography>
						</div>

						{/* 사용자 검색 영역 */}
						<div className="flex flex-col">
							<Input
								label="사용자 검색"
								placeholder="이름 또는 이메일로 검색..."
								startContent={
									<Search className="flex flex-col w-full gap-6 items-center justify-between h-4 w-4 text-muted" />
								}
								value={searchQuery}
								onValueChange={handleSearchQueryChange}
								isDisabled={isSearching}
								className="w-full"
							/>
							{searchResults.length > 0 ? (
								<ListBox<AbilityUser>
									aria-label="사용자 검색 결과"
									items={searchResults}
									selectionMode="single"
									selectedKeys={
										selectedUser ? new Set([selectedUser.id]) : new Set()
									}
									onSelectionChange={(keys) => {
										const key = Array.from(keys)[0];
										if (key) {
											const user = searchResults.find(
												(item) => item.id === key,
											);
											if (user) {
												handleUserSelect(user);
											}
										}
									}}
									className="w-full"
								>
									{(user: AbilityUser) => (
										<ListBox.Item
											key={user.id}
											id={user.id}
											textValue={user.name}
										>
											<div className="flex">
												<Avatar size="sm" className="flex-shrink-0">
													<Avatar.Fallback>
														{user.name.slice(0, 1)}
													</Avatar.Fallback>
												</Avatar>
												<div className="flex flex-col">
													<span className="text-sm font-medium">
														{user.name}
													</span>
													<span className="text-xs text-muted">
														{user.email}
													</span>
												</div>
												{user.roleDisplayName && (
													<Chip size="sm" variant="flat" className="ml-auto">
														{user.roleDisplayName}
													</Chip>
												)}
											</div>
										</ListBox.Item>
									)}
								</ListBox>
							) : null}
						</div>

						{/* 선택된 사용자 정보 및 권한 목록 */}
						{selectedUser ? (
							<div className="flex flex-col">
								{/* 선택된 사용자 정보 */}
								<div className="flex">
									<div className="flex">
										<Avatar size="md">
											<Avatar.Fallback>
												<User className="h-5 w-5" />
											</Avatar.Fallback>
										</Avatar>
										<div className="flex flex-col">
											<div className="flex">
												<span className="text-base font-semibold">
													{selectedUser.name}
												</span>
												{selectedUser.roleDisplayName && (
													<Chip size="sm" variant="flat" color="primary">
														{selectedUser.roleDisplayName}
													</Chip>
												)}
											</div>
											<span className="text-sm text-muted">
												{selectedUser.email}
											</span>
										</div>
									</div>

									<Button
										color="primary"
										startContent={<Plus className="h-4 w-4" />}
										onPress={handleOpenAddModal}
									>
										예외 추가
									</Button>
								</div>

								{/* 구분선 */}
								<div className="h-px w-full bg-border" />

								{/* 에러 메시지 */}
								{state.error && (
									<Typography
										type="body-sm"
										className="text-danger font-medium"
									>
										{state.error}
									</Typography>
								)}

								{/* 예외 권한 목록 */}
								<div className="flex flex-col">
									<span className="text-sm font-medium text-muted">
										예외 권한 목록 (Role 기본 권한을 덮어씀)
									</span>
									<AbilityRuleList
										rules={state.abilities}
										loading={state.isLoading}
										onEditRule={handleOpenEditModal}
										onDeleteRule={handleDeleteAbility}
										onToggleActive={handleToggleActive}
									/>
								</div>
							</div>
						) : (
							/* 사용자 미선택 안내 */
							<div className="flex flex-col gap-4 items-center justify-center py-12">
								<User className="h-12 w-12 text-muted" />
								<Typography.Paragraph color="muted">
									사용자를 검색하여 선택해주세요
								</Typography.Paragraph>
							</div>
						)}
					</div>
				</Card.Content>

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
