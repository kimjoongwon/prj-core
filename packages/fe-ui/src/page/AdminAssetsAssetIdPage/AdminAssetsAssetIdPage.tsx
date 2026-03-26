"use client";
import {
	type AssetDto,
	type FolderDto,
	getGetAssetsQueryKey,
	useGetAssetById,
	useGetFolders,
	useMoveAsset,
	useRemoveAsset,
} from "@cocrepo/api/assets";

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
	Input,
	Select,
	SelectItem,
	Spinner,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FolderInput, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

interface AssetDetailPageClientProps {
	assetId: string;
}

const getKindLabel = (kind: AssetDto["kind"]) => {
	switch (kind) {
		case "IMAGE":
			return "이미지";
		case "VIDEO":
			return "비디오";
		case "DOCUMENT":
			return "문서";
		default:
			return kind;
	}
};

const getStatusLabel = (status: AssetDto["status"]) => {
	switch (status) {
		case "READY":
			return "완료";
		case "UPLOADING":
			return "업로드 중";
		case "FAILED":
			return "실패";
		default:
			return status;
	}
};

const formatBytes = (bytes: number) => {
	if (bytes === 0) {
		return "0 B";
	}

	const units = ["B", "KB", "MB", "GB"];
	const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 3);
	const value = bytes / 1024 ** exponent;
	return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

/**
 * 에셋 상세 페이지 - 클라이언트 컴포넌트
 */
