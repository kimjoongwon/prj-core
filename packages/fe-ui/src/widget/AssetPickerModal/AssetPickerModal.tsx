"use client";

import {
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Spinner,
	cn,
} from "@heroui/react";
import { Search } from "lucide-react";
import { MediaThumbnail } from "../MediaThumbnail";

export interface AssetPickerItem {
	id: string;
	originalName: string;
	mimeType: string;
	publicUrl?: string | null;
}

export interface AssetPickerModalProps {
	title: string;
	isOpen: boolean;
	isLoading: boolean;
	searchValue: string;
	selectedAssetId?: string;
	assets: AssetPickerItem[];
	emptyMessage: string;
	onClose: () => void;
	onChangeSearchValue: (value: string) => void;
	onSelectAsset: (asset: AssetPickerItem) => void;
}

export function AssetPickerModal({
	title,
	isOpen,
	isLoading,
	searchValue,
	selectedAssetId,
	assets,
	emptyMessage,
	onClose,
	onChangeSearchValue,
	onSelectAsset,
}: AssetPickerModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="4xl"
			scrollBehavior="inside"
		>
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalBody className="pb-6">
					<Input
						placeholder="에셋 이름으로 검색하세요."
						value={searchValue}
						onValueChange={onChangeSearchValue}
						startContent={<Search className="h-4 w-4 text-default-400" />}
					/>
					{isLoading ? (
						<div className="flex items-center justify-center gap-2 py-10 text-default-500">
							<Spinner size="sm" />
							<span>에셋을 불러오는 중...</span>
						</div>
					) : assets.length === 0 ? (
						<div className="rounded-xl border border-dashed border-default-300 px-4 py-10 text-center text-sm text-default-500">
							{emptyMessage}
						</div>
					) : (
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{assets.map((asset) => {
								const isSelected = asset.id === selectedAssetId;
								const isImage = asset.mimeType.startsWith("image/");
								return (
									<button
										key={asset.id}
										type="button"
										onClick={() => onSelectAsset(asset)}
										className={cn(
											"flex flex-col gap-3 rounded-2xl border bg-background p-3 text-left transition hover:border-primary/50 hover:bg-content1",
											isSelected
												? "border-primary bg-primary-50/40"
												: "border-default-200",
										)}
									>
										<MediaThumbnail
											imageUrl={isImage ? asset.publicUrl : undefined}
											videoUrl={!isImage ? asset.publicUrl : undefined}
											title={asset.originalName}
											className="aspect-video w-full"
										/>
										<div className="space-y-1">
											<p className="line-clamp-2 text-sm font-medium">
												{asset.originalName}
											</p>
											<p className="text-xs text-default-500">{asset.id}</p>
										</div>
										<div
											className={cn(
												"rounded-xl px-3 py-2 text-center text-sm font-medium",
												isSelected
													? "bg-primary text-primary-foreground"
													: "bg-default-100 text-default-700",
											)}
										>
											{isSelected ? "선택됨" : "이 에셋 사용"}
										</div>
									</button>
								);
							})}
						</div>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
