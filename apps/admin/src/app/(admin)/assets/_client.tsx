"use client";

import { useGetAssets, useGetFolderTree, type AssetDto } from "@cocrepo/api";
import { AssetBrowser } from "@cocrepo/ui";
import { PageSurface, SectionSurface, VStack } from "@cocrepo/ui";
import { Button, Tabs, Tab, Input, Select, SelectItem, Spinner } from "@heroui/react";
import { FolderPlus, Upload, Search } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";

/**
 * 에셋 목록 페이지 - 클라이언트 컴포넌트
 */
function AssetsPageClient() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const state = useLocalObservable(() => ({
		viewMode: "grid" as "grid" | "list",
		selectedFolderId: null as string | null,
		kind: undefined as "IMAGE" | "VIDEO" | "DOCUMENT" | undefined,
		search: "",
		page: 1,
		take: 20,

		setViewMode(mode: "grid" | "list") {
			this.viewMode = mode;
		},

		setSelectedFolderId(folderId: string | null) {
			this.selectedFolderId = folderId;
			this.page = 1;
		},

		setKind(kind: "IMAGE" | "VIDEO" | "DOCUMENT" | undefined) {
			this.kind = kind;
			this.page = 1;
		},

		setSearch(search: string) {
			this.search = search;
			this.page = 1;
		},

		setPage(page: number) {
			this.page = page;
		},
	}));

	// URL에서 초기값 읽기
	const initialFolderId = searchParams.get("folderId");
	const initialKind = searchParams.get("kind") as "IMAGE" | "VIDEO" | "DOCUMENT" | undefined;
	const initialSearch = searchParams.get("search") || "";

	// API 조회
	const { data: assetsResponse, isLoading: isLoadingAssets } = useGetAssets({
		take: state.take,
		skip: (state.page - 1) * state.take,
		folderId: state.selectedFolderId ?? initialFolderId ?? undefined,
		kind: state.kind ?? initialKind,
		search: state.search || initialSearch || undefined,
	});

	const { data: folderTreeResponse, isLoading: isLoadingFolders } = useGetFolderTree();

	const assets = assetsResponse?.data ?? [];
	const folders = folderTreeResponse?.data ?? [];
	const meta = assetsResponse?.meta;
	const totalCount = meta?.total ?? 0;

	/**
	 * 에셋 상세 페이지로 이동
	 */
	const onClickAsset = (asset: AssetDto) => {
		router.push(`/assets/${asset.id}` as Route);
	};

	/**
	 * 업로드 페이지로 이동
	 */
	const onClickUploadButton = () => {
		router.push("/assets/new" as Route);
	};

	/**
	 * 타입 필터 변경
	 */
	const onChangeKindFilter = (kind: "IMAGE" | "VIDEO" | "DOCUMENT" | undefined) => {
		state.setKind(kind);
	};

	/**
	 * 검색어 변경
	 */
	const onChangeSearch = (value: string) => {
		state.setSearch(value);
	};

	/**
	 * 폴더 선택
	 */
	const onSelectFolder = (folderId: string | null) => {
		state.setSelectedFolderId(folderId);
	};

	// 로딩 상태
	if (isLoadingAssets && assets.length === 0) {
		return (
			<PageSurface title="에셋" description="미디어 리소스를 관리합니다.">
				<div className="flex items-center justify-center p-8 gap-2">
					<Spinner size="sm" />
					<span className="text-default-500">로딩 중...</span>
				</div>
			</PageSurface>
		);
	}

	return (
		<PageSurface
			title="에셋"
			description="미디어 리소스를 관리합니다."
			actions={
				<div className="flex gap-2">
					<Button
						variant="flat"
						startContent={<FolderPlus className="h-4 w-4" />}
					>
						폴더 생성
					</Button>
					<Button
						color="primary"
						startContent={<Upload className="h-4 w-4" />}
						onPress={onClickUploadButton}
					>
						업로드
					</Button>
				</div>
			}
		>
			<VStack gap={4}>
				{/* 툴바 */}
				<SectionSurface>
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						{/* 검색 */}
						<Input
							placeholder="파일명으로 검색..."
							startContent={<Search className="h-4 w-4 text-default-400" />}
							value={state.search}
							onValueChange={onChangeSearch}
							className="w-full md:w-80"
							isClearable
						/>

						{/* 필터 */}
						<div className="flex gap-2">
							<Select
								placeholder="타입 필터"
								selectedKeys={state.kind ? [state.kind] : []}
								onSelectionChange={(keys) => {
									const kind = Array.from(keys)[0] as "IMAGE" | "VIDEO" | "DOCUMENT" | undefined;
									state.setKind(kind);
								}}
								className="w-32"
							>
								<SelectItem key="IMAGE">이미지</SelectItem>
								<SelectItem key="VIDEO">비디오</SelectItem>
								<SelectItem key="DOCUMENT">문서</SelectItem>
							</Select>
						</div>
					</div>
				</SectionSurface>

				{/* 메인 콘텐츠 */}
				<div className="flex gap-4">
					{/* 좌측 폴더 트리 */}
					<SectionSurface className="w-64 hidden md:block" padding="sm">
						<h3 className="text-sm font-semibold mb-2 px-2">폴더</h3>
						<div className="space-y-1">
							<button
								type="button"
								onClick={() => onSelectFolder(null)}
								className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${
									state.selectedFolderId === null
										? "bg-primary/10 text-primary"
										: "hover:bg-content2"
								}`}
							>
								전체 에셋
							</button>
							{folders.map((folder) => (
								<button
									key={folder.id}
									type="button"
									onClick={() => onSelectFolder(folder.id)}
									className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${
										state.selectedFolderId === folder.id
											? "bg-primary/10 text-primary"
											: "hover:bg-content2"
									}`}
								>
									{folder.name}
								</button>
							))}
						</div>
					</SectionSurface>

					{/* 우측 에셋 그리드 */}
					<SectionSurface className="flex-1" padding="none">
						<AssetBrowser
							assets={assets as never[]}
							isLoading={isLoadingAssets}
							onAssetClick={onClickAsset as never}
							initialFolderId={state.selectedFolderId}
						/>
					</SectionSurface>
				</div>
			</VStack>
		</PageSurface>
	);
}

export default observer(AssetsPageClient);