function AssetDetailPageClient({ assetId }: AssetDetailPageClientProps) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { data: response, isLoading } = useGetAssetById(assetId);
	const { data: folderResponse } = useGetFolders();

	const asset = response?.data as AssetDto | undefined;
	const folders = (folderResponse?.data ?? []) as FolderDto[];
	const [targetFolderId, setTargetFolderId] = useState<string>("");

	const { mutate: removeAsset, isPending: isRemoving } = useRemoveAsset({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: getGetAssetsQueryKey(),
				});
				addToast({
					title: "삭제 완료",
					description: "에셋이 삭제되었습니다.",
					color: "success",
				});
				router.push("/assets" as Route);
			},
			onError: () => {
				addToast({
					title: "삭제 실패",
					description: "에셋 삭제 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	const { mutate: moveAsset, isPending: isMoving } = useMoveAsset({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: getGetAssetsQueryKey(),
				});
				queryClient.invalidateQueries({
					queryKey: ["/api/v1/assets", assetId],
				});
				setTargetFolderId("");
				addToast({
					title: "이동 완료",
					description: "에셋 폴더가 변경되었습니다.",
					color: "success",
				});
			},
			onError: () => {
				addToast({
					title: "이동 실패",
					description: "폴더 이동 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	const onClickBackButton = () => {
		router.push("/assets" as Route);
	};

	const onClickDeleteAssetButton = () => {
		removeAsset({ assetId });
	};

	const onClickMoveAssetButton = () => {
		if (!targetFolderId) {
			addToast({
				title: "대상 폴더 선택 필요",
				description: "이동할 폴더를 먼저 선택해주세요.",
				color: "warning",
			});
			return;
		}

		moveAsset({
			assetId,
			data: { targetFolderId },
		});
	};

	if (isLoading) {
		return (
			<DetailPage top={<PageTitleBar title="에셋 상세" description="로딩 중..." />}>
				<DetailPageSurface>
					<DetailSectionCard>
						<div className="flex items-center justify-center p-10">
							<Spinner size="lg" />
						</div>
					</DetailSectionCard>
				</DetailPageSurface>
			</DetailPage>
		);
	}

	if (!asset) {
		return (
			<DetailPage
				top={
					<PageTitleBar
						title="에셋 상세"
						description="에셋을 찾을 수 없습니다."
					/>
				}
			>
				<DetailPageSurface>
					<DetailSectionCard>
						<div className="flex flex-col items-center justify-center gap-4 p-8">
							<p className="text-default-500">에셋을 찾을 수 없습니다.</p>
							<Button variant="flat" onPress={onClickBackButton}>
								목록으로
							</Button>
						</div>
					</DetailSectionCard>
				</DetailPageSurface>
			</DetailPage>
		);
	}

	const pageActions = (
		<div className="flex gap-2">
			<Button
				variant="light"
				startContent={<ArrowLeft className="h-4 w-4" />}
				onPress={onClickBackButton}
			>
				목록으로
			</Button>
			<Button
				variant="flat"
				color="danger"
				isLoading={isRemoving}
				startContent={<Trash2 className="h-4 w-4" />}
				onPress={onClickDeleteAssetButton}
			>
				삭제
			</Button>
		</div>
	);

	return (
		<DetailPage
			top={
				<PageTitleBar
					title={asset.originalName ?? "에셋 상세"}
					description="에셋 상세 정보"
					actions={pageActions}
				/>
			}
		>
			<DetailPageSurface>
				<VStack gap={4}>
					<DetailSectionCard>
						<DetailSection top={<PageTitleBar level={2} title="기본 정보" />}>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<p className="text-sm text-default-500">파일명</p>
									<p className="mt-1 font-medium">{asset.originalName}</p>
								</div>
								<div>
									<p className="text-sm text-default-500">에셋 ID</p>
									<p className="mt-1 font-mono text-sm">{asset.id}</p>
								</div>
								<div>
									<p className="text-sm text-default-500">타입</p>
									<p className="mt-1">{getKindLabel(asset.kind)}</p>
								</div>
								<div>
									<p className="text-sm text-default-500">상태</p>
									<p className="mt-1">{getStatusLabel(asset.status)}</p>
								</div>
								<div>
									<p className="text-sm text-default-500">MIME 타입</p>
									<p className="mt-1 font-mono text-sm">{asset.mimeType}</p>
								</div>
								<div>
									<p className="text-sm text-default-500">크기</p>
									<p className="mt-1">{formatBytes(asset.sizeBytes)}</p>
								</div>
								<div>
									<p className="text-sm text-default-500">현재 폴더 ID</p>
									<p className="mt-1 font-mono text-sm">{asset.folderId}</p>
								</div>
								<div>
									<p className="text-sm text-default-500">등록일</p>
									<div className="mt-1">
										<DateTimeCell value={asset.createdAt} />
									</div>
								</div>
							</div>
						</DetailSection>
					</DetailSectionCard>
					<DetailSectionCard>
						<DetailSection top={<PageTitleBar level={2} title="폴더 이동" />}>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
								<Select
									label="이동 대상 폴더"
									placeholder="폴더를 선택하세요"
									selectedKeys={targetFolderId ? [targetFolderId] : []}
									onSelectionChange={(keys) => {
										const firstKey = Array.from(keys)[0];
										setTargetFolderId(firstKey ? String(firstKey) : "");
									}}
								>
									{folders.map((folder) => (
										<SelectItem key={folder.id}>{folder.name}</SelectItem>
									))}
								</Select>
								<div className="flex items-end">
									<Button
										color="primary"
										variant="flat"
										isLoading={isMoving}
										startContent={<FolderInput className="h-4 w-4" />}
										onPress={onClickMoveAssetButton}
									>
										이동
									</Button>
								</div>
							</div>
						</DetailSection>
					</DetailSectionCard>
					<DetailSectionCard>
						<DetailSection top={<PageTitleBar level={2} title="스토리지 정보" />}>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<Input
									label="Storage Key"
									value={asset.storageKey}
									isReadOnly
								/>
								<Input
									label="Checksum"
									value={asset.checksum ?? "-"}
									isReadOnly
								/>
							</div>
						</DetailSection>
					</DetailSectionCard>
				</VStack>
			</DetailPageSurface>
		</DetailPage>
	);
}

const AssetDetailPage = observer(function AssetDetailPage() {
	const params = useParams<{ assetId: string }>();
	return <AssetDetailPageClient assetId={params.assetId} />;
});

export const AdminAssetsAssetIdPage = AssetDetailPage;

export default AdminAssetsAssetIdPage;
