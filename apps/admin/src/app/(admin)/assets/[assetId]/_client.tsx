"use client";

import { useDeleteAsset, useGetAssetById } from "@cocrepo/api";
import { AssetPreview } from "@cocrepo/ui";
import { PageSurface, SectionSurface, VStack, HStack } from "@cocrepo/ui";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	useDisclosure,
	Chip,
} from "@heroui/react";
import { ArrowLeft, Download, FolderOpen, Trash2, Image, Video, FileText } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface AssetDetailPageClientProps {
	assetId: string;
}

/**
 * 에셋 상세 페이지 - 클라이언트 컴포넌트
 */
function AssetDetailPageClient({ assetId }: AssetDetailPageClientProps) {
	const router = useRouter();
	const deleteModal = useDisclosure();

	// API 조회
	const { data: response, isLoading } = useGetAssetById(assetId);
	const asset = response?.data;

	// 삭제 Mutation
	const { mutate: deleteAsset, isPending: isDeleting } = useDeleteAsset({
		mutation: {
			onSuccess: () => {
				deleteModal.onClose();
				router.push("/assets" as Route);
			},
		},
	});

	/**
	 * 뒤로가기 핸들러
	 */
	const onClickBackButton = () => {
		router.push("/assets" as Route);
	};

	/**
	 * 다운로드 핸들러
	 */
	const onClickDownloadButton = () => {
		if (asset?.storageKey) {
			window.open(`/api/assets/${asset.id}/file`, "_blank");
		}
	};

	/**
	 * 폴더 이동 핸들러
	 */
	const onClickMoveFolderButton = () => {
		// TODO: 폴더 이동 모달 구현
		console.log("Move to folder");
	};

	/**
	 * 삭제 확인 핸들러
	 */
	const onClickDeleteConfirm = () => {
		deleteAsset({ assetId });
	};

	/**
	 * 에셋 타입 아이콘
	 */
	const getAssetIcon = () => {
		switch (asset?.kind) {
			case "IMAGE":
				return <Image className="h-4 w-4" />;
			case "VIDEO":
				return <Video className="h-4 w-4" />;
			case "DOCUMENT":
				return <FileText className="h-4 w-4" />;
			default:
				return null;
		}
	};

	/**
	 * 에셋 타입 색상
	 */
	const getAssetColor = () => {
		switch (asset?.kind) {
			case "IMAGE":
				return "primary";
			case "VIDEO":
				return "secondary";
			case "DOCUMENT":
				return "warning";
			default:
				return "default";
		}
	};

	/**
	 * 파일 크기 포맷팅
	 */
	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
	};

	/**
	 * 날짜 포맷팅
	 */
	const formatDate = (date: Date | string): string => {
		const d = typeof date === "string" ? new Date(date) : date;
		return d.toLocaleString("ko-KR");
	};

	// 로딩 상태
	if (isLoading) {
		return (
			<PageSurface title="에셋 상세" description="로딩 중...">
				<div className="flex items-center justify-center p-8 gap-2">
					<Spinner size="sm" />
					<span className="text-default-500">로딩 중...</span>
				</div>
			</PageSurface>
		);
	}

	// 에셋 없음
	if (!asset) {
		return (
			<PageSurface title="에셋 상세" description="에셋을 찾을 수 없습니다.">
				<div className="flex flex-col items-center justify-center gap-4 p-8">
					<p className="text-default-500">에셋을 찾을 수 없습니다.</p>
					<Button variant="flat" onPress={onClickBackButton}>
						목록으로
					</Button>
				</div>
			</PageSurface>
		);
	}

	return (
		<PageSurface
			title="에셋 상세"
			description="에셋 정보를 확인하고 관리합니다."
			actions={
				<div className="flex gap-2">
					<Button
						variant="flat"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={onClickBackButton}
					>
						목록으로
					</Button>
					<Button
						variant="flat"
						startContent={<FolderOpen className="h-4 w-4" />}
						onPress={onClickMoveFolderButton}
					>
						폴더 이동
					</Button>
					<Button
						variant="flat"
						startContent={<Download className="h-4 w-4" />}
						onPress={onClickDownloadButton}
					>
						다운로드
					</Button>
					<Button
						color="danger"
						startContent={<Trash2 className="h-4 w-4" />}
						onPress={deleteModal.onOpen}
					>
						삭제
					</Button>
				</div>
			}
		>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* 미리보기 영역 */}
				<div className="lg:col-span-2">
					<SectionSurface>
						<AssetPreview
							kind={asset.kind}
							previewUrl={asset.metadata?.thumbnailUrl as string | undefined}
							mimeType={asset.mimeType}
							originalName={asset.originalName}
							className="w-full aspect-video"
						/>
					</SectionSurface>
				</div>

				{/* 상세 정보 영역 */}
				<div className="lg:col-span-1">
					<VStack gap={4}>
						{/* 기본 정보 */}
						<SectionSurface>
							<h3 className="text-lg font-semibold mb-4">기본 정보</h3>
							<VStack gap={3}>
								<div>
									<label className="text-sm text-default-500">파일명</label>
									<p className="font-medium mt-1">{asset.originalName}</p>
								</div>
								<HStack gap={2}>
									<div>
										<label className="text-sm text-default-500">타입</label>
										<div className="mt-1">
											<Chip
												size="sm"
												variant="flat"
												color={getAssetColor()}
												startContent={getAssetIcon()}
											>
												{asset.kind}
											</Chip>
										</div>
									</div>
									<div>
										<label className="text-sm text-default-500">상태</label>
										<div className="mt-1">
											<Chip
												size="sm"
												variant="flat"
												color={asset.status === "READY" ? "success" : asset.status === "FAILED" ? "danger" : "default"}
											>
												{asset.status}
											</Chip>
										</div>
									</div>
								</HStack>
								<div>
									<label className="text-sm text-default-500">MIME 타입</label>
									<p className="font-mono text-sm mt-1">{asset.mimeType}</p>
								</div>
								<div>
									<label className="text-sm text-default-500">크기</label>
									<p className="mt-1">{formatFileSize(asset.sizeBytes)}</p>
								</div>
								{asset.folder && (
									<div>
										<label className="text-sm text-default-500">폴더</label>
										<p className="mt-1">{asset.folder.name}</p>
									</div>
								)}
							</VStack>
						</SectionSurface>

						{/* 메타 정보 */}
						<SectionSurface>
							<h3 className="text-lg font-semibold mb-4">메타 정보</h3>
							<VStack gap={3}>
								<div>
									<label className="text-sm text-default-500">생성일</label>
									<p className="mt-1">{formatDate(asset.createdAt)}</p>
								</div>
								{asset.updatedAt && (
									<div>
										<label className="text-sm text-default-500">수정일</label>
										<p className="mt-1">{formatDate(asset.updatedAt)}</p>
									</div>
								)}
								{asset.checksum && (
									<div>
										<label className="text-sm text-default-500">체크섬</label>
										<p className="font-mono text-xs mt-1 break-all">{asset.checksum}</p>
									</div>
								)}
							</VStack>
						</SectionSurface>

						{/* 타입별 상세 정보 */}
						{asset.kind === "IMAGE" && asset.metadata && (
							<SectionSurface>
								<h3 className="text-lg font-semibold mb-4">이미지 정보</h3>
								<VStack gap={3}>
									{(asset.metadata as { width?: number; height?: number }).width && (
										<div>
											<label className="text-sm text-default-500">해상도</label>
											<p className="mt-1">
												{(asset.metadata as { width: number }).width} x {(asset.metadata as { height: number }).height}
											</p>
										</div>
									)}
								</VStack>
							</SectionSurface>
						)}

						{asset.kind === "VIDEO" && asset.metadata && (
							<SectionSurface>
								<h3 className="text-lg font-semibold mb-4">비디오 정보</h3>
								<VStack gap={3}>
									{(asset.metadata as { durationMs?: number }).durationMs && (
										<div>
											<label className="text-sm text-default-500">재생 시간</label>
											<p className="mt-1">
												{Math.floor((asset.metadata as { durationMs: number }).durationMs / 1000)}초
											</p>
										</div>
									)}
								</VStack>
							</SectionSurface>
						)}

						{asset.kind === "DOCUMENT" && asset.metadata && (
							<SectionSurface>
								<h3 className="text-lg font-semibold mb-4">문서 정보</h3>
								<VStack gap={3}>
									{(asset.metadata as { pageCount?: number }).pageCount && (
										<div>
											<label className="text-sm text-default-500">페이지 수</label>
											<p className="mt-1">{(asset.metadata as { pageCount: number }).pageCount}쪽</p>
										</div>
									)}
								</VStack>
							</SectionSurface>
						)}

						{/* 파생 리소스 */}
						{asset.derivatives && asset.derivatives.length > 0 && (
							<SectionSurface>
								<h3 className="text-lg font-semibold mb-4">파생 리소스</h3>
								<VStack gap={2}>
									{asset.derivatives.map((derivative) => (
										<HStack key={derivative.id} justifyContent="between" className="py-2 border-b border-divider last:border-0">
											<div>
												<p className="font-medium text-sm">{derivative.kind}</p>
												<p className="text-xs text-default-500">{formatFileSize(derivative.sizeBytes)}</p>
											</div>
											<Button size="sm" variant="flat">
												보기
											</Button>
										</HStack>
									))}
								</VStack>
							</SectionSurface>
						)}
					</VStack>
				</div>
			</div>

			{/* 삭제 확인 모달 */}
			<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
				<ModalContent>
					<ModalHeader className="flex gap-2 items-center">
						<Trash2 className="h-5 w-5 text-danger" />
						에셋 삭제
					</ModalHeader>
					<ModalBody>
						<p>
							<strong>{asset.originalName}</strong> 파일을 삭제하시겠습니까?
						</p>
						<p className="text-sm text-default-500 mt-2">
							이 작업은 되돌릴 수 없습니다.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button variant="flat" onPress={deleteModal.onClose}>
							취소
						</Button>
						<Button
							color="danger"
							onPress={onClickDeleteConfirm}
							isLoading={isDeleting}
						>
							삭제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</PageSurface>
	);
}

export default observer(AssetDetailPageClient);
