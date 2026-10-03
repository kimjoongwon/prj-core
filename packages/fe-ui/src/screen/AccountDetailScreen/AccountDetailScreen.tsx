"use client";

import {
	HStack,
	Screen,
	Section,
	SectionSurface,
	Separator,
	Typography,
	VStack,
} from "@cocrepo/ui";
import { ListBox } from "@heroui/react";
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
									<Typography color="muted">로딩 중...</Typography>
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
									<Typography.Paragraph color="muted">
										계정을 찾을 수 없습니다.
									</Typography.Paragraph>
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
												<dt className="mb-1">
													<Typography type="body-sm" color="muted">
														이름
													</Typography>
												</dt>
												<dd>
													<Typography weight="medium">
														{account.name}
													</Typography>
												</dd>
											</div>
											<div>
												<dt className="mb-1">
													<Typography type="body-sm" color="muted">
														이메일
													</Typography>
												</dt>
												<dd>
													<Typography weight="medium">
														{account.email}
													</Typography>
												</dd>
											</div>
											<div>
												<dt className="mb-1">
													<Typography type="body-sm" color="muted">
														활성 상태
													</Typography>
												</dt>
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
												<dt className="mb-1">
													<Typography type="body-sm" color="muted">
														잠금 상태
													</Typography>
												</dt>
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
															<Typography.Paragraph
																size="xs"
																color="muted"
																className="mt-1"
															>
																해제 예정: {account.lockedUntil}
															</Typography.Paragraph>
														)}
												</dd>
											</div>
											<div>
												<dt className="mb-1">
													<Typography type="body-sm" color="muted">
														로그인 실패 횟수
													</Typography>
												</dt>
												<dd>
													<HStack alignItems="center">
														<Typography.Code
															className={`text-lg ${account.failedLoginAttempts > 0 ? "text-warning" : "text-muted"}`}
														>
															{account.failedLoginAttempts}
														</Typography.Code>
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
												<dt className="mb-1">
													<Typography type="body-sm" color="muted">
														마지막 로그인 시간
													</Typography>
												</dt>
												<dd>
													{account.lastLoginAt ? (
														account.lastLoginAt
													) : (
														<Typography color="muted">-</Typography>
													)}
												</dd>
											</div>
											<div>
												<dt className="mb-1">
													<Typography type="body-sm" color="muted">
														마지막 로그인 IP
													</Typography>
												</dt>
												<dd>
													<Typography.Code>
														{account.lastLoginIp ?? "-"}
													</Typography.Code>
												</dd>
											</div>
											<div>
												<dt className="mb-1">
													<Typography type="body-sm" color="muted">
														가입일
													</Typography>
												</dt>
												<dd>
													<Typography>{account.createdAt}</Typography>
												</dd>
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
															<Typography.Paragraph weight="medium" truncate>
																{grant.spaceName}
															</Typography.Paragraph>
															<Typography.Paragraph
																size="xs"
																color="muted"
																truncate
															>
																{grant.spaceLabel ?? grant.spaceId}
															</Typography.Paragraph>
														</div>
														<div className="flex items-center">
															<Chip size="sm" variant="soft" color="accent">
																{grant.roleDisplayName ?? grant.roleName}
															</Chip>
														</div>
														<Typography.Paragraph size="sm" color="muted">
															{grant.grantedAt}
														</Typography.Paragraph>
													</div>
												))}
											</div>
										) : (
											<Typography.Paragraph
												size="sm"
												color="muted"
												className="py-3"
											>
												부여된 접근 권한이 없습니다.
											</Typography.Paragraph>
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
															<Typography>{option.label}</Typography>
															{option.description ? (
																<Typography type="body-xs" color="muted">
																	{option.description}
																</Typography>
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
															<Typography>{option.label}</Typography>
															{option.description ? (
																<Typography type="body-xs" color="muted">
																	{option.description}
																</Typography>
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
