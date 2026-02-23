"use client";

import { cn } from "@heroui/react";
import { FileText, HardDrive, Image, Video } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { SizeDisplay } from "../../ui/data-display/SizeDisplay/SizeDisplay";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { VStack } from "../../ui/surfaces/VStack/VStack";

/**
 * 에셋 통계 타입
 */
export interface AssetStats {
	totalCount: number;
	imageCount: number;
	videoCount: number;
	documentCount: number;
	totalSize: number;
}

export interface AssetStatsBarProps {
	/** 통계 데이터 */
	stats: AssetStats;
	/** 표시할 항목 */
	showItems?: ("total" | "image" | "video" | "document" | "size")[];
	/** 컴팩트 모드 (아이콘만 표시) */
	compact?: boolean;
	/** 추가 클래스명 */
	className?: string;
}

interface StatItemProps {
	icon: ReactNode;
	label: string;
	value: ReactNode;
	color: string;
	compact?: boolean;
}

const StatItem = ({ icon, label, value, color, compact }: StatItemProps) => {
	if (compact) {
		return (
			<HStack alignItems="center" gap={2} className="text-default-500">
				{icon}
				<span className="text-sm font-medium">{value}</span>
			</HStack>
		);
	}

	return (
		<VStack gap={1} className="items-center text-center">
			<div className={cn("p-2 rounded-lg", color)}>{icon}</div>
			<span className="text-2xl font-bold">{value}</span>
			<span className="text-xs text-default-400">{label}</span>
		</VStack>
	);
};

/**
 * AssetStatsBar Widget 컴포넌트
 *
 * 에셋 통계 정보를 시각화하여 표시하는 순수 UI 컴포넌트입니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <AssetStatsBar
 *   stats={{
 *     totalCount: 150,
 *     imageCount: 80,
 *     videoCount: 30,
 *     documentCount: 40,
 *     totalSize: 524288000
 *   }}
 * />
 * ```
 */
export const AssetStatsBar = observer(
	({
		stats,
		showItems = ["total", "image", "video", "document", "size"],
		compact = false,
		className,
	}: AssetStatsBarProps) => {
		const statItems: { key: string; component: ReactNode }[] = [];

		if (showItems.includes("total")) {
			statItems.push({
				key: "total",
				component: (
					<StatItem
						icon={<HardDrive className="w-5 h-5 text-default-500" />}
						label="전체"
						value={stats.totalCount.toLocaleString()}
						color="bg-default-100"
						compact={compact}
					/>
				),
			});
		}

		if (showItems.includes("image")) {
			statItems.push({
				key: "image",
				component: (
					<StatItem
						icon={<Image className="w-5 h-5 text-primary" />}
						label="이미지"
						value={stats.imageCount.toLocaleString()}
						color="bg-primary/10"
						compact={compact}
					/>
				),
			});
		}

		if (showItems.includes("video")) {
			statItems.push({
				key: "video",
				component: (
					<StatItem
						icon={<Video className="w-5 h-5 text-secondary" />}
						label="비디오"
						value={stats.videoCount.toLocaleString()}
						color="bg-secondary/10"
						compact={compact}
					/>
				),
			});
		}

		if (showItems.includes("document")) {
			statItems.push({
				key: "document",
				component: (
					<StatItem
						icon={<FileText className="w-5 h-5 text-default-500" />}
						label="문서"
						value={stats.documentCount.toLocaleString()}
						color="bg-default-100"
						compact={compact}
					/>
				),
			});
		}

		if (showItems.includes("size")) {
			statItems.push({
				key: "size",
				component: (
					<StatItem
						icon={<HardDrive className="w-5 h-5 text-success" />}
						label="전체 용량"
						value={<SizeDisplay bytes={stats.totalSize} />}
						color="bg-success/10"
						compact={compact}
					/>
				),
			});
		}

		if (compact) {
			return (
				<HStack justifyContent="between" className={cn("bg-content2 rounded-lg p-3", className)}>
					{statItems.map((item) => (
						<div key={item.key}>{item.component}</div>
					))}
				</HStack>
			);
		}

		return (
			<HStack
				justifyContent="around"
				className={cn("bg-content1 rounded-xl p-4 border border-divider", className)}
				gap={4}
			>
				{statItems.map((item) => (
					<div key={item.key} className="flex-1">
						{item.component}
					</div>
				))}
			</HStack>
		);
	},
);

AssetStatsBar.displayName = "AssetStatsBar";
