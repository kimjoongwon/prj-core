"use client";

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
} from "@heroui/react";
import { ArrowLeft, Edit, Key, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { DetailPage, DetailPageSurface, DetailSectionCard } from "../../detail";
import { Chip } from "../../display";
import { VStack } from "../../rhythm";
import { PageTitleBar } from "../../widget";

export interface AbilityDetailPageAbility {
	id: string;
	name: string;
	description?: string;
	inverted: boolean;
	reason?: string;
	subjectLabel: string;
	actionLabel: string;
	fields: string[];
	conditions?: unknown;
	createdAt: string;
	updatedAt?: string;
}

type AbilityDetailPageLoadingProps = {
	mode: "loading";
};

type AbilityDetailPageNotFoundProps = {
	mode: "not_found";
	onClickBackButton: () => void;
};

type AbilityDetailPageReadyProps = {
	mode: "ready";
	ability: AbilityDetailPageAbility;
	isDeleteModalOpen: boolean;
	isDeleting: boolean;
	onClickBackButton: () => void;
	onClickEditButton: () => void;
	onOpenDeleteModal: () => void;
	onCloseDeleteModal: () => void;
	onClickDeleteConfirm: () => void;
};

export type AbilityDetailPageProps =
	| AbilityDetailPageLoadingProps
	| AbilityDetailPageNotFoundProps
	| AbilityDetailPageReadyProps;

export const AbilityDetailPage = observer(function AbilityDetailPage(
	props: AbilityDetailPageProps,
) {
	if (props.mode === "loading") {
		return (
			<DetailPage
				top={<PageTitleBar title="권한 상세" description="로딩 중..." />}
			>
				<DetailPageSurface>
					<DetailSectionCard>
						<div className="flex items-center justify-center gap-2 p-8">
							<Spinner size="sm" />
							<span className="text-default-500">로딩 중...</span>
						</div>
					</DetailSectionCard>
				</DetailPageSurface>
			</DetailPage>
		);
	}

	if (props.mode === "not_found") {
		return (
			<DetailPage
				top={
					<PageTitleBar
						title="권한 상세"
						description="권한을 찾을 수 없습니다."
					/>
				}
			>
				<DetailPageSurface>
					<DetailSectionCard>
						<div className="flex flex-col items-center justify-center gap-4 p-8">
							<p className="text-default-500">권한을 찾을 수 없습니다.</p>
							<Button variant="flat" onPress={props.onClickBackButton}>
								목록으로
							</Button>
						</div>
					</DetailSectionCard>
				</DetailPageSurface>
			</DetailPage>
		);
	}

	const { ability } = props;

	return (
		<DetailPage
			top={
				<PageTitleBar
					title="권한 상세"
					description="권한 정보를 확인하고 수정하거나 삭제할 수 있습니다."
					actions={
						<div className="flex gap-2">
							<Button
								variant="flat"
								startContent={<ArrowLeft className="h-4 w-4" />}
								onPress={props.onClickBackButton}
							>
								목록으로
							</Button>
							<Button
								color="primary"
								startContent={<Edit className="h-4 w-4" />}
								onPress={props.onClickEditButton}
							>
								수정
							</Button>
							<Button
								color="danger"
								startContent={<Trash2 className="h-4 w-4" />}
								onPress={props.onOpenDeleteModal}
							>
								삭제
							</Button>
						</div>
					}
				/>
			}
		>
			<DetailPageSurface>
				<VStack gap="section">
					<DetailSectionCard>
						<h3 className="mb-4 text-lg font-semibold">기본 정보</h3>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<label className="text-sm text-default-500">권한 이름</label>
								<p className="mt-1 font-mono">{ability.name}</p>
							</div>
							<div>
								<label className="text-sm text-default-500">유형</label>
								<div className="mt-1">
									<Chip
										size="sm"
										color={ability.inverted ? "danger" : "success"}
										variant="flat"
									>
										{ability.inverted ? "거부(cannot)" : "허용(can)"}
									</Chip>
								</div>
							</div>
							{ability.description ? (
								<div className="md:col-span-2">
									<label className="text-sm text-default-500">설명</label>
									<p className="mt-1">{ability.description}</p>
								</div>
							) : null}
							{ability.inverted && ability.reason ? (
								<div className="md:col-span-2">
									<label className="text-sm text-default-500">거부 사유</label>
									<p className="mt-1 text-danger">{ability.reason}</p>
								</div>
							) : null}
						</div>
					</DetailSectionCard>
					<DetailSectionCard>
						<h3 className="mb-4 text-lg font-semibold">CASL 정보</h3>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<label className="text-sm text-default-500">Subject</label>
								<p className="mt-1">{ability.subjectLabel || "-"}</p>
							</div>
							<div>
								<label className="text-sm text-default-500">Action</label>
								<p className="mt-1">{ability.actionLabel || "-"}</p>
							</div>
							<div className="md:col-span-2">
								<label className="text-sm text-default-500">Fields</label>
								<div className="mt-1">
									{ability.fields.length === 0 ? (
										<Chip size="sm" variant="flat">
											전체 필드
										</Chip>
									) : (
										<div className="flex flex-wrap gap-2">
											{ability.fields.map((field) => (
												<Chip
													key={`${ability.id}-${field}`}
													size="sm"
													variant="flat"
												>
													{field}
												</Chip>
											))}
										</div>
									)}
								</div>
							</div>
							{ability.conditions ? (
								<div className="md:col-span-2">
									<label className="text-sm text-default-500">
										Conditions (JSON)
									</label>
									<pre className="mt-1 overflow-x-auto rounded-lg bg-content2 p-4 text-xs">
										{JSON.stringify(ability.conditions, null, 2)}
									</pre>
								</div>
							) : null}
						</div>
					</DetailSectionCard>
					<DetailSectionCard>
						<h3 className="mb-4 text-lg font-semibold">메타 정보</h3>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<label className="text-sm text-default-500">생성일</label>
								<p className="mt-1">
									{new Date(ability.createdAt).toLocaleString("ko-KR")}
								</p>
							</div>
							{ability.updatedAt ? (
								<div>
									<label className="text-sm text-default-500">수정일</label>
									<p className="mt-1">
										{new Date(ability.updatedAt).toLocaleString("ko-KR")}
									</p>
								</div>
							) : null}
						</div>
					</DetailSectionCard>
				</VStack>
			</DetailPageSurface>

			<Modal
				isOpen={props.isDeleteModalOpen}
				onClose={props.onCloseDeleteModal}
			>
				<ModalContent>
					<ModalHeader className="flex items-center gap-2">
						<Key className="h-5 w-5 text-danger" />
						권한 삭제
					</ModalHeader>
					<ModalBody>
						<p>
							<strong>{ability.name}</strong>권한을 삭제하시겠습니까?
						</p>
						<p className="mt-2 text-sm text-default-500">
							이 작업은 되돌릴 수 없습니다.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button variant="flat" onPress={props.onCloseDeleteModal}>
							취소
						</Button>
						<Button
							color="danger"
							onPress={props.onClickDeleteConfirm}
							isLoading={props.isDeleting}
						>
							삭제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</DetailPage>
	);
});

AbilityDetailPage.displayName = "AbilityDetailPage";
