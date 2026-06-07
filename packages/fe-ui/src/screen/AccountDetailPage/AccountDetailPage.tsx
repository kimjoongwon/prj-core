"use client";

import {
	ConfirmModal,
	DateTimeCell,
	DetailPage,
	DetailPageSurface,
	DetailSection,
	DetailSectionCard,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import {
	ArrowLeft,
	KeyRound,
	Lock,
	LockOpen,
	LogOut,
	RotateCcw,
	ShieldCheck,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Chip } from "../../data-display/Chip/Chip";
import { Separator, ListBox } from "@heroui/react";
import { Select } from "../../selection/Select/Select";
import { Switch } from "../../selection/Switch/Switch";

/** 모달 액션 타입 */
export type AccountDetailPageModalAction =
	| "unlock"
	| "forceResetPassword"
	| "invalidateSessions"
	| null;

export interface AccountDetailPageAccessGrant {
	tenantId: string;
	spaceId: string;
	spaceName: string;
	spaceLabel?: string | null;
	roleId: string;
	roleName: string;
	roleDisplayName?: string | null;
	grantedAt: string;
	updatedAt?: string | null;
}

export interface AccountDetailPageAccount {
	id: string;
	name: string;
	email: string;
	isActive: boolean;
	isPermanentlyLocked: boolean;
	lockedUntil?: string | null;
	failedLoginAttempts: number;
	mustChangePassword: boolean;
	lastLoginAt?: string | null;
	lastLoginIp?: string | null;
	createdAt: string | null;
	accessGrants: AccountDetailPageAccessGrant[];
}

export interface AccountDetailPageOption {
	value: string;
	label: string;
	description?: string;
}

export interface AccountDetailPageAccessGrantForm {
	spaceId: string;
	roleId: string;
}

export interface AccountDetailPageProps {
	account?: AccountDetailPageAccount;
	isLoading: boolean;
	accessGrantForm: AccountDetailPageAccessGrantForm;
	spaceOptions: AccountDetailPageOption[];
	roleOptions: AccountDetailPageOption[];
	isAccessGrantFormLoading: boolean;
	isGrantingAccess: boolean;
	isToggling: boolean;
	isResetting: boolean;
	isUnlocking: boolean;
	isForceResetting: boolean;
	isInvalidating: boolean;
	modalAction: AccountDetailPageModalAction;
	onClickBackButton: () => void;
	onClickToggleActiveButton: () => void;
	onClickResetFailedAttemptsButton: () => void;
	onChangeAccessGrantSpace: (spaceId: string) => void;
	onChangeAccessGrantRole: (roleId: string) => void;
	onClickGrantAccessButton: () => void;
	onClickOpenUnlockModal: () => void;
	onClickOpenForceResetPasswordModal: () => void;
	onClickOpenInvalidateSessionsModal: () => void;
	onCloseModal: () => void;
	onClickConfirmModal: () => void;
}

/**
 * IDP 계정 상세 pure screen입니다.
 */
export const AccountDetailPage = observer(
	({
		account,
		isLoading,
		accessGrantForm,
		spaceOptions,
		roleOptions,
		isAccessGrantFormLoading,
		isGrantingAccess,
		isToggling,
		isResetting,
		isUnlocking,
		isForceResetting,
		isInvalidating,
		modalAction,
		onClickBackButton,
		onClickToggleActiveButton,
		onClickResetFailedAttemptsButton,
		onChangeAccessGrantSpace,
		onChangeAccessGrantRole,
		onClickGrantAccessButton,
		onClickOpenUnlockModal,
		onClickOpenForceResetPasswordModal,
		onClickOpenInvalidateSessionsModal,
		onCloseModal,
		onClickConfirmModal,
	}: AccountDetailPageProps) => {
		// 잠금 상태 판단
		const isLocked = account
			? account.isPermanentlyLocked || !!account.lockedUntil
			: false;
		const isGrantButtonDisabled =
			!accessGrantForm.spaceId ||
			!accessGrantForm.roleId ||
			isAccessGrantFormLoading;
		const handleAccessGrantSpaceChange = (value: string | number | null) => {
			onChangeAccessGrantSpace(String(value ?? ""));
		};
		const handleAccessGrantRoleChange = (value: string | number | null) => {
			onChangeAccessGrantRole(String(value ?? ""));
		};

		// 모달 설정
		const modalConfig: Record<
			Exclude<AccountDetailPageModalAction, null>,
			{
				title: string;
				message: React.ReactNode;
				confirmText: string;
				confirmColor: "primary" | "danger" | "warning" | "success";
				iconType: "delete" | "warning" | "info" | "none";
				loading: boolean;
			}
		> = {
			unlock: {
				title: "잠금 해제",
				message: (
					<>
						<p>
							<strong>{account?.name}</strong> 계정의 잠금을 해제하시겠습니까?
						</p>
						<p className="text-sm text-muted mt-2">
							잠금이 해제되면 다시 로그인할 수 있습니다.
						</p>
					</>
				),
				confirmText: "잠금 해제",
				confirmColor: "primary",
				iconType: "warning",
				loading: isUnlocking,
			},
			forceResetPassword: {
				title: "비밀번호 강제 변경",
				message: (
					<>
						<p>
							<strong>{account?.name}</strong> 계정의 비밀번호를 강제로
							변경하시겠습니까?
						</p>
						<p className="text-sm text-danger mt-2">
							사용자는 다음 로그인 시 비밀번호를 변경해야 합니다.
						</p>
					</>
				),
				confirmText: "비밀번호 강제 변경",
				confirmColor: "warning",
				iconType: "warning",
				loading: isForceResetting,
			},
			invalidateSessions: {
				title: "세션 무효화",
				message: (
					<>
						<p>
							<strong>{account?.name}</strong> 계정의 모든 세션을
							무효화하시겠습니까?
						</p>
						<p className="text-sm text-danger mt-2">
							모든 기기에서 로그아웃되며, 다시 로그인해야 합니다.
						</p>
					</>
				),
				confirmText: "세션 무효화",
				confirmColor: "danger",
				iconType: "warning",
				loading: isInvalidating,
			},
		};

		const currentModalConfig = modalAction ? modalConfig[modalAction] : null;

		// 로딩 상태
		if (isLoading) {
			return (
				<DetailPage
					top={<PageTitleBar title="계정 상세" description="로딩 중..." />}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex items-center justify-center p-8">
								<span className="text-muted">로딩 중...</span>
							</div>
						</DetailSectionCard>
					</DetailPageSurface>
				</DetailPage>
			);
		}

		// 데이터 없음
		if (!account) {
			return (
				<DetailPage
					top={
						<PageTitleBar
							title="계정 상세"
							description="계정을 찾을 수 없습니다."
						/>
					}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-muted">계정을 찾을 수 없습니다.</p>
								<Button variant="flat" onPress={onClickBackButton}>
									목록으로
								</Button>
							</div>
						</DetailSectionCard>
					</DetailPageSurface>
				</DetailPage>
			);
		}

		return (
			<DetailPage
				top={
					<PageTitleBar
						title="계정 상세"
						description={`${account.name} (${account.email})`}
						actions={
							<Button
								variant="light"
								startContent={<ArrowLeft className="h-4 w-4" />}
								onPress={onClickBackButton}
							>
								목록으로
							</Button>
						}
					/>
				}
			>
				<DetailPageSurface>
					<VStack gap={4}>
						<DetailSectionCard>
							<DetailSection top={<PageTitleBar level={2} title="보안 정보" />}>
								<dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div>
										<dt className="text-sm text-muted mb-1">이름</dt>
										<dd className="font-medium">{account.name}</dd>
									</div>
									<div>
										<dt className="text-sm text-muted mb-1">이메일</dt>
										<dd className="font-medium">{account.email}</dd>
									</div>
									<div>
										<dt className="text-sm text-muted mb-1">활성 상태</dt>
										<dd>
											<div className="flex items-center gap-2">
												<Switch
													size="sm"
													isSelected={account.isActive}
													isDisabled={isToggling}
													onValueChange={onClickToggleActiveButton}
												/>
												<Chip
													size="sm"
													variant="flat"
													color={account.isActive ? "success" : "danger"}
												>
													{account.isActive ? "활성" : "비활성"}
												</Chip>
											</div>
										</dd>
									</div>
									<div>
										<dt className="text-sm text-muted mb-1">잠금 상태</dt>
										<dd>
											<div className="flex items-center gap-2">
												<Chip
													size="sm"
													variant="flat"
													color={isLocked ? "danger" : "success"}
													startContent={
														isLocked ? (
															<Lock className="h-3 w-3" />
														) : (
															<LockOpen className="h-3 w-3" />
														)
													}
												>
													{account.isPermanentlyLocked
														? "영구 잠금"
														: account.lockedUntil
															? "일시 잠금"
															: "정상"}
												</Chip>
												{isLocked && (
													<Button
														size="sm"
														variant="flat"
														color="primary"
														isLoading={isUnlocking}
														onPress={onClickOpenUnlockModal}
													>
														잠금 해제
													</Button>
												)}
											</div>
											{account.lockedUntil && !account.isPermanentlyLocked && (
												<p className="text-xs text-muted mt-1">
													해제 예정:{" "}
													<DateTimeCell value={account.lockedUntil} />
												</p>
											)}
										</dd>
									</div>
									<div>
										<dt className="text-sm text-muted mb-1">
											로그인 실패 횟수
										</dt>
										<dd>
											<div className="flex items-center gap-2">
												<span
													className={`font-mono text-lg ${account.failedLoginAttempts > 0 ? "text-warning" : "text-muted"}`}
												>
													{account.failedLoginAttempts}
												</span>
												{account.failedLoginAttempts > 0 && (
													<Button
														size="sm"
														variant="flat"
														startContent={<RotateCcw className="h-3 w-3" />}
														isLoading={isResetting}
														onPress={onClickResetFailedAttemptsButton}
													>
														초기화
													</Button>
												)}
											</div>
										</dd>
									</div>
									<div>
										<dt className="text-sm text-muted mb-1">
											비밀번호 변경 필요
										</dt>
										<dd>
											<Chip
												size="sm"
												variant="flat"
												color={
													account.mustChangePassword ? "warning" : "default"
												}
											>
												{account.mustChangePassword ? "변경 필요" : "불필요"}
											</Chip>
										</dd>
									</div>
									<div>
										<dt className="text-sm text-muted mb-1">
											마지막 로그인 시간
										</dt>
										<dd>
											{account.lastLoginAt ? (
												<DateTimeCell value={account.lastLoginAt} />
											) : (
												<span className="text-muted">-</span>
											)}
										</dd>
									</div>
									<div>
										<dt className="text-sm text-muted mb-1">
											마지막 로그인 IP
										</dt>
										<dd className="font-mono text-sm">
											{account.lastLoginIp ?? "-"}
										</dd>
									</div>
									<div>
										<dt className="text-sm text-muted mb-1">가입일</dt>
										<dd>
											<DateTimeCell value={account.createdAt} />
										</dd>
									</div>
								</dl>
							</DetailSection>
						</DetailSectionCard>
						<DetailSectionCard>
							<DetailSection top={<PageTitleBar level={2} title="관리 액션" />}>
								<Separator className="mb-4" />
								<div className="flex flex-wrap gap-3">
									<Button
										variant="flat"
										color="primary"
										startContent={<LockOpen className="h-4 w-4" />}
										isDisabled={!isLocked}
										onPress={onClickOpenUnlockModal}
									>
										잠금 해제
									</Button>
									<Button
										variant="flat"
										color="warning"
										startContent={<KeyRound className="h-4 w-4" />}
										onPress={onClickOpenForceResetPasswordModal}
									>
										비밀번호 강제 변경
									</Button>
									<Button
										variant="flat"
										color="danger"
										startContent={<LogOut className="h-4 w-4" />}
										onPress={onClickOpenInvalidateSessionsModal}
									>
										세션 무효화
									</Button>
								</div>
							</DetailSection>
						</DetailSectionCard>
						<DetailSectionCard>
							<DetailSection
								top={
									<PageTitleBar
										level={2}
										title="접근 권한"
										description="계정에 부여된 Space와 Role을 관리합니다."
									/>
								}
							>
								<Separator className="mb-4" />
								{account.accessGrants.length > 0 ? (
									<div className="divide-y divide-border">
										{account.accessGrants.map((grant) => (
											<div
												key={grant.tenantId}
												className="grid gap-3 py-3 md:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)_auto]"
											>
												<div className="min-w-0">
													<p className="truncate font-medium">
														{grant.spaceName}
													</p>
													<p className="truncate text-xs text-muted">
														{grant.spaceLabel ?? grant.spaceId}
													</p>
												</div>
												<div className="flex items-center">
													<Chip size="sm" variant="flat" color="primary">
														{grant.roleDisplayName ?? grant.roleName}
													</Chip>
												</div>
												<div className="text-sm text-muted">
													<DateTimeCell value={grant.grantedAt} />
												</div>
											</div>
										))}
									</div>
								) : (
									<p className="py-3 text-sm text-muted">
										부여된 접근 권한이 없습니다.
									</p>
								)}
								<Separator className="my-4" />
								<div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
										<Select
											label="Space"
											labelPlacement="outside"
											placeholder="Space 선택"
											value={accessGrantForm.spaceId || null}
											isDisabled={
												isAccessGrantFormLoading || spaceOptions.length === 0
											}
											onChange={handleAccessGrantSpaceChange}
										>
											{spaceOptions.map((option) => (
												<ListBox.Item
													key={option.value}
													id={option.value}
													textValue={option.label}
												>
													<div className="flex flex-col">
														<span>{option.label}</span>
													{option.description ? (
														<span className="text-xs text-muted">
															{option.description}
														</span>
													) : null}
												</div>
											</ListBox.Item>
										))}
									</Select>
										<Select
											label="Role"
											labelPlacement="outside"
											placeholder="Role 선택"
											value={accessGrantForm.roleId || null}
											isDisabled={
												isAccessGrantFormLoading || roleOptions.length === 0
											}
											onChange={handleAccessGrantRoleChange}
										>
											{roleOptions.map((option) => (
												<ListBox.Item
													key={option.value}
													id={option.value}
													textValue={option.label}
												>
													<div className="flex flex-col">
													<span>{option.label}</span>
													{option.description ? (
														<span className="text-xs text-muted">
															{option.description}
														</span>
													) : null}
												</div>
											</ListBox.Item>
										))}
									</Select>
									<Button
										variant="flat"
										color="primary"
										startContent={<ShieldCheck className="h-4 w-4" />}
										isLoading={isGrantingAccess}
										isDisabled={isGrantButtonDisabled}
										onPress={onClickGrantAccessButton}
									>
										권한 부여
									</Button>
								</div>
							</DetailSection>
						</DetailSectionCard>
					</VStack>
				</DetailPageSurface>
				{currentModalConfig && (
					<ConfirmModal
						isOpen={modalAction !== null}
						onClose={onCloseModal}
						onConfirm={onClickConfirmModal}
						title={currentModalConfig.title}
						message={currentModalConfig.message}
						confirmText={currentModalConfig.confirmText}
						confirmColor={currentModalConfig.confirmColor}
						iconType={currentModalConfig.iconType}
						loading={currentModalConfig.loading}
					/>
				)}
			</DetailPage>
		);
	},
);
