"use client";

import {
	type ActionResponseDto,
	useDeleteAction,
	useGetActionById,
} from "@cocrepo/api";
import { VStack } from "@cocrepo/ui";
import {
	Button,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface ActionDetailPageClientProps {
	actionId: string;
}

/**
 * group 색상 매핑
 */
const getGroupColor = (
	group?: string,
): "primary" | "secondary" | "success" | "warning" | "danger" | "default" => {
	switch (group) {
		case "crud":
			return "primary";
		case "visibility":
			return "secondary";
		case "workflow":
			return "success";
		case "bulk":
			return "warning";
		default:
			return "default";
	}
};

/**
 * Action 상세 페이지 - 클라이언트 컴포넌트
 */
function ActionDetailPageClient({ actionId }: ActionDetailPageClientProps) {
	const router = useRouter();
	const deleteModal = useDisclosure();

	// API 조회 (ActionResponseDto 반환 - config 포함)
	const { data: response, isLoading } = useGetActionById(actionId);
	const action = response?.data as ActionResponseDto | undefined;

	// 삭제 Mutation
	const { mutate: deleteAction, isPending: isDeleting } = useDeleteAction({
		mutation: {
			onSuccess: () => {
				deleteModal.onClose();
				router.push("/actions" as Route);
			},
		},
	});

	/**
	 * 뒤로가기 핸들러
	 */
	const onClickBackButton = () => {
		router.push("/actions" as Route);
	};

	/**
	 * 수정 페이지 이동 핸들러
	 */
	const onClickEditButton = () => {
		router.push(`/actions/${actionId}/edit` as Route);
	};

	/**
	 * 삭제 확인 핸들러
	 */
	const onClickDeleteConfirm = () => {
		deleteAction({ id: actionId });
	};

	if (isLoading) {
		return (
            <section><div className="flex items-start justify-between gap-4"><div><h1>{"Action 상세"}</h1><p>{"로딩 중..."}</p></div></div>
                <div className="flex items-center justify-center p-8">
                    <span className="text-default-500">로딩 중...</span>
                </div>
            </section>
        );
	}

	if (!action) {
		return (
            <section><div className="flex items-start justify-between gap-4"><div><h1>{"Action 상세"}</h1><p>{"Action을 찾을 수 없습니다."}</p></div></div>
                <div className="flex flex-col items-center justify-center gap-4 p-8">
                    <p className="text-default-500">Action을 찾을 수 없습니다.</p>
                    <Button variant="flat" onPress={onClickBackButton}>목록으로
                                            </Button>
                </div>
            </section>
        );
	}

	return (
        <section><div className="flex items-start justify-between gap-4"><div><h1>{"Action 상세"}</h1>{`${action.displayName || action.name} Action의 상세 정보입니다.` && <p>{`${action.displayName || action.name} Action의 상세 정보입니다.`}</p>}</div><div>{<div className="flex gap-2">
                                    <Button
                                        variant="light"
                                        startContent={<ArrowLeft className="h-4 w-4" />}
                                        onPress={onClickBackButton}>목록으로
                                                            </Button>
                                    {!action.isSystem && (<>
                                        <Button
                                            variant="flat"
                                            color="primary"
                                            startContent={<Edit className="h-4 w-4" />}
                                            onPress={onClickEditButton}>수정
                                                                        </Button>
                                        <Button
                                            variant="flat"
                                            color="danger"
                                            startContent={<Trash2 className="h-4 w-4" />}
                                            onPress={deleteModal.onOpen}>삭제
                                                                        </Button>
                                    </>)}
                                </div>}</div></div>
            <VStack gap={4}>
                {action.isSystem && (<div className="rounded-xl bg-warning-50 dark:bg-warning-900/20 p-4">
                    <p className="text-sm text-warning-700 dark:text-warning-400">
                        <strong>시스템 Action:</strong>이 Action은 시스템에서 기본
                                                    제공하는 Action으로, 수정하거나 삭제할 수 없습니다.
                                                </p>
                </div>)}
                <section>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm text-default-500 mb-1">행위 식별자</dt>
                                <dd className="flex items-center gap-2">
                                    <span className="font-mono">{action.name}</span>
                                    {action.isSystem && (<Chip size="sm" color="warning" variant="flat">시스템
                                                                                </Chip>)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm text-default-500 mb-1">표시명</dt>
                                <dd>{action.displayName || "-"}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-default-500 mb-1">분류</dt>
                                <dd>
                                    {action.group ? (<Chip size="sm" color={getGroupColor(action.group)} variant="flat">
                                        {action.group}
                                    </Chip>) : ("-")}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm text-default-500 mb-1">정렬 순서</dt>
                                <dd>{action.order}</dd>
                            </div>
                            <div className="md:col-span-2">
                                <dt className="text-sm text-default-500 mb-1">설명</dt>
                                <dd className="text-default-600">
                                    {action.description || "-"}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </section>
                {action.config && <section>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">설정 (Config)</h3>
                        <pre
                            className="bg-default-100 dark:bg-default-50/5 rounded-lg p-4 overflow-x-auto text-sm">
                            {JSON.stringify(action.config, null, 2)}
                        </pre>
                    </div>
                </section>}
                <section>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">추가 정보</h3>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm text-default-500 mb-1">생성일</dt>
                                <dd>{new Date(action.createdAt).toLocaleString("ko-KR")}</dd>
                            </div>
                            {action.updatedAt && (<div>
                                <dt className="text-sm text-default-500 mb-1">수정일</dt>
                                <dd>{new Date(action.updatedAt).toLocaleString("ko-KR")}</dd>
                            </div>)}
                        </dl>
                    </div>
                </section>
            </VStack>
            <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
                <ModalContent>
                    <ModalHeader>Action 삭제</ModalHeader>
                    <ModalBody>
                        <p>
                            <strong>{action.displayName || action.name}</strong>Action을
                                                        삭제하시겠습니까?
                                                    </p>
                        <p className="text-sm text-danger mt-2">이 작업은 되돌릴 수 없습니다.
                                                    </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={deleteModal.onClose} isDisabled={isDeleting}>취소
                                                    </Button>
                        <Button color="danger" onPress={onClickDeleteConfirm} isLoading={isDeleting}>삭제
                                                    </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </section>
    );
}

export default observer(ActionDetailPageClient);
