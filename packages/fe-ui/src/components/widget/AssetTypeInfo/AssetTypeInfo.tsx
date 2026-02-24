"use client";

import { observer } from "mobx-react-lite";
import type { ImageMetadata } from "../ImageDetailInfo/ImageDetailInfo";
import { ImageDetailInfo } from "../ImageDetailInfo/ImageDetailInfo";
import type { VideoMetadata } from "../VideoDetailInfo/VideoDetailInfo";
import { VideoDetailInfo } from "../VideoDetailInfo/VideoDetailInfo";
import type { DocumentMetadata } from "../DocumentDetailInfo/DocumentDetailInfo";
import { DocumentDetailInfo } from "../DocumentDetailInfo/DocumentDetailInfo";

/**
 * AssetTypeInfo용 에셋 타입
 */
export interface AssetTypeInfoItem {
	kind: "IMAGE" | "VIDEO" | "DOCUMENT";
	image?: ImageMetadata | null;
	video?: VideoMetadata | null;
	document?: DocumentMetadata | null;
}

export interface AssetTypeInfoProps {
	/** 에셋 데이터 (image/video/document 포함) */
	asset: AssetTypeInfoItem;
	/** 접기/펼치기 가능 여부 (기본값: true) */
	collapsible?: boolean;
	/** 기본 펼침 상태 (기본값: true) */
	defaultExpanded?: boolean;
	/** 추가 클래스명 */
	className?: string;
}

/**
 * AssetTypeInfo Widget 컴포넌트
 *
 * 에셋 타입에 따라 적절한 상세 정보 위젯을 조건부 렌더링하는 래퍼 컴포넌트입니다.
 * 이미지/비디오/문서별로 다른 상세 정보를 표시합니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <AssetTypeInfo
 *   asset={{
 *     kind: "IMAGE",
 *     image: { width: 1920, height: 1080, colorSpace: "sRGB" }
 *   }}
 * />
 * ```
 */
export const AssetTypeInfo = observer(
	({ asset, collapsible = true, defaultExpanded = true, className }: AssetTypeInfoProps) => {
		switch (asset.kind) {
			case "IMAGE":
				if (!asset.image) return null;
				return (
					<div className={className}>
						<ImageDetailInfo
							image={asset.image}
							collapsible={collapsible}
							defaultExpanded={defaultExpanded}
						/>
					</div>
				);

			case "VIDEO":
				if (!asset.video) return null;
				return (
					<div className={className}>
						<VideoDetailInfo
							video={asset.video}
							collapsible={collapsible}
							defaultExpanded={defaultExpanded}
						/>
					</div>
				);

			case "DOCUMENT":
				if (!asset.document) return null;
				return (
					<div className={className}>
						<DocumentDetailInfo
							document={asset.document}
							collapsible={collapsible}
							defaultExpanded={defaultExpanded}
						/>
					</div>
				);

			default:
				return null;
		}
	},
);

AssetTypeInfo.displayName = "AssetTypeInfo";
