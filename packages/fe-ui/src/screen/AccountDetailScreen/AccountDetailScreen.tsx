"use client";

import { HStack, Screen, Section, SectionSurface, VStack } from "@cocrepo/ui";
import { ListBox, Separator } from "@heroui/react";
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
import { Chip } from "../../data-display/Chip/Chip";
import { Button } from "../../input/Button/Button";
import { Select } from "../../input/Select/Select";
import { Switch } from "../../input/Switch/Switch";
export interface AccountDetailScreenAccessGrant {
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

export interface AccountDetailScreenAccount {
	id: string;
	name: string;
	email: string;
	isActive: boolean;
	failedLoginAttempts: number;
	isPermanentlyLocked: boolean;
	lockedUntil?: string | null;
	lastLoginAt?: string | null;
	lastLoginIp?: string | null;
	createdAt: string;
	accessGrants: AccountDetailScreenAccessGrant[];
}

export interface AccountDetailScreenOption {
	value: string;
	label: string;
	description?: string;
}

export interface AccountDetailScreenAccessGrantForm {
	spaceId: string;
	roleId: string;
}
export interface AccountDetailScreenProps {
	account?: AccountDetailScreenAccount;
	isLoading: boolean;
	accessGrantForm: AccountDetailScreenAccessGrantForm;
	spaceOptions: AccountDetailScreenOption[];
	roleOptions: AccountDetailScreenOption[];
	isAccessGrantFormLoading: boolean;
	isGrantingAccess: boolean;
	isToggling: boolean;
	isResetting: boolean;
	isUnlocking: boolean;
	isForceResetting: boolean;
	isInvalidating: boolean;
	onClickBackButton: () => void;
	onClickToggleActiveButton: () => void;
	onClickResetFailedAttemptsButton: () => void;
	onChangeAccessGrantSpace: (spaceId: string) => void;
	onChangeAccessGrantRole: (roleId: string) => void;
	onClickGrantAccessButton: () => void;
	onClickUnlockAccountButton: () => void;
	onClickForceResetPasswordButton: () => void;
	onClickInvalidateSessionsButton: () => void;
}

/**
 * IDP 계정 상세 pure screen입니다.
 */
export const AccountDetailScreen = observer(
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
		onClickBackButton,
		onClickToggleActiveButton,
		onClickResetFailedAttemptsButton,
		onChangeAccessGrantSpace,
		onChangeAccessGrantRole,
		onClickGrantAccessButton,
		onClickUnlockAccountButton,
		onClickForceResetPasswordButton,
		onClickInvalidateSessionsButton,
	}: AccountDetailScreenProps) => {
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

		// 로딩 상태
		if (isLoading) {
			return (
				<VStack fullWidth>
					<Screen.Header title="계정 상세" description="로딩 중..." />
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex items-center justify-center p-8">
									<span className="text-muted">로딩 중...</span>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}

		// 데이터 없음
		if (!account) {
			return (
				<VStack fullWidth>
					<Screen.Header
						title="계정 상세"
						description="계정을 찾을 수 없습니다."
					/>
					<SectionSurface>
						<Section>
							<Section.Body>
								<VStack
									gap="section"
									alignItems="center"
									justifyContent="center"
									className="p-8"
								>
									<p className="text-muted">계정을 찾을 수 없습니다.</p>
									<Button variant="tertiary" onPress={onClickBackButton}>
										목록으로
									</Button>
								</VStack>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		return (
			<VStack fullWidth>
				<Screen.Header
					title="계정 상세"
					description={`${account.name} (${account.email})`}
					actions={
						<Button
							variant="ghost"
							startContent={<ArrowLeft className="h-4 w-4" />}
							onPress={onClickBackButton}
						>
							목록으로
						</Button>
					}
				/>
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack>
								<Section>
									<Section.Header title="보안 정보" />
									<Section.Body>
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
													<HStack alignItems="center">
														<Switch
															size="sm"
															isSelected={account.isActive}
															isDisabled={isToggling}
															onValueChange={onClickToggleActiveButton}
														/>
														<Chip
															size="sm"
															variant="soft"
															color={account.isActive ? "success" : "danger"}
														>
															{account.isActive ? "활성" : "비활성"}
														</Chip>
													</HStack>
												</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">잠금 상태</dt>
												<dd>
													<HStack alignItems="center">
														<Chip
															size="sm"
															variant="soft"
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
																variant="tertiary"
																isLoading={isUnlocking}
																onPress={onClickUnlockAccountButton}
															>
																잠금 해제
															</Button>
														)}
													</HStack>
													{account.lockedUntil &&
														!account.isPermanentlyLocked && (
															<p className="text-xs text-muted mt-1">
																해제 예정: {account.lockedUntil}
															</p>
														)}
												</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">
													로그인 실패 횟수
												</dt>
												<dd>
													<HStack alignItems="center">
														<span
															className={`font-mono text-lg ${account.failedLoginAttempts > 0 ? "text-warning" : "text-muted"}`}
														>
															{account.failedLoginAttempts}
														</span>
														{account.failedLoginAttempts > 0 && (
															<Button
																size="sm"
																variant="tertiary"
																startContent={<RotateCcw className="h-3 w-3" />}
																isLoading={isResetting}
																onPress={onClickResetFailedAttemptsButton}
															>
																초기화
															</Button>
														)}
													</HStack>
												</dd>
											</div>
											<div>
												<dt className="text-sm text-muted mb-1">
													마지막 로그인 시간
												</dt>
												<dd>
													{account.lastLoginAt ? (
														account.lastLoginAt
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
												<dd>{account.createdAt}</dd>
											</div>
										</dl>
									</Section.Body>
								</Section>
								<Section>
									<Section.Header title="관리 액션" />
									<Section.Body>
										<Separator className="mb-4" />
										<HStack gap="block" className="flex-wrap">
											<Button
												variant="tertiary"
												startContent={<LockOpen className="h-4 w-4" />}
												isDisabled={!isLocked || isUnlocking}
												isLoading={isUnlocking}
												onPress={onClickUnlockAccountButton}
											>
												잠금 해제
											</Button>
											<Button
												variant="tertiary"
												startContent={<KeyRound className="h-4 w-4" />}
												isLoading={isForceResetting}
												onPress={onClickForceResetPasswordButton}
											>
												비밀번호 강제 변경
											</Button>
											<Button
												variant="tertiary"
												startContent={<LogOut className="h-4 w-4" />}
												isLoading={isInvalidating}
												onPress={onClickInvalidateSessionsButton}
											>
												세션 무효화
											</Button>
										</HStack>
									</Section.Body>
								</Section>
								<Section>
									<Section.Header
										title="접근 권한"
										description="계정에 부여된 Space와 Role을 관리합니다."
									/>
									<Section.Body>
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
															<Chip size="sm" variant="soft" color="accent">
																{grant.roleDisplayName ?? grant.roleName}
															</Chip>
														</div>
														<div className="text-sm text-muted">
															{grant.grantedAt}
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
												variant="tertiary"
												startContent={<ShieldCheck className="h-4 w-4" />}
												isLoading={isGrantingAccess}
												isDisabled={isGrantButtonDisabled}
												onPress={onClickGrantAccessButton}
											>
												권한 부여
											</Button>
										</div>
									</Section.Body>
								</Section>
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
