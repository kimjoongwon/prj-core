"use client";

import { useCreateAsset, useGetFolderTree } from "@cocrepo/api";
import { AssetUploader } from "@cocrepo/ui";
import { PageSurface, SectionSurface, VStack } from "@cocrepo/ui";
import { Button, Select, SelectItem, Progress, Card, CardBody } from "@heroui/react";
import { ArrowLeft, Upload, FolderOpen } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

/**
 * 에셋 업로드 페이지 - 클라이언트 컴포넌트
 */
function AssetUploadPageClient() {
	const router = useRouter();

	const state = useLocalObservable(() => ({
		selectedFolderId: null as string | null,
		uploadingFiles: [] as { id: string; name: string; progress: number; status: "pending" | "uploading" | "success" | "error" }[],

		setSelectedFolderId(folderId: string | null) {
			this.selectedFolderId = folderId;
		},

		addUploadingFile(file: { id: string; name: string }) {
			this.uploadingFiles.push({ ...file, progress: 0, status: "pending" });
		},

		updateFileProgress(id: string, progress: number) {
			const file = this.uploadingFiles.find((f) => f.id === id);
			if (file) {
				file.progress = progress;
				file.status = "uploading";
			}
		},

		updateFileStatus(id: string, status: "pending" | "uploading" | "success" | "error") {
			const file = this.uploadingFiles.find((f) => f.id === id);
			if (file) {
				file.status = status;
			}
		},

		removeUploadingFile(id: string) {
			const index = this.uploadingFiles.findIndex((f) => f.id === id);
			if (index > -1) {
				this.uploadingFiles.splice(index, 1);
			}
		},

		clearUploadingFiles() {
			this.uploadingFiles = [];
		},
	}));

	// API 조회
	const { data: folderTreeResponse } = useGetFolderTree();
	const folders = folderTreeResponse?.data ?? [];

	// 업로드 Mutation
	const { mutateAsync: createAsset } = useCreateAsset();

	/**
	 * 뒤로가기 핸들러
	 */
	const onClickBackButton = () => {
		router.push("/assets" as Route);
	};

	/**
	 * 폴더 선택
	 */
	const onChangeFolder = (folderId: string | null) => {
		state.setSelectedFolderId(folderId);
	};

	/**
	 * 파일 업로드 처리
	 */
	const handleFilesSelected = useCallback(
		async (files: FileList | File[]) => {
			const fileArray = Array.from(files);

			for (const file of fileArray) {
				const fileId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

				// 파일 추가
				state.addUploadingFile({ id: fileId, name: file.name });

				try {
					// FormData 생성
					const formData = new FormData();
					formData.append("file", file);
					if (state.selectedFolderId) {
						formData.append("folderId", state.selectedFolderId);
					}

					// 업로드 시작
					state.updateFileStatus(fileId, "uploading");

					// API 호출
					await createAsset({
						data: formData as never,
					});

					// 성공
					state.updateFileStatus(fileId, "success");
					state.updateFileProgress(fileId, 100);
				} catch (error) {
					console.error("Upload failed:", error);
					state.updateFileStatus(fileId, "error");
				}
			}
		},
		[createAsset, state],
	);

	/**
	 * 업로드 시작 핸들러 (AssetUploader용)
	 */
	const handleUploadStart = useCallback(
		(files: File[]) => {
			handleFilesSelected(files);
		},
		[handleFilesSelected],
	);

	/**
	 * 업로드 완료 핸들러
	 */
	const handleUploadComplete = useCallback((_assets: unknown[]) => {
		// 업로드 완료 시 추가 처리 (필요 시)
	}, []);

	/**
	 * 업로드 에러 핸들러
	 */
	const handleUploadError = useCallback((errors: { file: File; message: string }[]) => {
		errors.forEach((error) => {
			console.error(`Upload failed for ${error.file.name}: ${error.message}`);
		});
	}, []);

	/**
	 * 닫기 핸들러
	 */
	const handleClose = useCallback(() => {
		router.push("/assets" as Route);
	}, [router]);

	/**
	 * 완료 후 목록으로 이동
	 */
	const onClickCompleteButton = () => {
		router.push("/assets" as Route);
	};

	return (
		<PageSurface
			title="에셋 업로드"
			description="새로운 에셋을 업로드합니다."
			actions={
				<div className="flex gap-2">
					<Button
						variant="flat"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={onClickBackButton}
					>
						목록으로
					</Button>
					{state.uploadingFiles.some((f) => f.status === "success") && (
						<Button color="primary" onPress={onClickCompleteButton}>
							완료
						</Button>
					)}
				</div>
			}
		>
			<VStack gap={6}>
				{/* 폴더 선택 */}
				<SectionSurface>
					<div className="flex items-center gap-4">
						<FolderOpen className="h-5 w-5 text-default-500" />
						<div className="flex-1">
							<label className="text-sm text-default-500 mb-1 block">업로드할 폴더</label>
							<Select
								placeholder="폴더 선택 (선택사항)"
								selectedKeys={state.selectedFolderId ? [state.selectedFolderId] : []}
								onSelectionChange={(keys) => {
									const folderId = Array.from(keys)[0] as string;
									state.setSelectedFolderId(folderId || null);
								}}
								className="max-w-xs"
							>
								{folders.map((folder) => (
									<SelectItem key={folder.id}>{folder.name}</SelectItem>
								))}
							</Select>
						</div>
					</div>
				</SectionSurface>

				{/* 업로드 영역 */}
				<SectionSurface>
					<AssetUploader
						folderId={state.selectedFolderId}
						allowedTypes={["IMAGE", "VIDEO", "DOCUMENT"]}
						allowedExtensions={[
							".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg",
							".mp4", ".mov", ".avi", ".webm",
							".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
						]}
						maxFileSize={100 * 1024 * 1024} // 100MB
						maxFiles={20}
						multiple
						autoUpload
						onUploadStart={handleFilesSelected}
						onUploadComplete={handleUploadComplete}
						onUploadError={handleUploadError}
						onClose={handleClose}
					/>
				</SectionSurface>

				{/* 업로드 진행 상황 */}
				{state.uploadingFiles.length > 0 && (
					<SectionSurface>
						<h3 className="text-lg font-semibold mb-4">업로드 진행 상황</h3>
						<VStack gap={3}>
							{state.uploadingFiles.map((file) => (
								<Card key={file.id}>
									<CardBody>
										<div className="flex items-center gap-4">
											<div className="flex-1">
												<p className="font-medium text-sm">{file.name}</p>
												{file.status === "uploading" && (
													<Progress
														value={file.progress}
														className="mt-2"
														size="sm"
														color="primary"
													/>
												)}
											</div>
											<div className="flex items-center gap-2">
												{file.status === "uploading" && (
													<span className="text-xs text-default-500">{file.progress}%</span>
												)}
												{file.status === "success" && (
													<span className="text-xs text-success">완료</span>
												)}
												{file.status === "error" && (
													<span className="text-xs text-danger">실패</span>
												)}
											</div>
										</div>
									</CardBody>
								</Card>
							))}
						</VStack>
					</SectionSurface>
				)}
			</VStack>
		</PageSurface>
	);
}

export default observer(AssetUploadPageClient);
