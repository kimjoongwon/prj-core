"use client";

import { Button } from "@heroui/react";
import { Folder, Image as ImageIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { VStack } from "../../ui/surfaces/VStack/VStack";

/** 폴더 정보 */
export interface FolderInfo {
	/** 폴더 ID */
	id: string;
	/** 폴더명 */
	name: string;
	/** 경로 */
	path?: string;
}

/** 앨범 정보 */
export interface AlbumInfo {
	/** 앨범 ID */
	id: string;
	/** 앨범명 */
	name: string;
	/** 에셋 수 */
	assetCount?: number;
}

export interface AssetLocationInfoProps {
	/** 소속 폴더 */
	folder?: FolderInfo | null;
	/** 소속 앨범 목록 */
	albums?: AlbumInfo[];
	/** 폴더 이동 핸들러 */
	onNavigateFolder?: (folderId: string) => void;
	/** 앨범 이동 핸들러 */
	onNavigateAlbum?: (albumId: string) => void;
}

/**
 * AssetLocationInfo 컴포넌트
 * 에셋의 소속 폴더와 앨범 정보를 표시합니다.
 *
 * @example
 * ```tsx
 * <AssetLocationInfo
 *   folder={{ id: "folder-1", name: "2024 시즌 포스터" }}
 *   albums={[
 *     { id: "album-1", name: "마케팅 자료", assetCount: 3 },
 *     { id: "album-2", name: "SNS 썸네일", assetCount: 12 },
 *   ]}
 *   onNavigateFolder={(id) => router.push(`/assets?folderId=${id}`)}
 *   onNavigateAlbum={(id) => router.push(`/albums/${id}`)}
 * />
 * ```
 */
export const AssetLocationInfo = observer(
	({
		folder,
		albums = [],
		onNavigateFolder,
		onNavigateAlbum,
	}: AssetLocationInfoProps) => {
		return (
			<VStack gap={4} className="w-full">
				<h3 className="text-lg font-semibold">소속 정보</h3>

				<VStack gap={3} className="rounded-lg bg-content2 p-4">
					{/* 폴더 정보 */}
					<VStack gap={2} className="w-full">
						<HStack justifyContent="between" className="w-full">
							<HStack gap={2} className="text-default-500">
								<Folder className="size-4" />
								<span className="text-sm">폴더</span>
							</HStack>
							{folder ? (
								<HStack gap={2}>
									<span className="font-medium">{folder.name}</span>
									{onNavigateFolder && (
										<Button
											size="sm"
											variant="flat"
											color="primary"
											onPress={() => onNavigateFolder(folder.id)}
										>
											이동
										</Button>
									)}
								</HStack>
							) : (
								<span className="text-default-400">없음</span>
							)}
						</HStack>
					</VStack>

					{/* 앨범 정보 */}
					<VStack gap={2} className="w-full">
						<HStack gap={2} className="text-default-500">
							<ImageIcon className="size-4" />
							<span className="text-sm">앨범</span>
						</HStack>

						{albums.length > 0 ? (
							<VStack gap={2} className="ml-6">
								{albums.map((album) => (
									<HStack key={album.id} justifyContent="between" className="w-full">
										<HStack gap={2}>
											<span className="font-medium">{album.name}</span>
											{album.assetCount !== undefined && (
												<span className="text-sm text-default-400">
													({album.assetCount}장)
												</span>
											)}
										</HStack>
										{onNavigateAlbum && (
											<Button
												size="sm"
												variant="flat"
												color="primary"
												onPress={() => onNavigateAlbum(album.id)}
											>
												보기
											</Button>
										)}
									</HStack>
								))}
							</VStack>
						) : (
							<span className="ml-6 text-default-400">없음</span>
						)}
					</VStack>
				</VStack>
			</VStack>
		);
	},
);

AssetLocationInfo.displayName = "AssetLocationInfo";
