"use client";
import {
	getGetSessionsQueryKey,
	getGetTimelinesQueryKey,
	type SessionDto,
	type TimelineDto,
	useDeleteSession,
	useDeleteTimeline,
	useGetSessions,
	useGetTimelineById,
} from "@cocrepo/api/core/timelines";

import {
	DateTimeCell,
	DetailPage,
	DetailPageSurface,
	PageTitleBar,
	DetailSection,
	DetailSectionCard,
	VStack,
} from "@cocrepo/ui";
import {
	addToast,
	Button,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	useDisclosure,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

interface TimelineDetailPageClientProps {
	timelineId: string;
}

/**
 * 세션 유형 라벨 반환
 */
const getSessionTypeLabel = (type: string) => {
	switch (type) {
		case "ONE_TIME":
			return "일회성";
		case "ONE_TIME_RANGE":
			return "기간형";
		case "RECURRING":
			return "정기반복";
		default:
			return type;
	}
};

/**
 * 세션 유형 색상 반환
 */
const getSessionTypeColor = (
	type: string,
): "primary" | "secondary" | "success" => {
	switch (type) {
		case "ONE_TIME":
			return "primary";
		case "ONE_TIME_RANGE":
			return "secondary";
		case "RECURRING":
			return "success";
		default:
			return "primary";
	}
};

/**
 * 요일 한글 변환
 */
const getDayLabel = (day?: string | null) => {
	if (!day) return "-";
	const map: Record<string, string> = {
		MON: "월",
		TUE: "화",
		WED: "수",
		THU: "목",
		FRI: "금",
		SAT: "토",
		SUN: "일",
	};
	return map[day] ?? day;
};

/**
 * 반복 주기 한글 변환
 */
const getCycleLabel = (cycle?: string | null) => {
	if (!cycle) return "-";
	switch (cycle) {
		case "WEEKLY":
			return "주간";
		case "MONTHLY":
			return "월간";
		default:
			return cycle;
	}
};

type SessionCountable = SessionDto & {
	_count?: {
		programs?: number;
	};
};

const getProgramCount = (session: SessionDto) => {
	const countableSession = session as SessionCountable;

	if (Array.isArray(countableSession.programs)) {
		return countableSession.programs.length;
	}

	if (typeof countableSession._count?.programs === "number") {
		return countableSession._count.programs;
	}

	return 0;
};

/**
 * 타임라인 상세 페이지 - 클라이언트 컴포넌트
 */
function TimelineDetailPageClient({
	timelineId,
}: TimelineDetailPageClientProps) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const state = useLocalObservable(() => ({
		deleteSessionTarget: null as SessionDto | null,
	}));

	const deleteTimelineModal = useDisclosure();
	const deleteSessionModal = useDisclosure();

	// 타임라인 상세 조회
	const { data: timelineResponse } = useGetTimelineById(timelineId);
	const timeline = timelineResponse?.data as TimelineDto | undefined;

	// 세션 목록 조회
	const { data: sessionsResponse, refetch: refetchSessions } = useGetSessions(
		timelineId,
		{ take: 20, skip: 0 },
	);
	const sessions = (sessionsResponse?.data ?? []) as SessionDto[];
	const totalSessions = sessions.length;
	const connectedSessions = sessions.filter(
		(session) => getProgramCount(session) > 0,
	).length;
	const unconnectedSessions = totalSessions - connectedSessions;

	const { mutate: deleteTimeline, isPending: isDeletingTimeline } =
		useDeleteTimeline();
	const { mutate: deleteSession, isPending: isDeletingSession } =
		useDeleteSession();

	const onClickEditButton = () => {
		router.push(`/timelines/${timelineId}/edit` as Route);
	};

	const onClickDeleteTimelineButton = () => {
		deleteTimelineModal.onOpen();
	};

	const onClickDeleteTimelineConfirm = () => {
		deleteTimeline(
			{ timelineId },
			{
				onSuccess: () => {
					addToast({
						title: "삭제 성공",
						description: "타임라인이 삭제되었습니다.",
						color: "success",
					});
					deleteTimelineModal.onClose();
					queryClient.invalidateQueries({
						queryKey: getGetTimelinesQueryKey(),
					});
					router.push("/timelines" as Route);
				},
				onError: () => {
					addToast({
						title: "삭제 실패",
						description:
							"타임라인 삭제 중 오류가 발생했습니다. 세션이 있는 타임라인은 삭제할 수 없습니다.",
						color: "danger",
					});
				},
			},
		);
	};

	const onClickSessionName = (session: SessionDto) => {
		router.push(`/timelines/${timelineId}/sessions/${session.id}` as Route);
	};

	const onClickCreateProgram = (session: SessionDto) => {
		router.push(
			`/timelines/${timelineId}/sessions/${session.id}/programs/new` as Route,
		);
	};

	const onClickDeleteSessionIcon = (session: SessionDto) => {
		state.deleteSessionTarget = session;
		deleteSessionModal.onOpen();
	};

	const onClickDeleteSessionConfirm = () => {
		const target = state.deleteSessionTarget;
		if (!target) return;

		deleteSession(
			{ timelineId, sessionId: target.id },
			{
				onSuccess: () => {
					addToast({
						title: "삭제 성공",
						description: "세션이 삭제되었습니다.",
						color: "success",
					});
					deleteSessionModal.onClose();
					state.deleteSessionTarget = null;
					queryClient.invalidateQueries({
						queryKey: getGetSessionsQueryKey(timelineId),
					});
					refetchSessions();
				},
				onError: () => {
					addToast({
						title: "삭제 실패",
						description:
							"세션 삭제 중 오류가 발생했습니다. 프로그램이 연결된 세션은 삭제할 수 없습니다.",
						color: "danger",
					});
				},
			},
		);
	};

	const pageTitle = timeline?.name ?? "타임라인 상세";
	const pageActions = (
		<div className="flex gap-2">
			<Button
				variant="flat"
				startContent={<Pencil className="h-4 w-4" />}
				onPress={onClickEditButton}
			>
				수정
			</Button>
			<Button
				color="danger"
				variant="flat"
				startContent={<Trash2 className="h-4 w-4" />}
				onPress={onClickDeleteTimelineButton}
			>
				삭제
			</Button>
		</div>
	);

	const sessionSectionActions = (
		<Button
			as={Link}
			href={`/timelines/${timelineId}/sessions/new`}
			color="primary"
			size="sm"
			startContent={<Plus className="h-4 w-4" />}
		>
			세션 등록
		</Button>
	);

	return (
		<DetailPage top={<PageTitleBar title={pageTitle} actions={pageActions} />}>
			<DetailPageSurface>
				<VStack gap={4}>
					<DetailSectionCard>
						<DetailSection top={<PageTitleBar level={2} title="기본 정보" />}>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label className="text-sm text-default-500">타임라인명</label>
									<p className="mt-1">{timeline?.name ?? "-"}</p>
								</div>
								<div>
									<label className="text-sm text-default-500">설명</label>
									<p className="mt-1">{timeline?.description || "-"}</p>
								</div>
								<div>
									<label className="text-sm text-default-500">등록일</label>
									<div className="mt-1">
										{timeline?.createdAt ? (
											<DateTimeCell value={timeline.createdAt} />
										) : (
											"-"
										)}
									</div>
								</div>
							</div>
						</DetailSection>
					</DetailSectionCard>

					<DetailSectionCard>
						<DetailSection
							top={
								<PageTitleBar
									level={2}
									title="세션 목록"
									actions={sessionSectionActions}
								/>
							}
						>
							<div className="grid grid-cols-1 gap-2 px-4 py-3 md:grid-cols-3">
								<div className="rounded-lg bg-content2 p-3">
									<p className="text-xs text-default-500">전체 세션</p>
									<p className="mt-1 text-lg font-semibold">
										{totalSessions}개
									</p>
								</div>
								<div className="rounded-lg bg-content2 p-3">
									<p className="text-xs text-default-500">연결된 세션</p>
									<p className="mt-1 text-lg font-semibold text-success">
										{connectedSessions}개
									</p>
								</div>
								<div className="rounded-lg bg-content2 p-3">
									<p className="text-xs text-default-500">미연결 세션</p>
									<p className="mt-1 text-lg font-semibold text-warning">
										{unconnectedSessions}개
									</p>
								</div>
							</div>
							<Table aria-label="세션 목록">
								<TableHeader>
									<TableColumn>세션명</TableColumn>
									<TableColumn align="center">유형</TableColumn>
									<TableColumn align="center">프로그램</TableColumn>
									<TableColumn align="center">연결 상태</TableColumn>
									<TableColumn>시작 일시</TableColumn>
									<TableColumn align="center">반복 요일</TableColumn>
									<TableColumn align="center">반복 주기</TableColumn>
									<TableColumn>등록일</TableColumn>
									<TableColumn align="center">액션</TableColumn>
								</TableHeader>
								<TableBody
									items={sessions}
									emptyContent="등록된 세션이 없습니다."
								>
									{(session) => (
										<TableRow key={session.id}>
											<TableCell>
												<button
													type="button"
													className="text-left text-primary hover:underline"
													onClick={() => onClickSessionName(session)}
												>
													{session.name}
												</button>
											</TableCell>
											<TableCell>
												<Chip
													color={getSessionTypeColor(session.type)}
													variant="flat"
													size="sm"
												>
													{getSessionTypeLabel(session.type)}
												</Chip>
											</TableCell>
											<TableCell>{getProgramCount(session)}개</TableCell>
											<TableCell>
												{getProgramCount(session) > 0 ? (
													<Chip color="success" variant="flat" size="sm">
														연결됨
													</Chip>
												) : (
													<Chip color="warning" variant="flat" size="sm">
														미연결
													</Chip>
												)}
											</TableCell>
											<TableCell>
												{session.startDateTime ? (
													<DateTimeCell value={session.startDateTime} />
												) : (
													"-"
												)}
											</TableCell>
											<TableCell>
												{getDayLabel(session.recurringDayOfWeek ?? undefined)}
											</TableCell>
											<TableCell>
												{getCycleLabel(session.repeatCycleType ?? undefined)}
											</TableCell>
											<TableCell>
												<DateTimeCell value={session.createdAt} />
											</TableCell>
											<TableCell>
												<div className="flex justify-center gap-1">
													<Button
														size="sm"
														variant="light"
														onPress={() => onClickCreateProgram(session)}
													>
														프로그램 등록
													</Button>
													<Button
														size="sm"
														color="danger"
														variant="light"
														isIconOnly
														onPress={() => onClickDeleteSessionIcon(session)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</DetailSection>
					</DetailSectionCard>
				</VStack>
			</DetailPageSurface>
			<Modal
				isOpen={deleteTimelineModal.isOpen}
				onClose={deleteTimelineModal.onClose}
			>
				<ModalContent>
					<ModalHeader>타임라인 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{timeline?.name}</strong>타임라인을 삭제하시겠습니까?
						</p>
						<p className="mt-2 text-sm text-danger">
							세션이 있는 타임라인은 삭제할 수 없습니다.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={deleteTimelineModal.onClose}
							isDisabled={isDeletingTimeline}
						>
							취소
						</Button>
						<Button
							color="danger"
							onPress={onClickDeleteTimelineConfirm}
							isLoading={isDeletingTimeline}
						>
							삭제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Modal
				isOpen={deleteSessionModal.isOpen}
				onClose={deleteSessionModal.onClose}
			>
				<ModalContent>
					<ModalHeader>세션 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{state.deleteSessionTarget?.name}</strong>세션을
							삭제하시겠습니까?
						</p>
						<p className="mt-2 text-sm text-danger">
							프로그램이 연결된 세션은 삭제할 수 없습니다.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={deleteSessionModal.onClose}
							isDisabled={isDeletingSession}
						>
							취소
						</Button>
						<Button
							color="danger"
							onPress={onClickDeleteSessionConfirm}
							isLoading={isDeletingSession}
						>
							삭제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</DetailPage>
	);
}

type TimelineDetailPageParams = {
	timelineId: string;
};

const TimelineDetailPage = observer(function TimelineDetailPage() {
	const { timelineId } = useParams<TimelineDetailPageParams>();

	return <TimelineDetailPageClient timelineId={timelineId} />;
});

export const AdminTimelinesTimelineIdPage = TimelineDetailPage;

export default AdminTimelinesTimelineIdPage;
