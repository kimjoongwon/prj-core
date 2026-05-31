"use client";

import { FileText, ImageIcon, Link2Off, PlayCircle } from "lucide-react";
import {
	Button,
	Chip,
	cn,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "../../design-system/primitives";

export interface AssetPreviewAsset {
	id: string;
	originalName: string;
	kind: "IMAGE" | "VIDEO" | "DOCUMENT";
	status?: "UPLOADING" | "READY" | "FAILED";
	mimeType: string;
	sizeBytes: number;
	publicUrl?: string | null;
}

export interface AssetPreviewProps {
	asset: AssetPreviewAsset;
	className?: string;
	showInfo?: boolean;
}

export interface AssetPreviewDialogProps {
	asset?: AssetPreviewAsset | null;
	isOpen: boolean;
	onClose: () => void;
}

export type AssetPreviewMode =
	| "image"
	| "video"
	| "pdf"
	| "unsupported"
	| "unavailable";

export function getAssetPreviewUrl(asset: AssetPreviewAsset): string | null {
	if (asset.status && asset.status !== "READY") {
		return null;
	}

	return asset.publicUrl ?? `/api/v1/assets/${asset.id}/content`;
}

export function formatAssetPreviewBytes(bytes: number) {
	if (bytes === 0) {
		return "0 B";
	}

	const units = ["B", "KB", "MB", "GB", "TB"];
	const exponent = Math.min(
		Math.floor(Math.log(bytes) / Math.log(1024)),
		units.length - 1,
	);
	const value = bytes / 1024 ** exponent;

	return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function getAssetPreviewMode(
	asset: AssetPreviewAsset,
): AssetPreviewMode {
	if (!getAssetPreviewUrl(asset)) {
		return "unavailable";
	}

	if (asset.kind === "IMAGE" && asset.mimeType.startsWith("image/")) {
		return "image";
	}

	if (asset.kind === "VIDEO" && asset.mimeType.startsWith("video/")) {
		return "video";
	}

	if (asset.kind === "DOCUMENT" && asset.mimeType === "application/pdf") {
		return "pdf";
	}

	if (asset.kind === "DOCUMENT") {
		return "unsupported";
	}

	return "unavailable";
}

export function getAssetPreviewStatusMessage(
	asset: AssetPreviewAsset,
	mode = getAssetPreviewMode(asset),
) {
	if (asset.status === "UPLOADING") {
		return "업로드가 끝나면 자동으로 미리보기를 사용할 수 있습니다.";
	}

	if (asset.status === "FAILED") {
		return "업로드에 실패한 에셋이라 미리보기를 제공할 수 없습니다.";
	}

	if (!getAssetPreviewUrl(asset)) {
		return "현재 이 에셋을 미리보기용으로 열 수 없습니다.";
	}

	if (mode === "unsupported") {
		return "이 문서 형식은 인라인 미리보기를 지원하지 않습니다. 원본 열기를 사용해주세요.";
	}

	if (mode === "pdf") {
		return "브라우저 PDF 뷰어로 문서를 바로 확인할 수 있습니다.";
	}

	if (mode === "video") {
		return "브라우저에서 바로 재생할 수 있는 비디오 에셋입니다.";
	}

	if (mode === "image") {
		return "고해상도 이미지를 이 화면에서 바로 확인할 수 있습니다.";
	}

	return "미리보기를 준비할 수 없습니다.";
}

function getKindLabel(kind: AssetPreviewAsset["kind"]) {
	switch (kind) {
		case "IMAGE":
			return "이미지";
		case "VIDEO":
			return "비디오";
		case "DOCUMENT":
			return "문서";
		default:
			return kind;
	}
}

function getStatusLabel(status?: AssetPreviewAsset["status"]) {
	switch (status) {
		case "READY":
			return "준비됨";
		case "UPLOADING":
			return "업로드 중";
		case "FAILED":
			return "실패";
		default:
			return "상태 미상";
	}
}

function getStatusColor(
	status?: AssetPreviewAsset["status"],
): "success" | "warning" | "danger" | "default" {
	switch (status) {
		case "READY":
			return "success";
		case "UPLOADING":
			return "warning";
		case "FAILED":
			return "danger";
		default:
			return "default";
	}
}

function getPreviewBadgeLabel(mode: AssetPreviewMode) {
	switch (mode) {
		case "image":
			return "이미지 프리뷰";
		case "video":
			return "비디오 재생";
		case "pdf":
			return "PDF 뷰어";
		case "unsupported":
			return "원본 열기 필요";
		case "unavailable":
			return "프리뷰 제한";
		default:
			return "프리뷰";
	}
}

function AssetPreviewFallback({
	asset,
	mode,
}: {
	asset: AssetPreviewAsset;
	mode: AssetPreviewMode;
}) {
	return (
		<div className="flex min-h-[300px] w-full items-center justify-center rounded-[1.25rem] border border-dashed border-divider/70 bg-white/65 p-6 text-center shadow-inner shadow-slate-900/5">
			<div className="max-w-sm space-y-4">
				<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-default-100 text-default-500">
					{mode === "unsupported" ? (
						<FileText className="h-8 w-8" />
					) : mode === "unavailable" && asset.kind === "VIDEO" ? (
						<PlayCircle className="h-8 w-8" />
					) : mode === "unavailable" && asset.kind === "IMAGE" ? (
						<ImageIcon className="h-8 w-8" />
					) : (
						<Link2Off className="h-8 w-8" />
					)}
				</div>
				<div className="space-y-2">
					<p className="text-base font-semibold text-foreground">
						{mode === "unsupported"
							? "이 형식은 인라인 미리보기를 지원하지 않습니다."
							: "지금은 인라인 미리보기를 열 수 없습니다."}
					</p>
					<p className="text-sm leading-6 text-default-500">
						{getAssetPreviewStatusMessage(asset, mode)}
					</p>
				</div>
			</div>
		</div>
	);
}

function AssetPreviewMedia({
	asset,
	mode,
}: AssetPreviewProps & { mode: AssetPreviewMode }) {
	const previewUrl = getAssetPreviewUrl(asset);

	if (mode === "image" && previewUrl) {
		return (
			<img
				src={previewUrl}
				alt={asset.originalName}
				className="max-h-[560px] w-full rounded-[1.25rem] object-contain shadow-2xl shadow-slate-900/10"
				loading="lazy"
			/>
		);
	}

	if (mode === "video" && previewUrl) {
		return (
			// biome-ignore lint/a11y/useMediaCaption: uploaded asset previews do not provide caption tracks.
			<video
				src={previewUrl}
				controls
				playsInline
				preload="metadata"
				className="max-h-[560px] w-full rounded-[1.25rem] bg-black shadow-2xl shadow-slate-900/20"
			/>
		);
	}

	if (mode === "pdf" && previewUrl) {
		return (
			<iframe
				title={`${asset.originalName} PDF preview`}
				src={`${previewUrl}#view=FitH`}
				className="h-[560px] w-full rounded-[1.25rem] bg-white shadow-2xl shadow-slate-900/10"
			/>
		);
	}

	return <AssetPreviewFallback asset={asset} mode={mode} />;
}

export function AssetPreview({
	asset,
	className,
	showInfo = true,
}: AssetPreviewProps) {
	const previewMode = getAssetPreviewMode(asset);

	return (
		<div
			className={cn(
				"overflow-hidden rounded-[1.75rem] border border-divider/70 bg-content1 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.45)]",
				className,
			)}
		>
			<div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.96),_rgba(219,234,254,0.82)_40%,_rgba(226,232,240,0.72))] px-4 py-4 sm:px-6 sm:py-6">
				<div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/55 to-transparent" />
				<div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
					<Chip size="sm" color="secondary" variant="flat">
						{getKindLabel(asset.kind)}
					</Chip>
					<Chip size="sm" color={getStatusColor(asset.status)} variant="flat">
						{getStatusLabel(asset.status)}
					</Chip>
					<Chip size="sm" color="default" variant="bordered">
						{getPreviewBadgeLabel(previewMode)}
					</Chip>
				</div>
				<div className="relative flex min-h-[320px] items-center justify-center pt-10">
					<AssetPreviewMedia asset={asset} mode={previewMode} />
				</div>
			</div>
			{showInfo ? (
				<div className="border-t border-divider/60 bg-content1/90 px-4 py-4 sm:px-6">
					<div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
						<div className="min-w-0">
							<p className="truncate text-base font-semibold text-foreground">
								{asset.originalName}
							</p>
							<p className="mt-1 text-sm text-default-500">{asset.mimeType}</p>
						</div>
						<div className="flex flex-wrap items-center gap-2 text-xs font-medium text-default-500">
							<span>{formatAssetPreviewBytes(asset.sizeBytes)}</span>
							<span className="text-default-300">/</span>
							<span>{getAssetPreviewStatusMessage(asset, previewMode)}</span>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}

export function AssetPreviewDialog({
	asset,
	isOpen,
	onClose,
}: AssetPreviewDialogProps) {
	const previewUrl = asset ? getAssetPreviewUrl(asset) : null;

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
			<ModalContent>
				<ModalHeader>{asset?.originalName ?? "에셋 보기"}</ModalHeader>
				<ModalBody>{asset ? <AssetPreview asset={asset} /> : null}</ModalBody>
				<ModalFooter>
					{previewUrl ? (
						<Button
							color="primary"
							variant="flat"
							onPress={() => {
								window.open(previewUrl, "_blank", "noopener,noreferrer");
							}}
						>
							원본 열기
						</Button>
					) : null}
					<Button variant="flat" onPress={onClose}>
						닫기
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
