"use client";

import { Button, Spinner, cn } from "@cocrepo/ui/heroui";
import {
	ChevronRight,
	Folder,
	FolderOpen,
	Pencil,
	Plus,
	Trash2,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useT } from "../../i18n";

export interface FolderTreeItem {
	id: string;
	name: string;
	parentFolderId?: string | null;
}

export interface FolderTreeProps {
	folders: FolderTreeItem[];
	selectedFolderId?: string | null;
	expandedFolderIds?: Set<string>;
	showCreateButton?: boolean;
	showRenameButton?: boolean;
	showDeleteButton?: boolean;
	onSelect?: (folder: FolderTreeItem | null) => void;
	onExpand?: (folderId: string) => void;
	onCollapse?: (folderId: string) => void;
	onCreate?: () => void;
	onRename?: (folder: FolderTreeItem) => void;
	onDelete?: (folder: FolderTreeItem) => void;
	isLoading?: boolean;
	className?: string;
}

interface FolderTreeNode extends FolderTreeItem {
	children: FolderTreeNode[];
}

interface FolderTreeNodeItemProps {
	node: FolderTreeNode;
	depth: number;
	selectedFolderId: string | null;
	expandedFolderIds: Set<string>;
	onSelect?: (folder: FolderTreeItem | null) => void;
	onToggleExpand: (folderId: string, isExpanded: boolean) => void;
}

const ROOT_LABEL = "전체 폴더";

const sortNodes = (nodes: FolderTreeNode[]) => {
	nodes.sort((left, right) => left.name.localeCompare(right.name, "ko"));

	for (const node of nodes) {
		if (node.children.length > 0) {
			sortNodes(node.children);
		}
	}

	return nodes;
};

const buildFolderTree = (folders: FolderTreeItem[]) => {
	const nodeById = new Map<string, FolderTreeNode>();
	const rootNodes: FolderTreeNode[] = [];

	for (const folder of folders) {
		nodeById.set(folder.id, {
			...folder,
			children: [],
		});
	}

	for (const folder of folders) {
		const node = nodeById.get(folder.id);
		const parentId = folder.parentFolderId ?? null;
		const parentNode = parentId ? nodeById.get(parentId) : undefined;

		if (!node) {
			continue;
		}

		if (parentNode) {
			parentNode.children.push(node);
			continue;
		}

		rootNodes.push(node);
	}

	return sortNodes(rootNodes);
};

const collectAncestorIds = (
	folders: FolderTreeItem[],
	selectedFolderId: string | null,
) => {
	if (!selectedFolderId) {
		return [];
	}

	const parentById = new Map<string, string | null>();
	for (const folder of folders) {
		parentById.set(folder.id, folder.parentFolderId ?? null);
	}

	const ancestorIds: string[] = [];
	let currentParentId = parentById.get(selectedFolderId) ?? null;

	while (currentParentId) {
		ancestorIds.unshift(currentParentId);
		currentParentId = parentById.get(currentParentId) ?? null;
	}

	return ancestorIds;
};

const mergeExpandedFolderIds = (base: Set<string>, folderIds: string[]) => {
	const next = new Set(base);
	for (const folderId of folderIds) {
		next.add(folderId);
	}
	return next;
};

const FolderTreeNodeItem = observer(
	({
		node,
		depth,
		selectedFolderId,
		expandedFolderIds,
		onSelect,
		onToggleExpand,
	}: FolderTreeNodeItemProps) => {
		const t = useT();
		const hasChildren = node.children.length > 0;
		const isExpanded = expandedFolderIds.has(node.id);
		const isSelected = selectedFolderId === node.id;

		const handleSelect = () => {
			onSelect?.(node);
		};

		const handleToggleExpand = () => {
			if (!hasChildren) {
				return;
			}

			onToggleExpand(node.id, isExpanded);
		};

		return (
			<div>
				<div
					className="flex items-center gap-1"
					style={{ paddingLeft: `${depth * 16}px` }}
				>
					<button
						type="button"
						onClick={handleToggleExpand}
						className={cn(
							"flex h-8 w-8 items-center justify-center rounded-md text-foreground/50 transition-colors",
							hasChildren
								? "hover:bg-default-100 hover:text-foreground"
								: "cursor-default opacity-40",
						)}
						aria-label={
							hasChildren
								? t("{{folderName}} {{action}}", undefined, {
										folderName: node.name,
										action: t(isExpanded ? "축소" : "확장"),
									})
								: t("{{folderName}} 폴더", undefined, {
										folderName: node.name,
									})
						}
						disabled={!hasChildren}
					>
						{hasChildren ? (
							<ChevronRight
								className={cn(
									"h-4 w-4 transition-transform duration-200",
									isExpanded && "rotate-90",
								)}
							/>
						) : (
							<span className="h-4 w-4" />
						)}
					</button>
					<button
						type="button"
						onClick={handleSelect}
						className={cn(
							"flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors",
							isSelected
								? "bg-primary/10 font-medium text-primary"
								: "text-foreground/70 hover:bg-default-100 hover:text-foreground",
						)}
					>
						{hasChildren && isExpanded ? (
							<FolderOpen className="h-4 w-4 shrink-0" />
						) : (
							<Folder className="h-4 w-4 shrink-0" />
						)}
						<span className="truncate">{node.name}</span>
					</button>
				</div>
				{hasChildren && isExpanded ? (
					<div className="mt-1 flex flex-col gap-1">
						{node.children.map((childNode) => (
							<FolderTreeNodeItem
								key={childNode.id}
								node={childNode}
								depth={depth + 1}
								selectedFolderId={selectedFolderId}
								expandedFolderIds={expandedFolderIds}
								onSelect={onSelect}
								onToggleExpand={onToggleExpand}
							/>
						))}
					</div>
				) : null}
			</div>
		);
	},
);

