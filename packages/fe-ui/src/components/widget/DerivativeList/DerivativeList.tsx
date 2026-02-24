"use client";

import { Button, Chip, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { Download, Eye, FileText, Film, Image, Type } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { DerivativeKind } from "@cocrepo/api";
import { SizeDisplay } from "../../ui/data-display/SizeDisplay/SizeDisplay";
import { VStack } from "../../ui/surfaces/VStack/VStack";

/**
 * DerivativeList용 파생 리소스 타입
 */
export interface DerivativeItem {
	id: string;
	kind: DerivativeKind;
	profile: string;
	mimeType: string;
	sizeBytes: number;
	width?: number | null;
	height?: number | null;
	durationMs?: number | null;
	createdAt: string | Date;
}

export interface DerivativeListProps {
	/** 파생 리소스 목록 */
	derivatives: DerivativeItem[];
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 미리보기 버튼 표시 */
	showPreview?: boolean;
	/** 다운로드 버튼 표시 */
	showDownload?: boolean;
	/** 미리보기 핸들러 */
	onPreview?: (derivative: DerivativeItem) => void;
	/** 다운로드 핸들러 */
	onDownload?: (derivative: DerivativeItem) => void;
	/** 빈 상태 메시지 */
	emptyMessage?: string;
	/** 추가 클래스명 */
	className?: string;
}

/** 파생 리소스 종류 설정 */
const KIND_CONFIG: Record<
	DerivativeKind,
	{ label: string; color: "primary" | "secondary" | "success" | "warning"; icon: typeof Image }
> = {
	THUMBNAIL: { label: "썸네일", color: "primary", icon: Image },
	PREVIEW: { label: "프리뷰", color: "secondary", icon: Eye },
	TRANSCODE: { label: "트랜스코딩", color: "success", icon: Film },
	TEXT: { label: "텍스트", color: "warning", icon: Type },
};

/**
 * 해상도 포맷팅
 */
const formatResolution = (width?: number | null, height?: number | null): string => {
	if (!width || !height) return "-";
	return `${width}x${height}`;
};

/**
 * 날짜 포맷팅
 */
const formatDate = (date: string | Date): string => {
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
 * DerivativeList Widget 컴포넌트
 *
 * 에셋의 파생 리소스(썸네일, 프리뷰, 트랜스코딩) 목록을 표시하는 순수 UI 컴포넌트입니다.
 * 각 파생 리소스의 종류, 크기, 미리보기를 제공합니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <DerivativeList
 *   derivatives={derivatives}
 *   showPreview
 *   onPreview={handlePreview}
 * />
 * ```
 */
export const DerivativeList = observer(
	({
		derivatives,
		isLoading,
		showPreview = true,
		showDownload = true,
		onPreview,
		onDownload,
		emptyMessage = "파생 리소스가 없습니다",
		className,
	}: DerivativeListProps) => {
		if (isLoading) {
			return (
				<VStack alignItems="center" justifyContent="center" className="h-32" gap={2}>
					<Spinner size="md" />
					<span className="text-default-500 text-sm">로딩 중...</span>
				</VStack>
			);
		}

		if (derivatives.length === 0) {
			return (
				<VStack alignItems="center" justifyContent="center" className="h-32" gap={2}>
					<FileText className="w-8 h-8 text-default-300" />
					<span className="text-default-400 text-sm">{emptyMessage}</span>
				</VStack>
			);
		}

		const columns = [
			{ key: "kind", label: "종류", width: 100 },
			{ key: "profile", label: "프로필", width: 100 },
			{ key: "sizeBytes", label: "크기", width: 80 },
			{ key: "resolution", label: "해상도", width: 100 },
			{ key: "actions", label: "미리보기", width: 100 },
		];

		const renderCell = (derivative: DerivativeItem, columnKey: string) => {
			switch (columnKey) {
				case "kind": {
					const config = KIND_CONFIG[derivative.kind];
					const IconComponent = config.icon;
					return (
						<Chip
							size="sm"
							variant="flat"
							color={config.color}
							startContent={<IconComponent className="w-3 h-3" />}
						>
							{config.label}
						</Chip>
					);
				}
				case "profile":
					return <span className="text-sm">{derivative.profile}</span>;
				case "sizeBytes":
					return <SizeDisplay bytes={derivative.sizeBytes} className="text-sm" />;
				case "resolution":
					return (
						<span className="text-sm text-default-500">
							{formatResolution(derivative.width, derivative.height)}
						</span>
					);
				case "actions":
					return (
						<div className="flex gap-1">
							{showPreview && derivative.kind !== "TEXT" && (
								<Button
									size="sm"
									variant="light"
									isIconOnly
									onPress={() => onPreview?.(derivative)}
								>
									<Eye className="w-4 h-4" />
								</Button>
							)}
							{showDownload && (
								<Button
									size="sm"
									variant="light"
									isIconOnly
									onPress={() => onDownload?.(derivative)}
								>
									<Download className="w-4 h-4" />
								</Button>
							)}
						</div>
					);
				default:
					return null;
			}
		};

		return (
			<div className={className}>
				<Table aria-label="파생 리소스 목록" removeWrapper classNames={{ th: "bg-content1" }}>
					<TableHeader columns={columns}>
						{(column) => (
							<TableColumn key={column.key} width={column.width}>
								{column.label}
							</TableColumn>
						)}
					</TableHeader>
					<TableBody items={derivatives}>
						{(derivative) => (
							<TableRow key={derivative.id}>
								{(columnKey) => (
									<TableCell>{renderCell(derivative, columnKey as string)}</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		);
	},
);

DerivativeList.displayName = "DerivativeList";
