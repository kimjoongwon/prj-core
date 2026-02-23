"use client";

import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { renderLucideIcon } from "../../../utils/iconUtils";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import type { AssetDetailHeaderProps, BreadcrumbItem } from "./types";

/**
 * AssetDetailHeader Feature 컴포넌트
 * Asset 상세 페이지의 상단 헤더를 담당합니다.
 * 브레드크럼, 제목, 액션 버튼(수정/삭제)을 관리합니다.
 *
 * @example
 * ```tsx
 * <AssetDetailHeader
 *   asset={asset}
 *   breadcrumbItems={[
 *     { label: '에셋', href: '/assets' },
 *     { label: '폴더명', href: '/assets?folderId=xxx' },
 *     { label: '파일명' },
 *   ]}
 *   onEdit={() => router.push(`/assets/${assetId}/edit`)}
 *   onDelete={() => deleteMutation.mutate()}
 * />
 * ```
 */
export const AssetDetailHeader = observer((props: AssetDetailHeaderProps) => {
	const {
		asset,
		breadcrumbItems,
		onEdit,
		onDelete,
		onDownload,
		isDeleting = false,
		className,
	} = props;

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const handleEditClick = () => {
		onEdit();
	};

	const handleDeleteClick = () => {
		setIsDeleteModalOpen(true);
	};

	const handleConfirmDelete = () => {
		setIsDeleteModalOpen(false);
		onDelete();
	};

	const handleDownloadClick = () => {
		onDownload?.();
	};

	const handleCancelDelete = () => {
		setIsDeleteModalOpen(false);
	};

	return (
		<>
			<div className={className}>
				{/* Header Row: Breadcrumb + Actions */}
				<HStack gap={4} className="items-center justify-between">
					{/* Breadcrumb */}
					<nav className="flex items-center gap-2 text-sm text-default-500">
						{breadcrumbItems.map((item, index) => (
							<span key={`${item.label}-${index}`} className="flex items-center gap-2">
								{index > 0 && <span className="text-default-300">/</span>}
								{item.href ? (
									<a
										href={item.href}
										className="transition-colors hover:text-primary"
									>
										{item.label}
									</a>
								) : (
									<span className="font-medium text-foreground">
										{item.label}
									</span>
								)}
							</span>
						))}
					</nav>

					{/* Actions */}
					<HStack gap={2}>
						<Button
							variant="flat"
							color="primary"
							startContent={renderLucideIcon("Pencil", "h-4 w-4", 16)}
							onPress={handleEditClick}
						>
							수정
						</Button>
						<Button
							variant="flat"
							color="danger"
							startContent={renderLucideIcon("Trash2", "h-4 w-4", 16)}
							onPress={handleDeleteClick}
							isDisabled={isDeleting}
						>
							{isDeleting ? "삭제 중..." : "삭제"}
						</Button>
					</HStack>
				</HStack>
			</div>

			{/* Delete Confirmation Modal */}
			<Modal isOpen={isDeleteModalOpen} onClose={handleCancelDelete}>
				<ModalContent>
					<ModalHeader>에셋 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>"{asset.originalName}"</strong> 에셋을 삭제하시겠습니까?
						</p>
						<p className="text-sm text-default-500">
							이 작업은 되돌릴 수 없습니다.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={handleCancelDelete}>
							취소
						</Button>
						<Button
							color="danger"
							onPress={handleConfirmDelete}
							isLoading={isDeleting}
						>
							삭제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
});

AssetDetailHeader.displayName = "AssetDetailHeader";
