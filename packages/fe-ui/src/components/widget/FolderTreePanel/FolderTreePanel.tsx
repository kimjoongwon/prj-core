"use client";

import { Button } from "@heroui/react";
import { ChevronRight, Folder, FolderPlus, FolderOpen, MoreHorizontal } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { VStack } from "../../ui/surfaces/VStack/VStack";

/**
 * 폴더 트리 아이템 타입
 */
export interface FolderTreeItem {
	id: string;
	name: string;
	path: string;
	parentId?: string | null;
	children?: FolderTreeItem[];
}

export interface FolderTreePanelProps {
	/** 폴더 목록 (계층 구조) */
	folders: FolderTreeItem[];
	/** 선택된 폴더 ID */
	selectedFolderId?: string | null;
	/** 확장된 폴더 ID Set */
	expandedFolderIds: Set<string>;
	/** 폴더 선택 핸들러 */
	onSelect: (folderId: string) => void;
	/** 폴더 확장 핸들러 */
	onExpand: (folderId: string) => void;
	/** 폴더 축소 핸들러 */
	onCollapse: (folderId: string) => void;
	/** 폴더 생성 핸들러 */
	onCreate?: (parentId: string | null, name: string) => void;
	/** 폴더 이름 변경 핸들러 */
	onRename?: (folder: FolderTreeItem, newName: string) => void;
	/** 폴더 삭제 핸들러 */
	onDelete?: (folder: FolderTreeItem) => void;
	/** 폴더 생성 버튼 표시 여부 */
	showCreateButton?: boolean;
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 패널 너비 */
	width?: number;
	/** 추가 클래스명 */
	className?: string;
}

interface FolderNodeProps {
	folder: FolderTreeItem;
	level: number;
	selectedFolderId?: string | null;
	expandedFolderIds: Set<string>;
	onSelect: (folderId: string) => void;
	onExpand: (folderId: string) => void;
	onCollapse: (folderId: string) => void;
	onRename?: (folder: FolderTreeItem, newName: string) => void;
	onDelete?: (folder: FolderTreeItem) => void;
}

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
	}: FolderNodeProps) => {
		const hasChildren = folder.children && folder.children.length > 0;
		const isExpanded = expandedFolderIds.has(folder.id);
		const isSelected = selectedFolderId === folder.id;

		const handleToggle = (e: React.MouseEvent) => {
			e.stopPropagation();
			if (isExpanded) {
				onCollapse(folder.id);
			} else {
				onExpand(folder.id);
			}
		};

		const handleSelect = () => {
			onSelect(folder.id);
		};

		return (
			<div>
				<div
					className={`
						flex items-center gap-1 rounded-lg px-2 py-2 cursor-pointer
						transition-colors duration-150
						${isSelected ? "bg-primary/10 text-primary" : "hover:bg-content2 text-foreground/80"}
					`}
					style={{ paddingLeft: `${level * 16 + 8}px` }}
					onClick={handleSelect}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleSelect();
					}}
				>
					{hasChildren ? (
						<button
							type="button"
							onClick={handleToggle}
							className="p-0.5 hover:bg-content2 rounded"
						>
							<ChevronRight
								className={`w-4 h-4 text-default-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
							/>
						</button>
					) : (
						<span className="w-5" />
					)}

					{isSelected ? (
						<FolderOpen className="w-4 h-4 text-primary shrink-0" />
					) : (
						<Folder className="w-4 h-4 text-warning shrink-0" />
					)}

					<span className="text-sm truncate flex-1">{folder.name}</span>

					{onDelete && (
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
 * FolderTreePanel Widget 컴포넌트
 *
 * 폴더 계층 구조를 트리 형태로 표시하는 순수 UI 컴포넌트입니다.
 * 확장/축소, 선택 기능을 지원합니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <FolderTreePanel
 *   folders={folders}
 *   selectedFolderId={selectedId}
 *   expandedFolderIds={expandedIds}
 *   onSelect={handleSelect}
 *   onExpand={handleExpand}
 *   onCollapse={handleCollapse}
 * />
 * ```
 */
export const FolderTreePanel = observer(
	({
		folders,
		selectedFolderId,
		expandedFolderIds,
		onSelect,
		onExpand,
		onCollapse,
		onCreate,
		showCreateButton = true,
		width = 240,
		className,
	}: FolderTreePanelProps) => {
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
			<aside
				className={`flex flex-col h-full border-r border-divider bg-content1 ${className ?? ""}`}
				style={{ width: `${width}px` }}
			>
				{/* 헤더 */}
				<HStack justifyContent="between" alignItems="center" className="px-3 py-3 border-b border-divider">
					<span className="text-sm font-medium">폴더</span>
					{showCreateButton && onCreate && (
						<Button
							size="sm"
							variant="light"
							isIconOnly
							onPress={handleCreateClick}
							isDisabled={isCreating}
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
							/>
						))
					)}
				</VStack>
			</aside>
		);
	},
);

FolderTreePanel.displayName = "FolderTreePanel";
