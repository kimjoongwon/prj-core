"use client";
import {
	getGetProgramsQueryKey,
	getGetSessionsQueryKey,
	type ProgramDto,
	type SessionDto,
	useDeleteProgram,
	useDeleteSession,
	useGetPrograms,
	useGetSessionById,
} from "@cocrepo/api/core/timelines";
import { useGetUsers, type UserDto } from "@cocrepo/api/core/users";

import { DateTimeCell, Page, PageTitleBar, Section, VStack } from "@cocrepo/ui";
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
import { useRouter } from "next/navigation";

interface SessionDetailPageClientProps {
	timelineId: string;
	sessionId: string;
}

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

const getDayLabel = (day?: string | null) => {
	if (!day) return "-";
	const map: Record<string, string> = {
		MON: "월요일",
		TUE: "화요일",
		WED: "수요일",
		THU: "목요일",
		FRI: "금요일",
		SAT: "토요일",
		SUN: "일요일",
	};
	return map[day] ?? day;
};

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

/**
 * 세션 상세 페이지 - 클라이언트 컴포넌트
 */
function SessionDetailPageClient({
	timelineId,
	sessionId,
}: SessionDetailPageClientProps) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const state = useLocalObservable(() => ({
		deleteProgramTarget: null as ProgramDto | null,
	}));

	const deleteSessionModal = useDisclosure();
	const deleteProgramModal = useDisclosure();

	// 세션 상세 조회
	const { data: sessionResponse } = useGetSessionById(timelineId, sessionId);
	const session = sessionResponse?.data as SessionDto | undefined;

	// 프로그램 목록 조회
	const { data: programsResponse, refetch: refetchPrograms } = useGetPrograms(
		timelineId,
		sessionId,
		{ take: 20, skip: 0 },
	);
	const programs = (programsResponse?.data ?? []) as ProgramDto[];

	const { data: usersResponse } = useGetUsers({
		take: 100,
		skip: 0,
		status: "active",
	});
	const users = (usersResponse?.data ?? []) as UserDto[];
	const instructorNameById = new Map(users.map((user) => [user.id, user.name]));

	const isConnectionResolved = (program: ProgramDto) => {
		const hasRoutine = Boolean(program.routine?.id);
		const hasInstructor = instructorNameById.has(program.instructorId);
		return hasRoutine && hasInstructor;
	};

	const totalPrograms = programs.length;
	const resolvedPrograms = programs.filter((program) =>
		isConnectionResolved(program),
	).length;
	const unresolvedPrograms = totalPrograms - resolvedPrograms;

	const { mutate: deleteSession, isPending: isDeletingSession } =
		useDeleteSession();
	const { mutate: deleteProgram, isPending: isDeletingProgram } =
		useDeleteProgram();

	const onClickEditButton = () => {
		router.push(`/timelines/${timelineId}/sessions/${sessionId}/edit` as Route);
	};

	const onClickDeleteSessionButton = () => {
		deleteSessionModal.onOpen();
	};

	const onClickDeleteSessionConfirm = () => {
		deleteSession(
			{ timelineId, sessionId },
			{
				onSuccess: () => {
					addToast({
						title: "삭제 성공",
						description: "세션이 삭제되었습니다.",
						color: "success",
					});
					deleteSessionModal.onClose();
					queryClient.invalidateQueries({
						queryKey: getGetSessionsQueryKey(timelineId),
					});
					router.push(`/timelines/${timelineId}` as Route);
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

	const onClickProgramName = (program: ProgramDto) => {
		router.push(
			`/timelines/${timelineId}/sessions/${sessionId}/programs/${program.id}` as Route,
		);
	};

	const onClickEditProgram = (program: ProgramDto) => {
		router.push(
			`/timelines/${timelineId}/sessions/${sessionId}/programs/${program.id}/edit` as Route,
		);
	};

	const onClickDeleteProgramIcon = (program: ProgramDto) => {
		state.deleteProgramTarget = program;
		deleteProgramModal.onOpen();
	};

	const onClickDeleteProgramConfirm = () => {
		const target = state.deleteProgramTarget;
		if (!target) return;

		deleteProgram(
			{ timelineId, sessionId, programId: target.id },
			{
				onSuccess: () => {
					addToast({
						title: "삭제 성공",
						description: "프로그램이 삭제되었습니다.",
						color: "success",
					});
					deleteProgramModal.onClose();
					state.deleteProgramTarget = null;
					queryClient.invalidateQueries({
						queryKey: getGetProgramsQueryKey(timelineId, sessionId),
					});
					refetchPrograms();
				},
				onError: () => {
					addToast({
						title: "삭제 실패",
						description: "프로그램 삭제 중 오류가 발생했습니다.",
						color: "danger",
					});
				},
			},
		);
	};

	const getInstructorName = (instructorId: string) => {
		return instructorNameById.get(instructorId) ?? "확인 필요";
	};

	const pageTitle = session?.name ?? "세션 상세";
	const pageDescription = session?.timeline?.name;
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
				onPress={onClickDeleteSessionButton}
			>
				삭제
			</Button>
		</div>
	);

	const programSectionActions = (
		<Button
			as={Link}
			href={`/timelines/${timelineId}/sessions/${sessionId}/programs/new`}
			color="primary"
			size="sm"
			startContent={<Plus className="h-4 w-4" />}
		>
			프로그램 등록
		</Button>
	);

	return (
		<Page
			top={
				<PageTitleBar
					title={pageTitle}
					description={pageDescription}
					actions={pageActions}
				/>
			}
		>
			<VStack gap={4}>
				<Section top={<PageTitleBar level={2} title="기본 정보" />}>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className="text-sm text-default-500">세션명</label>
							<p className="mt-1">{session?.name ?? "-"}</p>
						</div>
						<div>
							<label className="text-sm text-default-500">유형</label>
							<div className="mt-1">
								{session?.type && (
									<Chip
										color={getSessionTypeColor(session.type)}
										variant="flat"
										size="sm"
									>
										{getSessionTypeLabel(session.type)}
									</Chip>
								)}
							</div>
						</div>
						{session?.type === "RECURRING" && (
							<>
								<div>
									<label className="text-sm text-default-500">반복 요일</label>
									<p className="mt-1">
										{getDayLabel(session.recurringDayOfWeek ?? null)}
									</p>
								</div>
								<div>
									<label className="text-sm text-default-500">반복 주기</label>
									<p className="mt-1">
										{getCycleLabel(session.repeatCycleType ?? null)}
									</p>
								</div>
							</>
						)}
						{session?.startDateTime && (
							<div>
								<label className="text-sm text-default-500">시작 일시</label>
								<div className="mt-1">
									<DateTimeCell value={session.startDateTime} />
								</div>
							</div>
						)}
						{session?.endDateTime && (
							<div>
								<label className="text-sm text-default-500">종료 일시</label>
								<div className="mt-1">
									<DateTimeCell value={session.endDateTime} />
								</div>
							</div>
						)}
						<div>
							<label className="text-sm text-default-500">설명</label>
							<p className="mt-1">{session?.description || "-"}</p>
						</div>
						<div>
							<label className="text-sm text-default-500">타임라인</label>
							<div className="mt-1">
								<Link
									href={`/timelines/${timelineId}` as Route}
									className="text-primary hover:underline"
								>
									{session?.timeline?.name ?? "-"}
								</Link>
							</div>
						</div>
						<div>
							<label className="text-sm text-default-500">등록일</label>
							<div className="mt-1">
								{session?.createdAt ? (
									<DateTimeCell value={session.createdAt} />
								) : (
									"-"
								)}
							</div>
						</div>
					</div>
				</Section>

				<Section
					top={
						<PageTitleBar
							level={2}
							title="프로그램 연결 허브"
							actions={programSectionActions}
						/>
					}
				>
					<div className="grid grid-cols-1 gap-2 px-4 py-3 md:grid-cols-3">
						<div className="rounded-lg bg-content2 p-3">
							<p className="text-xs text-default-500">전체 프로그램</p>
							<p className="mt-1 text-lg font-semibold">{totalPrograms}개</p>
						</div>
						<div className="rounded-lg bg-content2 p-3">
							<p className="text-xs text-default-500">강사 연결 정상</p>
							<p className="mt-1 text-lg font-semibold text-success">
								{resolvedPrograms}개
							</p>
						</div>
						<div className="rounded-lg bg-content2 p-3">
							<p className="text-xs text-default-500">확인 필요</p>
							<p className="mt-1 text-lg font-semibold text-warning">
								{unresolvedPrograms}개
							</p>
						</div>
					</div>
					<Table aria-label="프로그램 목록">
						<TableHeader>
							<TableColumn>프로그램명</TableColumn>
							<TableColumn>루틴명</TableColumn>
							<TableColumn>강사</TableColumn>
							<TableColumn align="center">연결 상태</TableColumn>
							<TableColumn align="center">정원</TableColumn>
							<TableColumn>난이도</TableColumn>
							<TableColumn align="center">액션</TableColumn>
						</TableHeader>
						<TableBody
							items={programs}
							emptyContent="등록된 프로그램이 없습니다. 프로그램을 등록해 주세요."
						>
							{(program) => (
								<TableRow key={program.id}>
									<TableCell>
										<button
											type="button"
											className="text-left text-primary hover:underline"
											onClick={() => onClickProgramName(program)}
										>
											{program.name}
										</button>
									</TableCell>
									<TableCell>{program.routine?.name ?? "-"}</TableCell>
									<TableCell>
										{getInstructorName(program.instructorId)}
									</TableCell>
									<TableCell>
										{isConnectionResolved(program) ? (
											<Chip color="success" variant="flat" size="sm">
												정상
											</Chip>
										) : (
											<Chip color="warning" variant="flat" size="sm">
												확인필요
											</Chip>
										)}
									</TableCell>
									<TableCell>{program.capacity}명</TableCell>
									<TableCell>{program.level ?? "-"}</TableCell>
									<TableCell>
										<div className="flex justify-center gap-1">
											<Button
												size="sm"
												variant="light"
												isIconOnly
												onPress={() => onClickEditProgram(program)}
											>
												<Pencil className="h-4 w-4" />
											</Button>
											<Button
												size="sm"
												color="danger"
												variant="light"
												isIconOnly
												onPress={() => onClickDeleteProgramIcon(program)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</Section>
			</VStack>
			<Modal
				isOpen={deleteSessionModal.isOpen}
				onClose={deleteSessionModal.onClose}
			>
				<ModalContent>
					<ModalHeader>세션 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{session?.name}</strong>세션을 삭제하시겠습니까?
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
			<Modal
				isOpen={deleteProgramModal.isOpen}
				onClose={deleteProgramModal.onClose}
			>
				<ModalContent>
					<ModalHeader>프로그램 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{state.deleteProgramTarget?.name}</strong>프로그램을
							삭제하시겠습니까?
						</p>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={deleteProgramModal.onClose}
							isDisabled={isDeletingProgram}
						>
							취소
						</Button>
						<Button
							color="danger"
							onPress={onClickDeleteProgramConfirm}
							isLoading={isDeletingProgram}
						>
							삭제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Page>
	);
}

export default observer(SessionDetailPageClient);
