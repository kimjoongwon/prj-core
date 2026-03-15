"use client";
import {
	getGetProgramsQueryKey,
	type ProgramDto,
	useDeleteProgram,
	useGetProgramById,
} from "@cocrepo/api/core/timelines";

import {
	DateTimeCell,
	Page,
	PageSurface,
	PageTitleBar,
	Section,
	SectionSurface,
} from "@cocrepo/ui";
import {
	addToast,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProgramDetailPageClientProps {
	timelineId: string;
	sessionId: string;
	programId: string;
}

/**
 * 프로그램 상세 페이지 - 클라이언트 컴포넌트
 */
function ProgramDetailPageClient({
	timelineId,
	sessionId,
	programId,
}: ProgramDetailPageClientProps) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const deleteModal = useDisclosure();

	const { data: response } = useGetProgramById(
		timelineId,
		sessionId,
		programId,
	);
	const program = response?.data as ProgramDto | undefined;

	const { mutate: deleteProgram, isPending: isDeleting } = useDeleteProgram();

	const onClickEditButton = () => {
		router.push(
			`/timelines/${timelineId}/sessions/${sessionId}/programs/${programId}/edit` as Route,
		);
	};

	const onClickDeleteConfirm = () => {
		deleteProgram(
			{ timelineId, sessionId, programId },
			{
				onSuccess: () => {
					addToast({
						title: "삭제 성공",
						description: "프로그램이 삭제되었습니다.",
						color: "success",
					});
					deleteModal.onClose();
					queryClient.invalidateQueries({
						queryKey: getGetProgramsQueryKey(timelineId, sessionId),
					});
					router.push(
						`/timelines/${timelineId}/sessions/${sessionId}` as Route,
					);
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

	const descriptionText = [
		program?.session?.name,
		program?.session?.timeline?.name,
	]
		.filter(Boolean)
		.join(" · ");

	const pageTitle = program?.name ?? "프로그램 상세";
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
				onPress={deleteModal.onOpen}
			>
				삭제
			</Button>
		</div>
	);

	return (
		<Page
			top={
				<PageTitleBar
					title={pageTitle}
					description={descriptionText || undefined}
					actions={pageActions}
				/>
			}
		>
			<PageSurface>
				<SectionSurface>
					<Section top={<PageTitleBar level={2} title="기본 정보" />}>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<label className="text-sm text-default-500">
									프로그램 이름
								</label>
								<p className="mt-1">{program?.name ?? "-"}</p>
							</div>
							<div>
								<label className="text-sm text-default-500">루틴</label>
								<div className="mt-1">
									{program?.routine ? (
										<Link
											href={`/routines/${program.routine.id}` as Route}
											className="text-primary hover:underline"
										>
											{program.routine.name}
										</Link>
									) : (
										"-"
									)}
								</div>
							</div>
							<div>
								<label className="text-sm text-default-500">강사</label>
								<p className="mt-1">{program?.instructorId ?? "-"}</p>
							</div>
							<div>
								<label className="text-sm text-default-500">정원</label>
								<p className="mt-1">
									{program?.capacity != null ? `${program.capacity}명` : "-"}
								</p>
							</div>
							<div>
								<label className="text-sm text-default-500">난이도</label>
								<p className="mt-1">{program?.level ?? "-"}</p>
							</div>
							<div>
								<label className="text-sm text-default-500">세션</label>
								<div className="mt-1">
									<Link
										href={
											`/timelines/${timelineId}/sessions/${sessionId}` as Route
										}
										className="text-primary hover:underline"
									>
										{program?.session?.name ?? "-"}
									</Link>
								</div>
							</div>
							<div>
								<label className="text-sm text-default-500">등록일</label>
								<div className="mt-1">
									{program?.createdAt ? (
										<DateTimeCell value={program.createdAt} />
									) : (
										"-"
									)}
								</div>
							</div>
						</div>
					</Section>
				</SectionSurface>
			</PageSurface>
			<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
				<ModalContent>
					<ModalHeader>프로그램 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{program?.name}</strong>프로그램을 삭제하시겠습니까?
						</p>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={deleteModal.onClose}
							isDisabled={isDeleting}
						>
							취소
						</Button>
						<Button
							color="danger"
							onPress={onClickDeleteConfirm}
							isLoading={isDeleting}
						>
							삭제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Page>
	);
}

export default observer(ProgramDetailPageClient);
