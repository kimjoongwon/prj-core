"use client";

import { Chip } from "@heroui/react";
import { Calendar, FileText, HardDrive, Hash, Image, User } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { AssetKind, AssetStatus } from "@cocrepo/prisma";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { VStack } from "../../ui/surfaces/VStack/VStack";
import { AssetKindBadge } from "../../ui/data-display/AssetKindBadge/AssetKindBadge";
import { AssetStatusBadge } from "../../ui/data-display/AssetStatusBadge/AssetStatusBadge";

/** 에셋 기본 정보 */
export interface AssetDetailPanelAsset {
	/** 에셋 ID */
	id: string;
	/** 원본 파일명 */
	originalName: string;
	/** 에셋 종류 */
	kind: AssetKind;
	/** 상태 */
	status: AssetStatus;
	/** MIME 타입 */
	mimeType: string;
	/** 확장자 */
	extension: string;
	/** 파일 크기 (바이트) */
	sizeBytes: bigint | number;
	/** 체크섬 */
	checksum?: string;
	/** 생성일 */
	createdAt: Date | string;
	/** 수정일 */
	updatedAt: Date | string;
	/** 생성자 */
	creator?: {
		id: string;
		name: string;
	} | null;
}

export interface AssetDetailPanelProps {
	/** 에셋 정보 */
	asset: AssetDetailPanelAsset;
	/** 타임스탬프 표시 여부 */
	showTimestamp?: boolean;
	/** 생성자 표시 여부 */
	showCreator?: boolean;
}

/**
 * 파일 크기를 읽기 쉬운 형태로 포맷팅
 */
const formatFileSize = (bytes: bigint | number): string => {
	const size = typeof bytes === "bigint" ? Number(bytes) : bytes;
	const units = ["B", "KB", "MB", "GB", "TB"];
	let unitIndex = 0;
	let sizeValue = size;

	while (sizeValue >= 1024 && unitIndex < units.length - 1) {
		sizeValue /= 1024;
		unitIndex++;
	}

	return `${sizeValue.toFixed(1)} ${units[unitIndex]}`;
};

/**
 * 날짜 포맷팅
 */
const formatDate = (date: Date | string): string => {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toLocaleDateString("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
};

/**
 * AssetDetailPanel 컴포넌트
 * 에셋의 기본 메타데이터를 테이블 형태로 표시합니다.
 *
 * @example
 * ```tsx
 * <AssetDetailPanel
 *   asset={{
 *     id: "asset-1",
 *     originalName: "hero-image.png",
 *     kind: "IMAGE",
 *     status: "READY",
 *     mimeType: "image/png",
 *     extension: "png",
 *     sizeBytes: 2400000,
 *     createdAt: new Date(),
 *     updatedAt: new Date(),
 *   }}
 *   showTimestamp
 *   showCreator
 * />
 * ```
 */
export const AssetDetailPanel = observer(
	({ asset, showTimestamp = true, showCreator = true }: AssetDetailPanelProps) => {
		return (
			<VStack gap={4} className="w-full">
				{/* 헤더 */}
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">기본 정보</h3>
					<HStack gap={2}>
						<AssetKindBadge kind={asset.kind} />
						<AssetStatusBadge status={asset.status} />
					</HStack>
				</div>

				{/* 메타데이터 테이블 */}
				<VStack gap={3} className="rounded-lg bg-content2 p-4">
					{/* 파일명 */}
					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<FileText className="size-4" />
							<span className="text-sm">파일명</span>
						</HStack>
						<span className="font-medium">{asset.originalName}</span>
					</HStack>

					{/* MIME 타입 */}
					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<Image className="size-4" />
							<span className="text-sm">MIME</span>
						</HStack>
						<Chip size="sm" variant="flat">
							{asset.mimeType}
						</Chip>
					</HStack>

					{/* 파일 크기 */}
					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<HardDrive className="size-4" />
							<span className="text-sm">크기</span>
						</HStack>
						<span className="font-medium">{formatFileSize(asset.sizeBytes)}</span>
					</HStack>

					{/* 체크섬 */}
					{asset.checksum && (
						<HStack justifyContent="between" className="w-full">
							<HStack gap={2} className="text-default-500">
								<Hash className="size-4" />
								<span className="text-sm">체크섬</span>
							</HStack>
							<span className="truncate font-mono text-xs text-default-600">
								{asset.checksum.substring(0, 16)}...
							</span>
						</HStack>
					)}

					{/* 생성일/수정일 */}
					{showTimestamp && (
						<>
							<HStack justifyContent="between" className="w-full">
								<HStack gap={2} className="text-default-500">
									<Calendar className="size-4" />
									<span className="text-sm">생성일</span>
								</HStack>
								<span className="text-sm text-default-600">
									{formatDate(asset.createdAt)}
								</span>
							</HStack>

							<HStack justifyContent="between" className="w-full">
								<HStack gap={2} className="text-default-500">
									<Calendar className="size-4" />
									<span className="text-sm">수정일</span>
								</HStack>
								<span className="text-sm text-default-600">
									{formatDate(asset.updatedAt)}
								</span>
							</HStack>
						</>
					)}

					{/* 생성자 */}
					{showCreator && asset.creator && (
						<HStack justifyContent="between" className="w-full">
							<HStack gap={2} className="text-default-500">
								<User className="size-4" />
								<span className="text-sm">생성자</span>
							</HStack>
							<span className="text-sm text-default-600">{asset.creator.name}</span>
						</HStack>
					)}
				</VStack>
			</VStack>
		);
	},
);

AssetDetailPanel.displayName = "AssetDetailPanel";
