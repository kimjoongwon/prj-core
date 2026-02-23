"use client";

import { Clock, Film, Gauge, Maximize2, Music, Video } from "lucide-react";
import { observer } from "mobx-react-lite";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { VStack } from "../../ui/surfaces/VStack/VStack";

/** 비디오 메타데이터 */
export interface VideoMetadata {
	/** 너비 (px) */
	width: number;
	/** 높이 (px) */
	height: number;
	/** 재생 시간 (ms) */
	durationMs: number;
	/** 프레임 레이트 */
	frameRate?: number;
	/** 비디오 코덱 */
	codec?: string;
	/** 비트레이트 (bps) */
	bitrate?: number;
	/** 오디오 존재 여부 */
	hasAudio?: boolean;
	/** 오디오 코덱 */
	audioCodec?: string;
}

export interface VideoDetailInfoProps {
	/** 비디오 메타데이터 */
	video: VideoMetadata;
	/** 접기/펼치기 가능 여부 */
	collapsible?: boolean;
	/** 기본 펼침 상태 */
	defaultExpanded?: boolean;
}

/**
 * 재생 시간을 포맷팅 (ms → MM:SS 또는 HH:MM:SS)
 */
const formatDuration = (durationMs: number): string => {
	const totalSeconds = Math.floor(durationMs / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	if (hours > 0) {
		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	}
	return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * 비트레이트를 포맷팅 (bps → Mbps)
 */
const formatBitrate = (bitrate?: number): string => {
	if (!bitrate) return "-";
	const mbps = bitrate / 1_000_000;
	return `${mbps.toFixed(1)} Mbps`;
};

/**
 * VideoDetailInfo 컴포넌트
 * 비디오 타입 에셋의 상세 정보를 표시합니다.
 *
 * @example
 * ```tsx
 * <VideoDetailInfo
 *   video={{
 *     width: 1920,
 *     height: 1080,
 *     durationMs: 150000,
 *     frameRate: 30,
 *     codec: "H.264",
 *     bitrate: 8500000,
 *     hasAudio: true,
 *     audioCodec: "AAC",
 *   }}
 * />
 * ```
 */
export const VideoDetailInfo = observer(
	({ video, collapsible = false, defaultExpanded = true }: VideoDetailInfoProps) => {
		return (
			<VStack gap={4} className="w-full">
				<VStack gap={3} className="rounded-lg bg-content2 p-4">
					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<Maximize2 className="size-4" />
							<span className="text-sm">너비</span>
						</HStack>
						<span className="font-medium">{video.width.toLocaleString()} px</span>
					</HStack>

					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<Maximize2 className="size-4" />
							<span className="text-sm">높이</span>
						</HStack>
						<span className="font-medium">{video.height.toLocaleString()} px</span>
					</HStack>

					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<Clock className="size-4" />
							<span className="text-sm">재생 시간</span>
						</HStack>
						<span className="font-medium">{formatDuration(video.durationMs)}</span>
					</HStack>

					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<Film className="size-4" />
							<span className="text-sm">프레임 레이트</span>
						</HStack>
						<span className="font-medium">
							{video.frameRate ? `${video.frameRate} fps` : "-"}
						</span>
					</HStack>

					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<Video className="size-4" />
							<span className="text-sm">비디오 코덱</span>
						</HStack>
						<span className="font-medium">{video.codec || "-"}</span>
					</HStack>

					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<Gauge className="size-4" />
							<span className="text-sm">비트레이트</span>
						</HStack>
						<span className="font-medium">{formatBitrate(video.bitrate)}</span>
					</HStack>

					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<Music className="size-4" />
							<span className="text-sm">오디오</span>
						</HStack>
						<span className="font-medium">
							{video.hasAudio ? video.audioCodec || "있음" : "없음"}
						</span>
					</HStack>
				</VStack>
			</VStack>
		);
	},
);

VideoDetailInfo.displayName = "VideoDetailInfo";
