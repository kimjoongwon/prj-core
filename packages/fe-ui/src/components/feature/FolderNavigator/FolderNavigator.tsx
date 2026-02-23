"use client";

import { useAssetStore } from "@cocrepo/store";
import { cn } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { ChevronRight, Folder, FolderOpen, Home } from "lucide-react";
import { VStack } from "../../ui/surfaces/VStack/VStack";
import { HStack } from "../../ui/surfaces/HStack/HStack";

export interface FolderItem {
	/** 폴더 ID */
	id: string;
	/** 폴더 이름 */
	name: string;
	/** 상위 폴더 ID */
	parentId: string | null;
	/** 하위 폴더 목록 */
	children?: FolderItem[];
}

export interface FolderNavigatorProps {
	/** 폴더 트리 데이터 */
	folders?: FolderItem[];
	/** 폴더 생성 버튼 표시 여부 */
	showCreateButton?: boolean;
	/** 추가 CSS 클래스 */
	className?: string;
	/** 폴더 선택 핸들러 */
	onFolderSelect?: (folderId: string | null) => void;
	/** 폴더 생성 핸들러 */
	onCreateFolder?: (parentId: string | null) => void;
}

/**
 * FolderNavigator Feature 컴포넌트
 *
 * AssetStore의 currentFolderId와 연결된 폴더 탐색 컴포넌트입니다.
 * 폴더 트리와 브레드크럼을 표시합니다.
 *
 * **컴포넌트 계층:**
 * - Widget: FolderTree (순수 UI)
 * - Feature: FolderNavigator (Store 연결, 폴더 선택 로직)
 *
 * @example
 * ```tsx
 * <FolderNavigator
 *   folders={folderTreeData}
 *   onFolderSelect={handleFolderSelect}
 * />
 * ```
 */
export const FolderNavigator = observer(
	({
		folders = [],
		showCreateButton = true,
		className,
		onFolderSelect,
		onCreateFolder,
	}: FolderNavigatorProps) => {
		const assetStore = useAssetStore();
		const { currentFolderId } = assetStore;

		/**
		 * 폴더 선택 핸들러
		 */
		const handleFolderClick = (folderId: string | null) => {
			assetStore.setCurrentFolder(folderId);
			onFolderSelect?.(folderId);
		};

		/**
		 * 브레드크럼 경로 계산
		 */
		const getBreadcrumbPath = (): FolderItem[] => {
			if (!currentFolderId) return [];

			const path: FolderItem[] = [];
			let currentFolder = findFolderById(folders, currentFolderId);

			while (currentFolder) {
				path.unshift(currentFolder);
				currentFolder = currentFolder.parentId
					? findFolderById(folders, currentFolder.parentId)
					: null;
			}

			return path;
		};

		/**
		 * ID로 폴더 찾기
		 */
		const findFolderById = (items: FolderItem[], id: string): FolderItem | null => {
			for (const item of items) {
				if (item.id === id) return item;
				if (item.children) {
					const found = findFolderById(item.children, id);
					if (found) return found;
				}
			}
			return null;
		};

		/**
		 * 폴더 트리 렌더링
		 */
		const renderFolderTree = (items: FolderItem[], level = 0) => {
			return items.map((folder) => {
				const isActive = folder.id === currentFolderId;
				const hasChildren = folder.children && folder.children.length > 0;

				return (
					<VStack key={folder.id} gap={0}>
						<button
							type="button"
							onClick={() => handleFolderClick(folder.id)}
							className={cn(
								"flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
								isActive
									? "bg-primary/10 text-primary"
									: "text-foreground/70 hover:bg-default-100 hover:text-foreground",
							)}
							style={{ paddingLeft: `${12 + level * 16}px` }}
						>
							{isActive ? (
								<FolderOpen className="size-4 shrink-0" />
							) : (
								<Folder className="size-4 shrink-0" />
							)}
							<span className="truncate">{folder.name}</span>
							{hasChildren && (
								<ChevronRight className="ml-auto size-3 shrink-0 text-foreground/40" />
							)}
						</button>
						{folder.children && renderFolderTree(folder.children, level + 1)}
					</VStack>
				);
			});
		};

		const breadcrumbPath = getBreadcrumbPath();

		return (
			<VStack className={cn("h-full", className)} gap={0}>
				{/* 브레드크럼 */}
				<HStack className="border-b border-divider px-3 py-2" fullWidth gap={1}>
					<button
						type="button"
						onClick={() => handleFolderClick(null)}
						className={cn(
							"flex items-center gap-1 text-sm transition-colors",
							!currentFolderId
								? "text-primary"
								: "text-foreground/60 hover:text-foreground",
						)}
					>
						<Home className="size-3.5" />
						<span>루트</span>
					</button>
					{breadcrumbPath.map((folder, index) => (
						<HStack key={folder.id} gap={1}>
							<ChevronRight className="size-3 text-foreground/40" />
							<button
								type="button"
								onClick={() => handleFolderClick(folder.id)}
								className={cn(
									"text-sm transition-colors",
									index === breadcrumbPath.length - 1
										? "text-primary"
										: "text-foreground/60 hover:text-foreground",
								)}
							>
								{folder.name}
							</button>
						</HStack>
					))}
				</HStack>

				{/* 폴더 트리 */}
				<VStack className="flex-1 overflow-y-auto p-2" gap={0}>
					{/* 루트 폴더 버튼 */}
					<button
						type="button"
						onClick={() => handleFolderClick(null)}
						className={cn(
							"flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
							!currentFolderId
								? "bg-primary/10 text-primary"
								: "text-foreground/70 hover:bg-default-100 hover:text-foreground",
						)}
					>
						<Home className="size-4 shrink-0" />
						<span>모든 에셋</span>
					</button>

					{/* 폴더 목록 */}
					{renderFolderTree(folders)}
				</VStack>
			</VStack>
		);
	},
);

FolderNavigator.displayName = "FolderNavigator";
