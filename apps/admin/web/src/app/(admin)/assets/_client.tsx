"use client";

import {
	type AssetDto,
	type AssetKind,
	type AssetStatus,
	type FolderDto,
	getGetAssetsQueryKey,
	useGetAssetsSuspense,
	useGetFoldersSuspense,
	useRemoveAsset,
} from "@cocrepo/api/assets";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	DateTimeCell,
	EmptyState,
	MetaDataGrid,
	Page,
	PageSurface,
	PageTitleBar,
	SectionSurface,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { addToast, Button, Chip } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Upload } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { usePersistStore } from "@/stores/AppStoreProvider";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "파일명 검색...",
		props: {
			debounceMs: 300,
		},
	},
	{
		type: "select",
		id: "kind",
		placeholder: "타입",
		props: {
			options: [
				{ label: "전체", value: "" },
				{ label: "이미지", value: "IMAGE" },
				{ label: "비디오", value: "VIDEO" },
				{ label: "문서", value: "DOCUMENT" },
			],
		},
	},
	{
		type: "select",
		id: "status",
		placeholder: "상태",
		props: {
			options: [
				{ label: "전체", value: "" },
				{ label: "업로드 중", value: "UPLOADING" },
				{ label: "완료", value: "READY" },
				{ label: "실패", value: "FAILED" },
			],
		},
	},
];

