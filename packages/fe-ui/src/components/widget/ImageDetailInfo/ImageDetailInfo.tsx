"use client";

import { Maximize2, Palette, RotateCw, Layers } from "lucide-react";
import { observer } from "mobx-react-lite";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { VStack } from "../../ui/surfaces/VStack/VStack";

/** 이미지 메타데이터 */
export interface ImageMetadata {
	/** 너비 (px) */
	width: number;
	/** 높이 (px) */
	height: number;
	/** 방향 (EXIF Orientation) */
	orientation?: number;
	/** 색상 공간 */
	colorSpace?: string;
	/** 알파 채널 여부 */
	hasAlpha?: boolean;
}

export interface ImageDetailInfoProps {
	/** 이미지 메타데이터 */
	image: ImageMetadata;
	/** 접기/펼치기 가능 여부 */
	collapsible?: boolean;
	/** 기본 펼침 상태 */
	defaultExpanded?: boolean;
}

/**
 * 방향 값을 한글로 변환
 */
const formatOrientation = (orientation?: number): string => {
	if (!orientation) return "1 (기본)";
	return `${orientation}`;
};

/**
 * 알파 채널 여부를 한글로 변환
 */
const formatAlpha = (hasAlpha?: boolean): string => {
	if (hasAlpha === undefined) return "-";
	return hasAlpha ? "예" : "아니오";
};

/**
 * ImageDetailInfo 컴포넌트
 * 이미지 타입 에셋의 상세 정보를 표시합니다.
 *
 * @example
 * ```tsx
 * <ImageDetailInfo
 *   image={{
 *     width: 1920,
 *     height: 1080,
 *     orientation: 1,
 *     colorSpace: "sRGB",
 *     hasAlpha: true,
 *   }}
 * />
 * ```
 */
export const ImageDetailInfo = observer(
	({ image, collapsible = false, defaultExpanded = true }: ImageDetailInfoProps) => {
		return (
			<VStack gap={4} className="w-full">
				<VStack gap={3} className="rounded-lg bg-content2 p-4">
					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<Maximize2 className="size-4" />
							<span className="text-sm">너비</span>
						</HStack>
						<span className="font-medium">{image.width.toLocaleString()} px</span>
					</HStack>

					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<Maximize2 className="size-4" />
							<span className="text-sm">높이</span>
						</HStack>
						<span className="font-medium">{image.height.toLocaleString()} px</span>
					</HStack>

					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<RotateCw className="size-4" />
							<span className="text-sm">방향</span>
						</HStack>
						<span className="font-medium">{formatOrientation(image.orientation)}</span>
					</HStack>

					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<Palette className="size-4" />
							<span className="text-sm">색상 공간</span>
						</HStack>
						<span className="font-medium">{image.colorSpace || "-"}</span>
					</HStack>

					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<Layers className="size-4" />
							<span className="text-sm">알파 채널</span>
						</HStack>
						<span className="font-medium">{formatAlpha(image.hasAlpha)}</span>
					</HStack>
				</VStack>
			</VStack>
		);
	},
);

ImageDetailInfo.displayName = "ImageDetailInfo";
