import type { AssetKind, AssetStatus } from "@cocrepo/prisma";

/**
 * 브레드크럼 아이템
 */
export interface BreadcrumbItem {
	/** 표시 텍스트 */
	label: string;
	/** 이동 경로 (없으면 링크 아님) */
	href?: string;
}

/**
 * 에셋 데이터 타입
 * API 응답에서 사용하는 에셋 타입입니다.
 */
export interface Asset {
	id: string;
	spaceId: string;
	folderId: string;
	kind: AssetKind;
	status: AssetStatus;
	originalName: string;
	storageKey: string;
	mimeType: string;
	sizeBytes: number;
	extension: string | null;
	checksum: string | null;
	metadata: Record<string, unknown> | null;
	creatorId: string | null;
	createdAt: Date | string;
	updatedAt: Date | string;
	// Relations
	folder?: {
		id: string;
		name: string;
		path: string;
	};
	creator?: {
		id: string;
		name: string;
	};
}

/**
 * AssetDetailHeader Props
 */
export interface AssetDetailHeaderProps {
	/** 에셋 데이터 */
	asset: Asset;
	/** 브레드크럼 아이템 목록 */
	breadcrumbItems: BreadcrumbItem[];
	/** 수정 버튼 핸들러 */
	onEdit: () => void;
	/** 삭제 버튼 핸들러 */
	onDelete: () => void;
	/** 다운로드 버튼 핸들러 (선택) */
	onDownload?: () => void;
	/** 삭제 처리 중 상태 */
	isDeleting?: boolean;
	/** 추가 클래스 */
	className?: string;
}
