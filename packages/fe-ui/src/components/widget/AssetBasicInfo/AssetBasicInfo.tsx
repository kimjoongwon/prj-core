"use client";

import { Button, Progress } from "@heroui/react";
import { Calendar, Download, FileText, FolderOpen, HardDrive, Move, Type } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { AssetStatus } from "../../ui/data-display/AssetStatusBadge";
import { AssetStatusBadge } from "../../ui/data-display/AssetStatusBadge";
import { SizeDisplay } from "../../ui/data-display/SizeDisplay/SizeDisplay";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { VStack } from "../../ui/surfaces/VStack/VStack";

/**
 * AssetBasicInfo용 에셋 타입
 */
export interface AssetBasicInfoItem {
	id: string;
	originalName: string;
	mimeType: string;
	sizeBytes: number;
	status: AssetStatus;
	folderId: string;
	folderPath?: string;
	createdAt: string | Date;
	updatedAt?: string | Date;
	uploadProgress?: number;
	errorMessage?: string;
}

export interface AssetBasicInfoProps {
	/** 에셋 데이터 */
	asset: AssetBasicInfoItem;
	/** 폴더 경로 */
	folderPath?: string;
	/** 다운로드 버튼 표시 */
	showDownload?: boolean;
	/** 폴더 이동 버튼 표시 */
	showMove?: boolean;
	/** 등록/수정일 표시 */
	showDates?: boolean;
	/** 다운로드 핸들러 */
	onDownload?: (asset: AssetBasicInfoItem) => void;
	/** 폴더 이동 핸들러 */
	onMove?: (asset: AssetBasicInfoItem) => void;
	/** 추가 클래스명 */
	className?: string;
}

/**
 * 날짜 포맷팅
 */
const formatDate = (date: string | Date): string => {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toLocaleDateString("ko-KR", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

/**
 * AssetBasicInfo Widget 컴포넌트
 *
 * 에셋의 기본 정보를 카드 형태로 표시하는 순수 UI 컴포넌트입니다.
 * 파일명, MIME 타입, 크기, 상태, 폴더 경로, 등록일 등을 보여줍니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <AssetBasicInfo
 *   asset={asset}
 *   showDownload
 *   showMove
 *   onDownload={handleDownload}
 *   onMove={handleMove}
 * />
 * ```
 */
export const AssetBasicInfo = observer(
	({
		asset,
		folderPath,
		showDownload = true,
		showMove = true,
		showDates = true,
		onDownload,
		onMove,
		className,
	}: AssetBasicInfoProps) => {
		const displayFolderPath = folderPath ?? asset.folderPath ?? "/";
		const isUploading = asset.status === "UPLOADING";
		const isFailed = asset.status === "FAILED";

		const handleDownload = () => {
			onDownload?.(asset);
		};

		const handleMove = () => {
			onMove?.(asset);
		};

		return (
			<VStack gap={0} className={`rounded-xl bg-content1 border border-divider ${className ?? ""}`}>
				{/* 헤더 */}
				<div className="px-4 py-3 border-b border-divider">
					<span className="text-sm font-medium">기본 정보</span>
				</div>

				{/* 정보 행들 */}
				<VStack gap={0} className="p-4">
					<InfoRow icon={<FileText className="w-4 h-4" />} label="파일명" value={asset.originalName} />
					<InfoRow icon={<Type className="w-4 h-4" />} label="MIME 타입" value={asset.mimeType} />
					<InfoRow icon={<HardDrive className="w-4 h-4" />} label="크기" value={<SizeDisplay bytes={asset.sizeBytes} />} />

					{/* 상태 (업로드 중이면 진행률 표시) */}
					<HStack gap={3} className="py-3 border-b border-divider">
						<HStack gap={2} className="w-[100px] text-default-500 shrink-0">
							<span className="text-sm">상태</span>
						</HStack>
						<VStack gap={1} className="flex-1">
							<AssetStatusBadge status={asset.status} />
							{isUploading && asset.uploadProgress !== undefined && (
								<Progress
									value={asset.uploadProgress}
									size="sm"
									className="w-full mt-1"
									color="primary"
								/>
							)}
							{isFailed && asset.errorMessage && (
								<span className="text-xs text-danger">{asset.errorMessage}</span>
							)}
						</VStack>
					</HStack>

					<InfoRow icon={<FolderOpen className="w-4 h-4" />} label="폴더" value={displayFolderPath} />

					{showDates && (
						<>
							<InfoRow
								icon={<Calendar className="w-4 h-4" />}
								label="등록일"
								value={formatDate(asset.createdAt)}
							/>
							{asset.updatedAt && (
								<InfoRow
									icon={<Calendar className="w-4 h-4" />}
									label="수정일"
									value={formatDate(asset.updatedAt)}
								/>
							)}
						</>
					)}
				</VStack>

				{/* 액션 버튼 */}
				{(showDownload || showMove) && (
					<HStack justifyContent="end" gap={2} className="px-4 py-3 border-t border-divider">
						{showDownload && (
							<Button
								size="sm"
								variant="flat"
								startContent={<Download className="w-4 h-4" />}
								onPress={handleDownload}
								isDisabled={isUploading}
							>
								다운로드
							</Button>
						)}
						{showMove && (
							<Button
								size="sm"
								variant="flat"
								startContent={<Move className="w-4 h-4" />}
								onPress={handleMove}
								isDisabled={isUploading}
							>
								폴더 이동
							</Button>
						)}
					</HStack>
				)}
			</VStack>
		);
	},
);

/** 정보 행 컴포넌트 */
interface InfoRowProps {
	icon: React.ReactNode;
	label: string;
	value: React.ReactNode;
}

const InfoRow = observer(({ icon, label, value }: InfoRowProps) => (
	<HStack gap={3} className="py-3 border-b border-divider last:border-b-0">
		<HStack gap={2} className="w-[100px] text-default-500 shrink-0">
			{icon}
			<span className="text-sm">{label}</span>
		</HStack>
		<span className="font-medium text-sm">{value}</span>
	</HStack>
));

AssetBasicInfo.displayName = "AssetBasicInfo";
