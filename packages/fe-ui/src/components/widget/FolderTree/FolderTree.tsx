"use client";

import { Button } from "@heroui/react";
import { cn } from "@heroui/react";
import { ChevronRight, Folder, FolderOpen, FolderPlus, MoreHorizontal } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { VStack } from "../../ui/surfaces/VStack/VStack";

/**
 * FolderTree용 폴더 노드 타입
 */
export interface FolderTreeNode {
	id: string;
	name: string;
	path: string;
	parentId?: string | null;
	children?: FolderTreeNode[];
}

export interface FolderTreeProps {
	/** 폴더 목록 (계층 구조) */
	folders: FolderTreeNode[];
	/** 선택된 폴더 ID */
	selectedFolderId?: string | null;
	/** 확장된 폴더 ID Set */
	expandedFolderIds?: Set<string>;
	/** 폴더 생성 버튼 표시 */
	showCreateButton?: boolean;
	/** 컨텍스트 메뉴 표시 */
	showContextMenu?: boolean;
	/** 폴더 선택 핸들러 */
	onSelect?: (folder: FolderTreeNode) => void;
	/** 폴더 확장 핸들러 */
	onExpand?: (folderId: string) => void;
	/** 폴더 축소 핸들러 */
	onCollapse?: (folderId: string) => void;
	/** 폴더 생성 핸들러 */
	onCreate?: (parentId: string | null, name: string) => void;
	/** 이름 변경 핸들러 */
	onRename?: (folder: FolderTreeNode, newName: string) => void;
	/** 폴더 삭제 핸들러 */
	onDelete?: (folder: FolderTreeNode) => void;
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 추가 클래스명 */
	className?: string;
}

interface FolderNodeProps {
	folder: FolderTreeNode;
	level: number;
	selectedFolderId?: string | null;
	expandedFolderIds: Set<string>;
	onSelect?: (folder: FolderTreeNode) => void;
	onExpand?: (folderId: string) => void;
	onCollapse?: (folderId: string) => void;
	onRename?: (folder: FolderTreeNode, newName: string) => void;
	onDelete?: (folder: FolderTreeNode) => void;
	showContextMenu?: boolean;
}

/**
 * 폴더 노드 컴포넌트
 */
const FolderNode = observer(
	({
		folder,
		level,
		selectedFolderId,
		expandedFolderIds,
		onSelect,
		onExpand,
		onCollapse,
		onRename,
		onDelete,
		showContextMenu,
	}: FolderNodeProps) => {
		const hasChildren = folder.children && folder.children.length > 0;
		const isExpanded = expandedFolderIds.has(folder.id);
		const isSelected = selectedFolderId === folder.id;

		const handleToggle = (e: React.MouseEvent) => {
			e.stopPropagation();
			if (isExpanded) {
				onCollapse?.(folder.id);
			} else {
				onExpand?.(folder.id);
			}
		};

		const handleSelect = () => {
			onSelect?.(folder);
		};

		return (
			<div>
				<div
					className={cn(
						"group flex items-center gap-1 rounded-lg px-2 py-2 cursor-pointer",
						"transition-colors duration-150",
						isSelected
							? "bg-primary/10 text-primary"
							: "hover:bg-content2 text-foreground/80",
					)}
					style={{ paddingLeft: `${level * 20 + 8}px` }}
					onClick={handleSelect}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleSelect();
					}}
				>
					{/* 확장/축소 버튼 */}
					{hasChildren ? (
						<button
							type="button"
							onClick={handleToggle}
							className="p-0.5 hover:bg-content2 rounded"
						>
							<ChevronRight
								className={cn(
									"w-4 h-4 text-default-400 transition-transform duration-200",
									isExpanded && "rotate-90",
								)}
							/>
						</button>
					) : (
						<span className="w-5" />
					)}

					{/* 폴더 아이콘 */}
					{isSelected ? (
						<FolderOpen className="w-4 h-4 text-primary shrink-0" />
					) : (
						<Folder className="w-4 h-4 text-warning shrink-0" />
					)}

					{/* 폴더명 */}
					<span className="text-sm truncate flex-1">{folder.name}</span>

					{/* 컨텍스트 메뉴 */}
					{showContextMenu && onDelete && (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								onDelete(folder);
							}}
							className="p-1 opacity-0 group-hover:opacity-100 hover:bg-danger/10 rounded transition-opacity"
						>
							<MoreHorizontal className="w-3 h-3 text-default-400" />
						</button>
					)}
				</div>

				{/* 하위 폴더 */}
				{isExpanded && hasChildren && (
					<div>
						{folder.children!.map((child) => (
							<FolderNode
								key={child.id}
								folder={child}
								level={level + 1}
								selectedFolderId={selectedFolderId}
								expandedFolderIds={expandedFolderIds}
								onSelect={onSelect}
								onExpand={onExpand}
								onCollapse={onCollapse}
								onRename={onRename}
								onDelete={onDelete}
								showContextMenu={showContextMenu}
							/>
						))}
					</div>
				)}
			</div>
		);
	},
);

