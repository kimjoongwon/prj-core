"use client";

import {
	type AuthSessionInfoDto,
	useGetMySessions,
	useRevokeOtherSessions,
	useRevokeSession,
} from "@cocrepo/api";
import { getGetMySessionsQueryKey } from "@cocrepo/api";
import { PageSurface, SectionSurface, VStack } from "@cocrepo/ui";
import { Button, Chip, Spinner } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import {
	Globe,
	Monitor,
	Smartphone,
	Trash2,
} from "lucide-react";
import { observer } from "mobx-react-lite";

/** User-Agent에서 기기 정보를 추출합니다 */
function parseUserAgent(ua: string) {
	const isMobile = /mobile|android|iphone|ipad/i.test(ua);

	let browser = "알 수 없는 브라우저";
	if (/chrome/i.test(ua) && !/edge|opr/i.test(ua)) browser = "Chrome";
	else if (/firefox/i.test(ua)) browser = "Firefox";
	else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
	else if (/edge/i.test(ua)) browser = "Edge";

	let os = "알 수 없는 OS";
	if (/windows/i.test(ua)) os = "Windows";
	else if (/mac os/i.test(ua)) os = "macOS";
	else if (/linux/i.test(ua)) os = "Linux";
	else if (/android/i.test(ua)) os = "Android";
	else if (/iphone|ipad/i.test(ua)) os = "iOS";

	return { isMobile, browser, os };
}

/** 상대 시간 포맷 */
function formatRelativeTime(dateStr: string) {
	const diff = Date.now() - new Date(dateStr).getTime();
	const minutes = Math.floor(diff / 60000);
	if (minutes < 1) return "방금 전";
	if (minutes < 60) return `${minutes}분 전`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}시간 전`;
	const days = Math.floor(hours / 24);
	return `${days}일 전`;
}

/** 세션 카드 컴포넌트 */
function SessionCard({
	session,
	onClickRevokeButton,
	isRevoking,
}: {
	session: AuthSessionInfoDto;
	onClickRevokeButton: () => void;
	isRevoking: boolean;
}) {
	const { isMobile, browser, os } = parseUserAgent(session.userAgent);
	const DeviceIcon = isMobile ? Smartphone : Monitor;

	return (
		<div className="flex items-center gap-4 p-4 rounded-xl border border-divider bg-content1">
			<div className="shrink-0">
				<div
					className={`w-12 h-12 rounded-full flex items-center justify-center ${
						session.isCurrent
							? "bg-primary/20 text-primary"
							: "bg-default-100 text-default-500"
					}`}
				>
					<DeviceIcon className="size-6" />
				</div>
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 mb-1">
					<span className="font-medium text-sm">
						{browser} / {os}
					</span>
					{session.isCurrent && (
						<Chip size="sm" color="primary" variant="flat">
							현재 세션
						</Chip>
					)}
				</div>
				<div className="flex items-center gap-3 text-xs text-default-400">
					<span className="flex items-center gap-1">
						<Globe className="size-3" />
						{session.ipAddress}
					</span>
					<span>
						마지막 활동: {formatRelativeTime(session.lastActivityAt)}
					</span>
				</div>
			</div>

			{!session.isCurrent && (
				<Button
					size="sm"
					color="danger"
					variant="flat"
					startContent={<Trash2 className="size-3.5" />}
					onPress={onClickRevokeButton}
					isLoading={isRevoking}
				>
					종료
				</Button>
			)}
		</div>
	);
}

/**
 * 내 세션 관리 페이지 - 클라이언트 컴포넌트
 */
function MySessionsClient() {
	const queryClient = useQueryClient();
	const { data: response, isLoading } = useGetMySessions();

	const sessions = (response?.data ?? []) as AuthSessionInfoDto[];
	const currentSession = sessions.find((s) => s.isCurrent);
	const otherSessions = sessions.filter((s) => !s.isCurrent);

	const { mutate: revokeSessionMutate, isPending: isRevokingOne } =
		useRevokeSession({
			mutation: {
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: getGetMySessionsQueryKey(),
					});
				},
			},
		});

	const { mutate: revokeOthersMutate, isPending: isRevokingOthers } =
		useRevokeOtherSessions({
			mutation: {
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: getGetMySessionsQueryKey(),
					});
				},
			},
		});

	const onClickRevokeButton = (sessionId: string) => {
		revokeSessionMutate({ sessionId });
	};

	const onClickRevokeOthersButton = () => {
		revokeOthersMutate();
	};

	if (isLoading) {
		return (
			<PageSurface title="내 세션 관리">
				<div className="flex justify-center py-16">
					<Spinner size="lg" />
				</div>
			</PageSurface>
		);
	}

	return (
		<PageSurface
			title="내 세션 관리"
			description="현재 로그인된 기기를 관리합니다."
		>
			<VStack gap={4}>
				{/* 현재 세션 */}
				{currentSession && (
					<SectionSurface title="현재 세션">
						<SessionCard
							session={currentSession}
							onClickRevokeButton={() => {}}
							isRevoking={false}
						/>
					</SectionSurface>
				)}

				{/* 다른 세션 */}
				<SectionSurface
					title={`다른 세션 (${otherSessions.length}개)`}
				>
					{otherSessions.length === 0 ? (
						<p className="text-default-400 text-sm py-4 text-center">
							다른 기기에서 로그인된 세션이 없습니다.
						</p>
					) : (
						<VStack gap={3}>
							{otherSessions.map((session) => (
								<SessionCard
									key={session.sessionId}
									session={session}
									onClickRevokeButton={() =>
										onClickRevokeButton(session.sessionId)
									}
									isRevoking={isRevokingOne}
								/>
							))}
						</VStack>
					)}
				</SectionSurface>

				{/* 모든 다른 세션 종료 버튼 */}
				{otherSessions.length > 0 && (
					<div className="flex justify-end">
						<Button
							color="danger"
							variant="flat"
							startContent={<Trash2 className="size-4" />}
							onPress={onClickRevokeOthersButton}
							isLoading={isRevokingOthers}
						>
							모든 다른 기기에서 로그아웃
						</Button>
					</div>
				)}
			</VStack>
		</PageSurface>
	);
}

export default observer(MySessionsClient);