FolderTreeNodeItem.displayName = "FolderTreeNodeItem";

export const FolderTree = observer(
	({
		folders,
		selectedFolderId = null,
		expandedFolderIds,
		showCreateButton = false,
		showRenameButton = false,
		showDeleteButton = false,
		onSelect,
		onExpand,
		onCollapse,
		onCreate,
		onRename,
		onDelete,
		isLoading = false,
		className,
	}: FolderTreeProps) => {
		const t = useT();
		const [internalExpandedFolderIds, setInternalExpandedFolderIds] = useState(
			new Set<string>(),
		);

		useEffect(() => {
			if (expandedFolderIds) {
				return;
			}

			const ancestorIds = collectAncestorIds(folders, selectedFolderId);
			if (ancestorIds.length === 0) {
				return;
			}

			setInternalExpandedFolderIds((previous) =>
				mergeExpandedFolderIds(previous, ancestorIds),
			);
		}, [expandedFolderIds, folders, selectedFolderId]);

		const treeNodes = buildFolderTree(folders);
		const resolvedExpandedFolderIds =
			expandedFolderIds ?? internalExpandedFolderIds;
		const selectedFolder = selectedFolderId
			? (folders.find((folder) => folder.id === selectedFolderId) ?? null)
			: null;

		const handleSelectRoot = () => {
			onSelect?.(null);
		};

		const handleToggleExpand = (folderId: string, isExpanded: boolean) => {
			if (isExpanded) {
				onCollapse?.(folderId);
				if (expandedFolderIds) {
					return;
				}

				setInternalExpandedFolderIds((previous) => {
					const next = new Set(previous);
					next.delete(folderId);
					return next;
				});
				return;
			}

			onExpand?.(folderId);
			if (expandedFolderIds) {
				return;
			}

			setInternalExpandedFolderIds((previous) => {
				const next = new Set(previous);
				next.add(folderId);
				return next;
			});
		};

		const handleCreate = () => {
			onCreate?.();
		};

		const handleRename = () => {
			if (!selectedFolder) {
				return;
			}

			onRename?.(selectedFolder);
		};

		const handleDelete = () => {
			if (!selectedFolder) {
				return;
			}

			onDelete?.(selectedFolder);
		};

		return (
			<div
				className={cn(
					"flex h-full min-h-[320px] flex-col bg-content1/40",
					className,
				)}
			>
				<div className="flex items-center justify-between border-b border-divider px-4 py-3">
					<div>
						<p className="text-sm font-semibold text-foreground">{t("폴더")}</p>
						<p className="text-xs text-default-500">{t("에셋 탐색 기준")}</p>
					</div>
					<div className="flex items-center gap-1">
						{showRenameButton ? (
							<Button
								isIconOnly
								size="sm"
								variant="flat"
								color="default"
								aria-label={t("폴더 이름 변경")}
								onPress={handleRename}
								isDisabled={!selectedFolder || !onRename}
							>
								<Pencil className="h-4 w-4" />
							</Button>
						) : null}
						{showDeleteButton ? (
							<Button
								isIconOnly
								size="sm"
								variant="flat"
								color="danger"
								aria-label={t("폴더 삭제")}
								onPress={handleDelete}
								isDisabled={!selectedFolder || !onDelete}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						) : null}
						{showCreateButton ? (
							<Button
								size="sm"
								variant="flat"
								color="default"
								startContent={<Plus className="h-4 w-4" />}
								onPress={handleCreate}
								isDisabled={!onCreate}
							>
								{t("폴더 생성")}
							</Button>
						) : null}
					</div>
				</div>

				<div className="flex-1 overflow-y-auto p-3">
					{isLoading ? (
						<div className="flex h-full min-h-[240px] items-center justify-center">
							<Spinner size="sm" />
						</div>
					) : (
						<div className="flex flex-col gap-1">
							<button
								type="button"
								onClick={handleSelectRoot}
								className={cn(
									"flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors",
									selectedFolderId === null
										? "bg-primary/10 font-medium text-primary"
										: "text-foreground/70 hover:bg-default-100 hover:text-foreground",
								)}
							>
								<FolderOpen className="h-4 w-4 shrink-0" />
								<span className="truncate">{t(ROOT_LABEL)}</span>
							</button>

							{treeNodes.length === 0 ? (
								<div className="rounded-lg border border-dashed border-divider px-3 py-6 text-center text-sm text-default-500">
									{t("등록된 폴더가 없습니다.")}
								</div>
							) : (
								treeNodes.map((node) => (
									<FolderTreeNodeItem
										key={node.id}
										node={node}
										depth={0}
										selectedFolderId={selectedFolderId}
										expandedFolderIds={resolvedExpandedFolderIds}
										onSelect={onSelect}
										onToggleExpand={handleToggleExpand}
									/>
								))
							)}
						</div>
					)}
				</div>
			</div>
		);
	},
);

FolderTree.displayName = "FolderTree";