const getKindLabel = (kind: AssetKind) => {
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

const getStatusColor = (
	status: AssetStatus,
): "success" | "warning" | "danger" => {
	switch (status) {
		case "READY":
			return "success";
		case "UPLOADING":
			return "warning";
		case "FAILED":
			return "danger";
		default:
			return "warning";
	}
};

const getStatusLabel = (status: AssetStatus) => {
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

const buildLeftInputsWithFolders = (folders: FolderDto[]): InputConfig[] => [
	...leftInputs,
	{
		type: "select",
		id: "folderId",
		placeholder: "폴더",
		props: {
			options: [
				{ label: "전체 폴더", value: "" },
				...folders.map((folder) => ({
					label: folder.name,
					value: folder.id,
				})),
			],
		},
	},
];

function buildAssetColumns({
	isRemoving,
	onClickDeleteAssetButton,
}: {
	isRemoving: boolean;
	onClickDeleteAssetButton: (assetId: string) => void;
}): MetaDataGridColumnConfig<AssetDto>[] {
	return [
		{
			field: "originalName",
			label: "파일명",
			size: 280,
			isRequired: true,
			cell: ({ row }) => (
				<Link
					href={`/assets/${(row.original as AssetDto).id}` as Route}
					className="text-primary hover:underline"
				>
					{(row.original as AssetDto).originalName}
				</Link>
			),
		},
		{
			field: "kind",
			label: "타입",
			size: 100,
			align: "center",
			cell: ({ row }) => {
				const kindValue = (row.original as AssetDto).kind;
				return (
					<Chip size="sm" variant="flat" color="secondary">
						{getKindLabel(kindValue)}
					</Chip>
				);
			},
		},
		{
			field: "status",
			label: "상태",
			size: 120,
			align: "center",
			cell: ({ row }) => {
				const statusValue = (row.original as AssetDto).status;
				return (
					<Chip size="sm" variant="flat" color={getStatusColor(statusValue)}>
						{getStatusLabel(statusValue)}
					</Chip>
				);
			},
		},
		{
			field: "mimeType",
			label: "MIME",
			size: 180,
			cell: ({ getValue }) => (
				<span className="font-mono text-xs">{getValue() as string}</span>
			),
		},
		{
			field: "sizeBytes",
			label: "크기",
			size: 120,
			align: "right",
			cell: ({ getValue }) => formatBytes(getValue() as number),
		},
		{
			field: "createdAt",
			label: "등록일",
			size: 150,
			cell: ({ getValue }) => <DateTimeCell value={getValue() as string} />,
		},
		{
			field: "id",
			label: "액션",
			size: 100,
			align: "center",
			cell: ({ row }) => (
				<Button
					size="sm"
					variant="flat"
					color="danger"
					isLoading={isRemoving}
					startContent={<Trash2 className="h-4 w-4" />}
					onPress={() =>
						onClickDeleteAssetButton((row.original as AssetDto).id)
					}
				>
					삭제
				</Button>
			),
		},
	];
}

const AssetsPageContent = observer(function AssetsPageContent({
	queryStates,
	setQueryStates,
	isRemoving,
	onClickDeleteAssetButton,
}: {
	queryStates: ReturnType<typeof useMetaDataGridQueryStates>[0];
	setQueryStates: ReturnType<typeof useMetaDataGridQueryStates>[1];
	isRemoving: boolean;
	onClickDeleteAssetButton: (assetId: string) => void;
}) {
	const take = queryStates.take;
	const skip = queryStates.skip;
	const search = queryStates.search || undefined;
	const kind = (queryStates.kind || undefined) as AssetKind | undefined;
	const status = (queryStates.status || undefined) as AssetStatus | undefined;
	const folderId = queryStates.folderId || undefined;

	const { data: response } = useGetAssetsSuspense({
		take,
		skip,
		search,
		kind,
		status,
		folderId,
	});
	const { data: folderResponse } = useGetFoldersSuspense();

	const assets = (response?.data ?? []) as AssetDto[];
	const totalCount = response?.meta?.total ?? 0;
	const folders = (folderResponse?.data ?? []) as FolderDto[];
	const columns = buildAssetColumns({
		isRemoving,
		onClickDeleteAssetButton,
	});

	return (
		<SectionSurface padding="none">
			<MetaDataGrid
				config={{
					entity: "Asset",
					data: assets,
					totalCount,
					isLoading: false,
					queryStates,
					setQueryStates,
					columns,
					leftInputs: buildLeftInputsWithFolders(folders),
					emptyMessage: "등록된 에셋이 없습니다.",
				}}
			/>
		</SectionSurface>
	);
});

const AssetsPageClient = observer(function AssetsPageClient() {
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);
	const persistStore = usePersistStore();
	const isPersistStoreHydrated = persistStore?.isHydrated ?? false;
	const hasSelectedSpace = Boolean(persistStore?.spaceId);

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

	const onClickDeleteAssetButton = (assetId: string) => {
		removeAsset({ assetId });
	};

	const columns = buildAssetColumns({
		isRemoving,
		onClickDeleteAssetButton,
	});

	const renderGridSkeleton = () => (
		<SectionSurface padding="none">
			<MetaDataGrid
				config={{
					entity: "Asset",
					data: [],
					totalCount: 0,
					isLoading: true,
					queryStates,
					setQueryStates,
					columns,
					leftInputs: buildLeftInputsWithFolders([]),
					emptyMessage: "등록된 에셋이 없습니다.",
				}}
			/>
		</SectionSurface>
	);

	const renderSpaceEmptyState = () => (
		<SectionSurface>
			<EmptyState
				title="Space를 선택하면 에셋을 조회할 수 있습니다"
				description="상단 Space 선택기를 통해 관리하려는 공간을 먼저 선택해주세요."
				statusLabel="Space 미선택"
			/>
		</SectionSurface>
	);

	return (
		<Page
			top={
				<PageTitleBar
					title="에셋 관리"
					description="업로드된 에셋을 조회, 검색, 필터링하고 삭제할 수 있습니다."
					actions={
						<Button
							variant="flat"
							color="primary"
							startContent={<Upload className="h-4 w-4" />}
							isDisabled
						>
							업로드 (준비 중)
						</Button>
					}
				/>
			}
		>
			{!isPersistStoreHydrated
				? <PageSurface>{renderGridSkeleton()}</PageSurface>
				: !hasSelectedSpace
					? <PageSurface>{renderSpaceEmptyState()}</PageSurface>
					: (
						<PageSurface>
							<Suspense fallback={renderGridSkeleton()}>
								<AssetsPageContent
									queryStates={queryStates}
									setQueryStates={setQueryStates}
									isRemoving={isRemoving}
									onClickDeleteAssetButton={onClickDeleteAssetButton}
								/>
							</Suspense>
						</PageSurface>
					)}
		</Page>
	);
});

export default AssetsPageClient;
