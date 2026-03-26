"use client";

import { useParams } from "next/navigation";
import {
	useForceResetPassword,
	useInvalidateUserSessions,
	useUnlockAccount,
} from "@cocrepo/api/idp/auth";
import {
	getGetIdpAccountQueryKey,
	useGetIdpAccount,
	useResetIdpAccountFailedAttempts,
	useToggleIdpAccountActive,
} from "@cocrepo/api/idp/idp-accounts";
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
import { Button, Chip, Divider, Switch } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import {
	ArrowLeft,
	KeyRound,
	Lock,
	LockOpen,
	LogOut,
	RotateCcw,
} from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

type AccountDetailPageParams = {
	userId: string;
};

function AccountDetailPage() {
	const { userId } = useParams<AccountDetailPageParams>();

	return <AccountDetailPageClient userId={userId} />;
}

/** 모달 액션 타입 */
type ModalAction =
	| "unlock"
	| "forceResetPassword"
	| "invalidateSessions"
	| null;

interface AccountDetailPageClientProps {
	userId: string;
}

/**
 * IDP 계정 상세 페이지 - 클라이언트 컴포넌트
 */
function AccountDetailPageClient({ userId }: AccountDetailPageClientProps) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const state = useLocalObservable(() => ({
		modalAction: null as ModalAction,
		get isModalOpen() {
			return this.modalAction !== null;
		},
	}));

	// 계정 상세 조회 (prefetch로 초기 데이터 보장)
	const { data: response, isLoading } = useGetIdpAccount(userId);
	const account = response?.data;

	// Mutation 훅
	const { mutate: toggleActive, isPending: isToggling } =
		useToggleIdpAccountActive({
			mutation: {
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: getGetIdpAccountQueryKey(userId),
					});
				},
			},
		});

	const { mutate: resetFailedAttempts, isPending: isResetting } =
		useResetIdpAccountFailedAttempts({
			mutation: {
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: getGetIdpAccountQueryKey(userId),
					});
				},
			},
		});

	const { mutate: unlockAccount, isPending: isUnlocking } = useUnlockAccount({
		mutation: {
			onSuccess: () => {
				state.modalAction = null;
				queryClient.invalidateQueries({
					queryKey: getGetIdpAccountQueryKey(userId),
				});
			},
		},
	});

	const { mutate: forceResetPassword, isPending: isForceResetting } =
		useForceResetPassword({
			mutation: {
				onSuccess: () => {
					state.modalAction = null;
					queryClient.invalidateQueries({
						queryKey: getGetIdpAccountQueryKey(userId),
					});
				},
			},
		});

	const { mutate: invalidateSessions, isPending: isInvalidating } =
		useInvalidateUserSessions({
			mutation: {
				onSuccess: () => {
					state.modalAction = null;
					queryClient.invalidateQueries({
						queryKey: getGetIdpAccountQueryKey(userId),
					});
				},
			},
		});

	// 이벤트 핸들러
	const onClickBackButton = () => {
		router.push("/accounts" as Route);
	};

	const onClickToggleActive = () => {
		toggleActive({ userId });
	};

	const onClickResetFailedAttempts = () => {
		resetFailedAttempts({ userId });
	};

	const onClickOpenUnlockModal = () => {
		state.modalAction = "unlock";
	};

	const onClickOpenForceResetPasswordModal = () => {
		state.modalAction = "forceResetPassword";
	};

	const onClickOpenInvalidateSessionsModal = () => {
		state.modalAction = "invalidateSessions";
	};

	const onCloseModal = () => {
		state.modalAction = null;
	};

	const onClickConfirmModal = () => {
		switch (state.modalAction) {
			case "unlock":
				unlockAccount({ userId });
				break;
			case "forceResetPassword":
				forceResetPassword({ userId });
				break;
			case "invalidateSessions":
				invalidateSessions({ userId });
				break;
		}
	};

	// 잠금 상태 판단
	const isLocked = account
		? account.isPermanentlyLocked || !!account.lockedUntil
		: false;

	// 모달 설정
	const modalConfig: Record<
		Exclude<ModalAction, null>,
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
					<p className="text-sm text-default-400 mt-2">
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

	const currentModalConfig = state.modalAction
		? modalConfig[state.modalAction]
		: null;

	// 로딩 상태
	if (isLoading) {
		return (
			<DetailPage
				top={<PageTitleBar title="계정 상세" description="로딩 중..." />}
			>
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
							<p className="text-default-500">계정을 찾을 수 없습니다.</p>
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
									<dt className="text-sm text-default-500 mb-1">이름</dt>
									<dd className="font-medium">{account.name}</dd>
								</div>
								<div>
									<dt className="text-sm text-default-500 mb-1">이메일</dt>
									<dd className="font-medium">{account.email}</dd>
								</div>
								<div>
									<dt className="text-sm text-default-500 mb-1">활성 상태</dt>
									<dd>
										<div className="flex items-center gap-2">
											<Switch
												size="sm"
												isSelected={account.isActive}
												isDisabled={isToggling}
												onValueChange={onClickToggleActive}
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
									<dt className="text-sm text-default-500 mb-1">잠금 상태</dt>
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
											<p className="text-xs text-default-400 mt-1">
												해제 예정: <DateTimeCell value={account.lockedUntil} />
											</p>
										)}
									</dd>
								</div>
								<div>
									<dt className="text-sm text-default-500 mb-1">
										로그인 실패 횟수
									</dt>
									<dd>
										<div className="flex items-center gap-2">
											<span
												className={`font-mono text-lg ${account.failedLoginAttempts > 0 ? "text-warning" : "text-default-600"}`}
											>
												{account.failedLoginAttempts}
											</span>
											{account.failedLoginAttempts > 0 && (
												<Button
													size="sm"
													variant="flat"
													startContent={<RotateCcw className="h-3 w-3" />}
													isLoading={isResetting}
													onPress={onClickResetFailedAttempts}
												>
													초기화
												</Button>
											)}
										</div>
									</dd>
								</div>
								<div>
									<dt className="text-sm text-default-500 mb-1">
										비밀번호 변경 필요
									</dt>
									<dd>
										<Chip
											size="sm"
											variant="flat"
											color={account.mustChangePassword ? "warning" : "default"}
										>
											{account.mustChangePassword ? "변경 필요" : "불필요"}
										</Chip>
									</dd>
								</div>
								<div>
									<dt className="text-sm text-default-500 mb-1">
										마지막 로그인 시간
									</dt>
									<dd>
										{account.lastLoginAt ? (
											<DateTimeCell value={account.lastLoginAt} />
										) : (
											<span className="text-default-400">-</span>
										)}
									</dd>
								</div>
								<div>
									<dt className="text-sm text-default-500 mb-1">
										마지막 로그인 IP
									</dt>
									<dd className="font-mono text-sm">
										{account.lastLoginIp ?? "-"}
									</dd>
								</div>
								<div>
									<dt className="text-sm text-default-500 mb-1">가입일</dt>
									<dd>
										<DateTimeCell value={account.createdAt} />
									</dd>
								</div>
							</dl>
						</DetailSection>
					</DetailSectionCard>
					<DetailSectionCard>
						<DetailSection top={<PageTitleBar level={2} title="관리 액션" />}>
							<Divider className="mb-4" />
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
				</VStack>
			</DetailPageSurface>
			{currentModalConfig && (
				<ConfirmModal
					isOpen={state.isModalOpen}
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
}

export const IdpConsoleAccountsUserIdPage = observer(AccountDetailPage);

export default IdpConsoleAccountsUserIdPage;