FolderNode.displayName = "FolderNode";

/**
 * FolderTree Widget 컴포넌트
 *
 * 폴더 계층 구조를 트리 형태로 표시하는 순수 UI 컴포넌트입니다.
 * 확장/축소, 선택, 폴더 생성 기능을 지원합니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <FolderTree
 *   folders={folders}
 *   selectedFolderId={selectedId}
 *   expandedFolderIds={expandedIds}
 *   onSelect={handleSelect}
 *   onExpand={handleExpand}
 *   onCollapse={handleCollapse}
 * />
 * ```
 */
export const FolderTree = observer(
	({
		folders,
		selectedFolderId,
		expandedFolderIds = new Set(),
		showCreateButton = true,
		showContextMenu = false,
		onSelect,
		onExpand,
		onCollapse,
		onCreate,
		onRename,
		onDelete,
		isLoading,
		className,
	}: FolderTreeProps) => {
		const [isCreating, setIsCreating] = useState(false);

		const handleCreateClick = () => {
			if (onCreate) {
				setIsCreating(true);
				// 간단한 프롬프트 (실제로는 모달 사용 권장)
				const name = prompt("폴더명을 입력하세요");
				if (name) {
					onCreate(selectedFolderId ?? null, name);
				}
				setIsCreating(false);
			}
		};

		return (
			<div className={cn("flex flex-col h-full bg-content1", className)}>
				{/* 헤더 */}
				<HStack
					justifyContent="between"
					alignItems="center"
					className="px-3 py-3 border-b border-divider"
				>
					<span className="text-sm font-medium">폴더</span>
					{showCreateButton && onCreate && (
						<Button
							size="sm"
							variant="light"
							isIconOnly
							onPress={handleCreateClick}
							isDisabled={isCreating || isLoading}
							aria-label="폴더 생성"
						>
							<FolderPlus className="w-4 h-4" />
						</Button>
					)}
				</HStack>

				{/* 트리 영역 */}
				<VStack gap={0} className="flex-1 overflow-y-auto py-2">
					{folders.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-default-400 py-8">
							<Folder className="w-8 h-8 mb-2" />
							<span className="text-sm">폴더가 없습니다</span>
						</div>
					) : (
						folders.map((folder) => (
							<FolderNode
								key={folder.id}
								folder={folder}
								level={0}
								selectedFolderId={selectedFolderId}
								expandedFolderIds={expandedFolderIds}
								onSelect={onSelect}
								onExpand={onExpand}
								onCollapse={onCollapse}
								onRename={onRename}
								onDelete={onDelete}
								showContextMenu={showContextMenu}
							/>
						))
					)}
				</VStack>
			</div>
		);
	},
);

FolderTree.displayName = "FolderTree";
