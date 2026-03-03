"use client";

import { useDeleteAbility, useGetAbilityById } from "@cocrepo/api";
import { Page, PageTitleBar, VStack } from "@cocrepo/ui";
import {
	Button,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	useDisclosure,
} from "@heroui/react";
import { ArrowLeft, Edit, Key, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface AbilityDetailPageClientProps {
	abilityId: string;
}

/**
 * 권한 상세 페이지 - 클라이언트 컴포넌트
 */
function AbilityDetailPageClient({ abilityId }: AbilityDetailPageClientProps) {
	const router = useRouter();
	const deleteModal = useDisclosure();

	// API 조회
	const { data: response, isLoading } = useGetAbilityById(abilityId);
	const ability = response?.data;

	// 삭제 Mutation
	const { mutate: deleteAbility, isPending: isDeleting } = useDeleteAbility({
		mutation: {
			onSuccess: () => {
				deleteModal.onClose();
				router.push("/abilities" as Route);
			},
		},
	});

	/**
	 * 뒤로가기 핸들러
	 */
	const onClickBackButton = () => {
		router.push("/abilities" as Route);
	};

	/**
	 * 수정 페이지 이동 핸들러
	 */
	const onClickEditButton = () => {
		router.push(`/abilities/${abilityId}/edit` as Route);
	};

	/**
	 * 삭제 확인 핸들러
	 */
	const onClickDeleteConfirm = () => {
		deleteAbility({ id: abilityId });
	};

	if (isLoading) {
		return (
			<Page
				top={<PageTitleBar title="권한 상세" description="로딩 중..." />}
			>
				<div className="flex items-center justify-center gap-2 p-8">
					<Spinner size="sm" />
					<span className="text-default-500">로딩 중...</span>
				</div>
			</Page>
		);
	}

	if (!ability) {
		return (
			<Page
				top={
					<PageTitleBar
						title="권한 상세"
						description="권한을 찾을 수 없습니다."
					/>
				}
			>
				<div className="flex flex-col items-center justify-center gap-4 p-8">
					<p className="text-default-500">권한을 찾을 수 없습니다.</p>
					<Button variant="flat" onPress={onClickBackButton}>
						목록으로
					</Button>
				</div>
			</Page>
		);
	}

	return (
		<Page
			top={
				<PageTitleBar
					title="권한 상세"
					description="권한 정보를 확인하고 수정하거나 삭제할 수 있습니다."
					actions={
						<div className="flex gap-2">
							<Button
								variant="flat"
								startContent={<ArrowLeft className="h-4 w-4" />}
								onPress={onClickBackButton}
							>
								목록으로
							</Button>
							<Button
								color="primary"
								startContent={<Edit className="h-4 w-4" />}
								onPress={onClickEditButton}
							>
								수정
							</Button>
							<Button
								color="danger"
								startContent={<Trash2 className="h-4 w-4" />}
								onPress={deleteModal.onOpen}
							>
								삭제
							</Button>
						</div>
					}
				/>
			}
		>
			<VStack gap={4}>
                <section>
                    <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-default-500">권한 이름</label>
                            <p className="font-mono mt-1">{ability.name}</p>
                        </div>
                        <div>
                            <label className="text-sm text-default-500">유형</label>
                            <div className="mt-1">
                                <Chip size="sm" color={ability.inverted ? "danger" : "success"} variant="flat">
                                    {ability.inverted ? "거부(cannot)" : "허용(can)"}
                                </Chip>
                            </div>
                        </div>
                        {ability.description && (<div className="md:col-span-2">
                            <label className="text-sm text-default-500">설명</label>
                            <p className="mt-1">{ability.description}</p>
                        </div>)}
                        {ability.inverted && ability.reason && (<div className="md:col-span-2">
                            <label className="text-sm text-default-500">거부 사유</label>
                            <p className="mt-1 text-danger">{ability.reason}</p>
                        </div>)}
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-semibold mb-4">CASL 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-default-500">Subject</label>
                            <p className="mt-1">
                                {ability.subject?.displayName || ability.subject?.name || "-"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm text-default-500">Action</label>
                            <p className="mt-1">
                                {ability.action?.displayName || ability.action?.name || "-"}
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm text-default-500">Fields</label>
                            <div className="mt-1">
                                {ability.fields.length === 0 ? (<Chip size="sm" variant="flat">전체 필드
                                                                        </Chip>) : (<div className="flex flex-wrap gap-2">
                                    {ability.fields.map(field => (<Chip key={`${ability.id}-${field}`} size="sm" variant="flat">
                                        {field}
                                    </Chip>))}
                                </div>)}
                            </div>
                        </div>
                        {ability.conditions && (<div className="md:col-span-2">
                            <label className="text-sm text-default-500">Conditions (JSON)
                                                                </label>
                            <pre className="mt-1 p-4 rounded-lg bg-content2 text-xs overflow-x-auto">
                                {JSON.stringify(ability.conditions, null, 2)}
                            </pre>
                        </div>)}
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-semibold mb-4">메타 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-default-500">생성일</label>
                            <p className="mt-1">
                                {new Date(ability.createdAt).toLocaleString("ko-KR")}
                            </p>
                        </div>
                        {ability.updatedAt && (<div>
                            <label className="text-sm text-default-500">수정일</label>
                            <p className="mt-1">
                                {new Date(ability.updatedAt).toLocaleString("ko-KR")}
                            </p>
                        </div>)}
                    </div>
                </section>
            </VStack>
            <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
                <ModalContent>
                    <ModalHeader className="flex gap-2 items-center">
                        <Key className="h-5 w-5 text-danger" />권한 삭제
                                            </ModalHeader>
                    <ModalBody>
                        <p>
                            <strong>{ability.name}</strong>권한을 삭제하시겠습니까?
                                                    </p>
                        <p className="text-sm text-default-500 mt-2">이 작업은 되돌릴 수 없습니다.
                                                    </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={deleteModal.onClose}>취소
                                                    </Button>
                        <Button color="danger" onPress={onClickDeleteConfirm} isLoading={isDeleting}>삭제
                                                    </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
		</Page>
	);
}

export default observer(AbilityDetailPageClient);
