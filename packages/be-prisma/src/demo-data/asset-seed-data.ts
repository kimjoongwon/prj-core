// ============================================================================
// Asset Domain Seed Data - 에셋 도메인 시드 데이터
// ============================================================================
//
// 미디어 리소스(이미지, 비디오, 문서)를 관리하는 Asset 도메인의 시드 데이터입니다.
// CTI(Class Table Inheritance) 패턴을 사용합니다.
//
// 데이터 구조:
//   Folder (트리 구조)
//     └── Asset (CTI 부모)
//           ├── Image (IMAGE 타입)
//           ├── Video (VIDEO 타입)
//           ├── Document (DOCUMENT 타입)
//           └── Derivative (파생 리소스: 썸네일, 프리뷰 등)
//
//   Album (에셋 컬렉션)
//     └── AlbumEntry (Album-Asset 연결)
//
// ============================================================================

// ----------------------------------------------------------------------------
// Folder (폴더) 시드 데이터
// ----------------------------------------------------------------------------

/**
 * 폴더 시드 데이터 인터페이스
 */
export interface FolderSeedData {
	name: string;
	path: string;
	parentFolderPath?: string; // 상위 폴더 경로 (참조용)
	sortOrder: number;
}

/**
 * 폴더 시드 데이터
 *
 * 계층 구조:
 *   /에셋 라이브러리 (루트)
 *     /이미지
 *       /로고
 *       /배경
 *       /프로필
 *     /동영상
 *       /클래스영상
 *       /홍보영상
 *     /문서
 *       /가이드
 *       /계약서
 */
export const folderSeedData: FolderSeedData[] = [
	// 루트 폴더
	{
		name: "에셋 라이브러리",
		path: "/에셋 라이브러리",
		sortOrder: 0,
	},

	// 1depth - 이미지
	{
		name: "이미지",
		path: "/에셋 라이브러리/이미지",
		parentFolderPath: "/에셋 라이브러리",
		sortOrder: 0,
	},

	// 1depth - 동영상
	{
		name: "동영상",
		path: "/에셋 라이브러리/동영상",
		parentFolderPath: "/에셋 라이브러리",
		sortOrder: 1,
	},

	// 1depth - 문서
	{
		name: "문서",
		path: "/에셋 라이브러리/문서",
		parentFolderPath: "/에셋 라이브러리",
		sortOrder: 2,
	},

	// 2depth - 이미지 하위
	{
		name: "로고",
		path: "/에셋 라이브러리/이미지/로고",
		parentFolderPath: "/에셋 라이브러리/이미지",
		sortOrder: 0,
	},
	{
		name: "배경",
		path: "/에셋 라이브러리/이미지/배경",
		parentFolderPath: "/에셋 라이브러리/이미지",
		sortOrder: 1,
	},
	{
		name: "프로필",
		path: "/에셋 라이브러리/이미지/프로필",
		parentFolderPath: "/에셋 라이브러리/이미지",
		sortOrder: 2,
	},

	// 2depth - 동영상 하위
	{
		name: "클래스영상",
		path: "/에셋 라이브러리/동영상/클래스영상",
		parentFolderPath: "/에셋 라이브러리/동영상",
		sortOrder: 0,
	},
	{
		name: "홍보영상",
		path: "/에셋 라이브러리/동영상/홍보영상",
		parentFolderPath: "/에셋 라이브러리/동영상",
		sortOrder: 1,
	},

	// 2depth - 문서 하위
	{
		name: "가이드",
		path: "/에셋 라이브러리/문서/가이드",
		parentFolderPath: "/에셋 라이브러리/문서",
		sortOrder: 0,
	},
	{
		name: "계약서",
		path: "/에셋 라이브러리/문서/계약서",
		parentFolderPath: "/에셋 라이브러리/문서",
		sortOrder: 1,
	},
];

// ----------------------------------------------------------------------------
// Asset (에셋) 시드 데이터
// ----------------------------------------------------------------------------

/**
 * 에셋 타입
 */
export type AssetKind = "IMAGE" | "VIDEO" | "DOCUMENT";

/**
 * 에셋 시드 데이터 인터페이스
 */
export interface AssetSeedData {
	originalName: string;
	storageKey: string;
	kind: AssetKind;
	mimeType: string;
	extension: string;
	sizeBytes: number;
	folderPath: string;
	checksum?: string;
	metadata?: Record<string, unknown>;
	createdByEmail?: string;
}

// `storageKey`는 에셋 자체의 안정적인 식별자로, 폴더 이동/앨범 연결보다 우선하는 참조 키입니다.
/**
 * IMAGE 에셋 시드 데이터
 */
export const imageAssetSeedData: AssetSeedData[] = [
	// 로고 이미지
	{
		originalName: "f45-logo-primary.png",
		storageKey: "assets/images/logo/f45-logo-primary-2024.png",
		kind: "IMAGE",
		mimeType: "image/png",
		extension: "png",
		sizeBytes: 245780,
		folderPath: "/에셋 라이브러리/이미지/로고",
		checksum: "sha256:a1b2c3d4e5f6...",
		createdByEmail: "admin@plate.com",
	},
	{
		originalName: "f45-logo-white.png",
		storageKey: "assets/images/logo/f45-logo-white-2024.png",
		kind: "IMAGE",
		mimeType: "image/png",
		extension: "png",
		sizeBytes: 198450,
		folderPath: "/에셋 라이브러리/이미지/로고",
		checksum: "sha256:b2c3d4e5f6g7...",
		createdByEmail: "admin@plate.com",
	},
	{
		originalName: "onora-logo-full.svg",
		storageKey: "assets/images/logo/onora-logo-full-2024.svg",
		kind: "IMAGE",
		mimeType: "image/svg+xml",
		extension: "svg",
		sizeBytes: 15420,
		folderPath: "/에셋 라이브러리/이미지/로고",
		createdByEmail: "admin@plate.com",
	},
	{
		originalName: "crossfit-logo-official.png",
		storageKey: "assets/images/logo/crossfit-logo-official.png",
		kind: "IMAGE",
		mimeType: "image/png",
		extension: "png",
		sizeBytes: 312000,
		folderPath: "/에셋 라이브러리/이미지/로고",
		createdByEmail: "admin@plate.com",
	},

	// 배경 이미지
	{
		originalName: "hero-gym-interior.jpg",
		storageKey: "assets/images/background/hero-gym-interior-2024.jpg",
		kind: "IMAGE",
		mimeType: "image/jpeg",
		extension: "jpg",
		sizeBytes: 1250000,
		folderPath: "/에셋 라이브러리/이미지/배경",
		createdByEmail: "admin@plate.com",
	},
	{
		originalName: "workout-class-action.jpg",
		storageKey: "assets/images/background/workout-class-action-2024.jpg",
		kind: "IMAGE",
		mimeType: "image/jpeg",
		extension: "jpg",
		sizeBytes: 980000,
		folderPath: "/에셋 라이브러리/이미지/배경",
		createdByEmail: "admin@plate.com",
	},
	{
		originalName: "fitness-equipment-banner.jpg",
		storageKey: "assets/images/background/fitness-equipment-banner.jpg",
		kind: "IMAGE",
		mimeType: "image/jpeg",
		extension: "jpg",
		sizeBytes: 1450000,
		folderPath: "/에셋 라이브러리/이미지/배경",
		createdByEmail: "admin@plate.com",
	},

	// 프로필 이미지
	{
		originalName: "profile-default-male.png",
		storageKey: "assets/images/profile/profile-default-male.png",
		kind: "IMAGE",
		mimeType: "image/png",
		extension: "png",
		sizeBytes: 45000,
		folderPath: "/에셋 라이브러리/이미지/프로필",
		createdByEmail: "admin@plate.com",
	},
	{
		originalName: "profile-default-female.png",
		storageKey: "assets/images/profile/profile-default-female.png",
		kind: "IMAGE",
		mimeType: "image/png",
		extension: "png",
		sizeBytes: 42000,
		folderPath: "/에셋 라이브러리/이미지/프로필",
		createdByEmail: "admin@plate.com",
	},
	{
		originalName: "trainer-avatar-sample.jpg",
		storageKey: "assets/images/profile/trainer-avatar-sample.jpg",
		kind: "IMAGE",
		mimeType: "image/jpeg",
		extension: "jpg",
		sizeBytes: 89000,
		folderPath: "/에셋 라이브러리/이미지/프로필",
		createdByEmail: "admin@plate.com",
	},
];

/**
 * VIDEO 에셋 시드 데이터
 */
export const videoAssetSeedData: AssetSeedData[] = [
	// 클래스 영상
	{
		originalName: "f45-training-intro.mp4",
		storageKey: "assets/videos/class/f45-training-intro-2024.mp4",
		kind: "VIDEO",
		mimeType: "video/mp4",
		extension: "mp4",
		sizeBytes: 125000000,
		folderPath: "/에셋 라이브러리/동영상/클래스영상",
		createdByEmail: "admin@plate.com",
	},
	{
		originalName: "hiit-workout-30min.mp4",
		storageKey: "assets/videos/class/hiit-workout-30min.mp4",
		kind: "VIDEO",
		mimeType: "video/mp4",
		extension: "mp4",
		sizeBytes: 89000000,
		folderPath: "/에셋 라이브러리/동영상/클래스영상",
		createdByEmail: "admin@plate.com",
	},
	{
		originalName: "strength-training-basics.mp4",
		storageKey: "assets/videos/class/strength-training-basics.mp4",
		kind: "VIDEO",
		mimeType: "video/mp4",
		extension: "mp4",
		sizeBytes: 156000000,
		folderPath: "/에셋 라이브러리/동영상/클래스영상",
		createdByEmail: "admin@plate.com",
	},

	// 홍보 영상
	{
		originalName: "brand-promo-2024.mp4",
		storageKey: "assets/videos/promo/brand-promo-2024.mp4",
		kind: "VIDEO",
		mimeType: "video/mp4",
		extension: "mp4",
		sizeBytes: 45000000,
		folderPath: "/에셋 라이브러리/동영상/홍보영상",
		createdByEmail: "admin@plate.com",
	},
	{
		originalName: "member-testimonial-compilation.mp4",
		storageKey: "assets/videos/promo/member-testimonial-compilation.mp4",
		kind: "VIDEO",
		mimeType: "video/mp4",
		extension: "mp4",
		sizeBytes: 78000000,
		folderPath: "/에셋 라이브러리/동영상/홍보영상",
		createdByEmail: "admin@plate.com",
	},
];

/**
 * DOCUMENT 에셋 시드 데이터
 */
export const documentAssetSeedData: AssetSeedData[] = [
	// 가이드 문서
	{
		originalName: "회원 가입 가이드.pdf",
		storageKey: "assets/documents/guide/member-signup-guide-2024.pdf",
		kind: "DOCUMENT",
		mimeType: "application/pdf",
		extension: "pdf",
		sizeBytes: 1250000,
		folderPath: "/에셋 라이브러리/문서/가이드",
		createdByEmail: "admin@plate.com",
	},
	{
		originalName: "시설 이용 규정.pdf",
		storageKey: "assets/documents/guide/facility-rules-2024.pdf",
		kind: "DOCUMENT",
		mimeType: "application/pdf",
		extension: "pdf",
		sizeBytes: 890000,
		folderPath: "/에셋 라이브러리/문서/가이드",
		createdByEmail: "admin@plate.com",
	},
	{
		originalName: "운동 프로그램 가이드.docx",
		storageKey: "assets/documents/guide/workout-program-guide-2024.docx",
		kind: "DOCUMENT",
		mimeType:
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		extension: "docx",
		sizeBytes: 2450000,
		folderPath: "/에셋 라이브러리/문서/가이드",
		createdByEmail: "admin@plate.com",
	},

	// 계약서 문서
	{
		originalName: "개인정보 수집 이용 동의서.pdf",
		storageKey: "assets/documents/contract/privacy-consent-form.pdf",
		kind: "DOCUMENT",
		mimeType: "application/pdf",
		extension: "pdf",
		sizeBytes: 156000,
		folderPath: "/에셋 라이브러리/문서/계약서",
		createdByEmail: "admin@plate.com",
	},
	{
		originalName: "회원권 계약서 양식.pdf",
		storageKey: "assets/documents/contract/membership-contract-template.pdf",
		kind: "DOCUMENT",
		mimeType: "application/pdf",
		extension: "pdf",
		sizeBytes: 234000,
		folderPath: "/에셋 라이브러리/문서/계약서",
		createdByEmail: "admin@plate.com",
	},
];

/**
 * 전체 에셋 시드 데이터
 */
export const assetSeedData: AssetSeedData[] = [
	...imageAssetSeedData,
	...videoAssetSeedData,
	...documentAssetSeedData,
];

// ----------------------------------------------------------------------------
// Image (이미지 상세) 시드 데이터
// ----------------------------------------------------------------------------

/**
 * 이미지 상세 시드 데이터 인터페이스
 */
export interface ImageDetailSeedData {
	storageKey: string; // Asset 참조용
	width: number;
	height: number;
	orientation?: number;
	colorSpace?: string;
	hasAlpha: boolean;
}

/**
 * 이미지 상세 시드 데이터 (IMAGE 타입 에셋에 대응)
 */
export const imageDetailSeedData: ImageDetailSeedData[] = [
	// 로고 이미지
	{
		storageKey: "assets/images/logo/f45-logo-primary-2024.png",
		width: 800,
		height: 400,
		orientation: 1,
		colorSpace: "sRGB",
		hasAlpha: true,
	},
	{
		storageKey: "assets/images/logo/f45-logo-white-2024.png",
		width: 800,
		height: 400,
		orientation: 1,
		colorSpace: "sRGB",
		hasAlpha: true,
	},
	{
		storageKey: "assets/images/logo/onora-logo-full-2024.svg",
		width: 512,
		height: 512,
		orientation: 1,
		colorSpace: "sRGB",
		hasAlpha: true,
	},
	{
		storageKey: "assets/images/logo/crossfit-logo-official.png",
		width: 1024,
		height: 512,
		orientation: 1,
		colorSpace: "sRGB",
		hasAlpha: true,
	},

	// 배경 이미지
	{
		storageKey: "assets/images/background/hero-gym-interior-2024.jpg",
		width: 1920,
		height: 1080,
		orientation: 1,
		colorSpace: "sRGB",
		hasAlpha: false,
	},
	{
		storageKey: "assets/images/background/workout-class-action-2024.jpg",
		width: 1920,
		height: 1080,
		orientation: 1,
		colorSpace: "sRGB",
		hasAlpha: false,
	},
	{
		storageKey: "assets/images/background/fitness-equipment-banner.jpg",
		width: 2560,
		height: 1440,
		orientation: 1,
		colorSpace: "sRGB",
		hasAlpha: false,
	},

	// 프로필 이미지
	{
		storageKey: "assets/images/profile/profile-default-male.png",
		width: 200,
		height: 200,
		orientation: 1,
		colorSpace: "sRGB",
		hasAlpha: true,
	},
	{
		storageKey: "assets/images/profile/profile-default-female.png",
		width: 200,
		height: 200,
		orientation: 1,
		colorSpace: "sRGB",
		hasAlpha: true,
	},
	{
		storageKey: "assets/images/profile/trainer-avatar-sample.jpg",
		width: 300,
		height: 300,
		orientation: 1,
		colorSpace: "sRGB",
		hasAlpha: false,
	},
];

// ----------------------------------------------------------------------------
// Video (비디오 상세) 시드 데이터
// ----------------------------------------------------------------------------

/**
 * 비디오 상세 시드 데이터 인터페이스
 */
export interface VideoDetailSeedData {
	storageKey: string; // Asset 참조용
	width: number;
	height: number;
	durationMs: number;
	frameRate?: number;
	codec?: string;
	bitrate?: number;
	hasAudio: boolean;
}

/**
 * 비디오 상세 시드 데이터 (VIDEO 타입 에셋에 대응)
 */
export const videoDetailSeedData: VideoDetailSeedData[] = [
	// 클래스 영상
	{
		storageKey: "assets/videos/class/f45-training-intro-2024.mp4",
		width: 1920,
		height: 1080,
		durationMs: 180000, // 3분
		frameRate: 30,
		codec: "h264",
		bitrate: 5000000,
		hasAudio: true,
	},
	{
		storageKey: "assets/videos/class/hiit-workout-30min.mp4",
		width: 1920,
		height: 1080,
		durationMs: 1800000, // 30분
		frameRate: 30,
		codec: "h264",
		bitrate: 4000000,
		hasAudio: true,
	},
	{
		storageKey: "assets/videos/class/strength-training-basics.mp4",
		width: 1920,
		height: 1080,
		durationMs: 600000, // 10분
		frameRate: 30,
		codec: "h264",
		bitrate: 6000000,
		hasAudio: true,
	},

	// 홍보 영상
	{
		storageKey: "assets/videos/promo/brand-promo-2024.mp4",
		width: 1920,
		height: 1080,
		durationMs: 60000, // 1분
		frameRate: 30,
		codec: "h264",
		bitrate: 8000000,
		hasAudio: true,
	},
	{
		storageKey: "assets/videos/promo/member-testimonial-compilation.mp4",
		width: 1920,
		height: 1080,
		durationMs: 120000, // 2분
		frameRate: 30,
		codec: "h264",
		bitrate: 5000000,
		hasAudio: true,
	},
];

// ----------------------------------------------------------------------------
// Document (문서 상세) 시드 데이터
// ----------------------------------------------------------------------------

/**
 * 문서 상세 시드 데이터 인터페이스
 */
export interface DocumentDetailSeedData {
	storageKey: string; // Asset 참조용
	pageCount?: number;
	wordCount?: number;
	author?: string;
	title?: string;
	subject?: string;
	keywords?: string;
}

/**
 * 문서 상세 시드 데이터 (DOCUMENT 타입 에셋에 대응)
 */
export const documentDetailSeedData: DocumentDetailSeedData[] = [
	// 가이드 문서
	{
		storageKey: "assets/documents/guide/member-signup-guide-2024.pdf",
		pageCount: 12,
		wordCount: 3500,
		author: "오노라 운영팀",
		title: "회원 가입 가이드",
		subject: "회원 가입 절차 안내",
		keywords: "회원,가입,가이드,안내",
	},
	{
		storageKey: "assets/documents/guide/facility-rules-2024.pdf",
		pageCount: 8,
		wordCount: 2100,
		author: "오노라 운영팀",
		title: "시설 이용 규정",
		subject: "피트니스 시설 이용 규정 안내",
		keywords: "시설,이용,규정,안내",
	},
	{
		storageKey: "assets/documents/guide/workout-program-guide-2024.docx",
		pageCount: 25,
		wordCount: 8500,
		author: "오노라 트레이닝팀",
		title: "운동 프로그램 가이드",
		subject: "운동 프로그램 구성 및 진행 가이드",
		keywords: "운동,프로그램,가이드,트레이닝",
	},

	// 계약서 문서
	{
		storageKey: "assets/documents/contract/privacy-consent-form.pdf",
		pageCount: 3,
		wordCount: 800,
		author: "온짓다 법무팀",
		title: "개인정보 수집 이용 동의서",
		subject: "개인정보 수집 및 이용에 대한 동의",
		keywords: "개인정보,동의,수집,이용",
	},
	{
		storageKey: "assets/documents/contract/membership-contract-template.pdf",
		pageCount: 5,
		wordCount: 1500,
		author: "온짓다 법무팀",
		title: "회원권 계약서 양식",
		subject: "회원권 계약 표준 양식",
		keywords: "회원권,계약서,양식,표준",
	},
];

// ----------------------------------------------------------------------------
// Derivative (파생 리소스) 시드 데이터
// ----------------------------------------------------------------------------

/**
 * 파생 리소스 타입
 */
export type DerivativeKind = "THUMBNAIL" | "PREVIEW" | "TRANSCODE" | "TEXT";

/**
 * 파생 리소스 시드 데이터 인터페이스
 */
export interface DerivativeSeedData {
	sourceStorageKey: string; // 원본 Asset 참조용
	kind: DerivativeKind;
	profile: string;
	storageKey: string;
	mimeType: string;
	sizeBytes: number;
	width?: number;
	height?: number;
	durationMs?: number;
}

/**
 * 파생 리소스 시드 데이터
 *
 * 썸네일: 이미지/비디오의 작은 크기 미리보기
 * 프리뷰: 중간 크기 미리보기 (비디오의 경우 GIF 가능)
 */
export const derivativeSeedData: DerivativeSeedData[] = [
	// 이미지 썸네일 (THUMBNAIL)
	{
		sourceStorageKey: "assets/images/logo/f45-logo-primary-2024.png",
		kind: "THUMBNAIL",
		profile: "small",
		storageKey: "assets/derivatives/thumbnails/f45-logo-primary-thumb.png",
		mimeType: "image/png",
		sizeBytes: 12500,
		width: 150,
		height: 75,
	},
	{
		sourceStorageKey: "assets/images/background/hero-gym-interior-2024.jpg",
		kind: "THUMBNAIL",
		profile: "small",
		storageKey: "assets/derivatives/thumbnails/hero-gym-interior-thumb.jpg",
		mimeType: "image/jpeg",
		sizeBytes: 18500,
		width: 320,
		height: 180,
	},
	{
		sourceStorageKey: "assets/images/background/workout-class-action-2024.jpg",
		kind: "THUMBNAIL",
		profile: "small",
		storageKey: "assets/derivatives/thumbnails/workout-class-action-thumb.jpg",
		mimeType: "image/jpeg",
		sizeBytes: 17200,
		width: 320,
		height: 180,
	},
	{
		sourceStorageKey: "assets/images/profile/trainer-avatar-sample.jpg",
		kind: "THUMBNAIL",
		profile: "avatar",
		storageKey: "assets/derivatives/thumbnails/trainer-avatar-thumb.jpg",
		mimeType: "image/jpeg",
		sizeBytes: 8500,
		width: 64,
		height: 64,
	},

	// 이미지 프리뷰 (PREVIEW)
	{
		sourceStorageKey: "assets/images/background/hero-gym-interior-2024.jpg",
		kind: "PREVIEW",
		profile: "medium",
		storageKey: "assets/derivatives/previews/hero-gym-interior-preview.jpg",
		mimeType: "image/jpeg",
		sizeBytes: 125000,
		width: 1280,
		height: 720,
	},
	{
		sourceStorageKey: "assets/images/background/workout-class-action-2024.jpg",
		kind: "PREVIEW",
		profile: "medium",
		storageKey: "assets/derivatives/previews/workout-class-action-preview.jpg",
		mimeType: "image/jpeg",
		sizeBytes: 98000,
		width: 1280,
		height: 720,
	},

	// 비디오 썸네일 (THUMBNAIL)
	{
		sourceStorageKey: "assets/videos/class/f45-training-intro-2024.mp4",
		kind: "THUMBNAIL",
		profile: "default",
		storageKey: "assets/derivatives/thumbnails/f45-training-intro-thumb.jpg",
		mimeType: "image/jpeg",
		sizeBytes: 25000,
		width: 320,
		height: 180,
	},
	{
		sourceStorageKey: "assets/videos/class/hiit-workout-30min.mp4",
		kind: "THUMBNAIL",
		profile: "default",
		storageKey: "assets/derivatives/thumbnails/hiit-workout-thumb.jpg",
		mimeType: "image/jpeg",
		sizeBytes: 22000,
		width: 320,
		height: 180,
	},
	{
		sourceStorageKey: "assets/videos/promo/brand-promo-2024.mp4",
		kind: "THUMBNAIL",
		profile: "default",
		storageKey: "assets/derivatives/thumbnails/brand-promo-thumb.jpg",
		mimeType: "image/jpeg",
		sizeBytes: 28000,
		width: 320,
		height: 180,
	},

	// 비디오 프리뷰 (PREVIEW) - 낮은 해상도 스트리밍용
	{
		sourceStorageKey: "assets/videos/class/f45-training-intro-2024.mp4",
		kind: "PREVIEW",
		profile: "lowres",
		storageKey: "assets/derivatives/previews/f45-training-intro-preview.mp4",
		mimeType: "video/mp4",
		sizeBytes: 25000000,
		width: 640,
		height: 360,
		durationMs: 180000,
	},
	{
		sourceStorageKey: "assets/videos/promo/brand-promo-2024.mp4",
		kind: "PREVIEW",
		profile: "lowres",
		storageKey: "assets/derivatives/previews/brand-promo-preview.mp4",
		mimeType: "video/mp4",
		sizeBytes: 8000000,
		width: 640,
		height: 360,
		durationMs: 60000,
	},
];

// ----------------------------------------------------------------------------
// Album (앨범) 시드 데이터
// ----------------------------------------------------------------------------

/**
 * 앨범 시드 데이터 인터페이스
 */
export interface AlbumSeedData {
	name: string;
	description?: string;
	coverStorageKey?: string; // 커버 이미지 Asset 참조용
	sortOrder: number;
	createdByEmail?: string;
}

/**
 * 앨범 시드 데이터
 */
export const albumSeedData: AlbumSeedData[] = [
	{
		name: "브랜드 에셋",
		description: "오노라 및 파트너 브랜드 로고, 아이덴티티 에셋 모음",
		coverStorageKey: "assets/images/logo/f45-logo-primary-2024.png",
		sortOrder: 0,
		createdByEmail: "admin@plate.com",
	},
	{
		name: "웹사이트 배너",
		description: "웹사이트 메인 및 서브 배너용 이미지 모음",
		coverStorageKey: "assets/images/background/hero-gym-interior-2024.jpg",
		sortOrder: 1,
		createdByEmail: "admin@plate.com",
	},
	{
		name: "클래스 홍보 영상",
		description: "클래스 소개 및 홍보용 영상 모음",
		coverStorageKey: "assets/videos/promo/brand-promo-2024.mp4",
		sortOrder: 2,
		createdByEmail: "admin@plate.com",
	},
];

// ----------------------------------------------------------------------------
// AlbumEntry (앨범 엔트리) 시드 데이터
// ----------------------------------------------------------------------------

/**
 * 앨범 엔트리 시드 데이터 인터페이스
 */
export interface AlbumEntrySeedData {
	albumName: string; // 앨범 참조용
	assetStorageKey: string; // 에셋 참조용
	position: number;
	caption?: string;
}

/**
 * 앨범 엔트리 시드 데이터
 */
export const albumEntrySeedData: AlbumEntrySeedData[] = [
	// 브랜드 에셋 앨범
	{
		albumName: "브랜드 에셋",
		assetStorageKey: "assets/images/logo/f45-logo-primary-2024.png",
		position: 0,
		caption: "F45 메인 로고",
	},
	{
		albumName: "브랜드 에셋",
		assetStorageKey: "assets/images/logo/f45-logo-white-2024.png",
		position: 1,
		caption: "F45 화이트 로고 (어두운 배경용)",
	},
	{
		albumName: "브랜드 에셋",
		assetStorageKey: "assets/images/logo/onora-logo-full-2024.svg",
		position: 2,
		caption: "오노라 풀 로고 (SVG)",
	},
	{
		albumName: "브랜드 에셋",
		assetStorageKey: "assets/images/logo/crossfit-logo-official.png",
		position: 3,
		caption: "크로스핏 공식 로고",
	},

	// 웹사이트 배너 앨범
	{
		albumName: "웹사이트 배너",
		assetStorageKey: "assets/images/background/hero-gym-interior-2024.jpg",
		position: 0,
		caption: "메인 히어로 배너",
	},
	{
		albumName: "웹사이트 배너",
		assetStorageKey: "assets/images/background/workout-class-action-2024.jpg",
		position: 1,
		caption: "클래스 액션 배너",
	},
	{
		albumName: "웹사이트 배너",
		assetStorageKey: "assets/images/background/fitness-equipment-banner.jpg",
		position: 2,
		caption: "장비 소개 배너",
	},
	{
		albumName: "웹사이트 배너",
		assetStorageKey: "assets/images/profile/trainer-avatar-sample.jpg",
		position: 3,
		caption: "트레이너 소개 배너용 샘플",
	},

	// 클래스 홍보 영상 앨범
	{
		albumName: "클래스 홍보 영상",
		assetStorageKey: "assets/videos/promo/brand-promo-2024.mp4",
		position: 0,
		caption: "2024 브랜드 홍보 영상",
	},
	{
		albumName: "클래스 홍보 영상",
		assetStorageKey: "assets/videos/promo/member-testimonial-compilation.mp4",
		position: 1,
		caption: "회원 후기 영상 모음",
	},
	{
		albumName: "클래스 홍보 영상",
		assetStorageKey: "assets/videos/class/f45-training-intro-2024.mp4",
		position: 2,
		caption: "F45 트레이닝 소개 영상",
	},
	{
		albumName: "클래스 홍보 영상",
		assetStorageKey: "assets/videos/class/hiit-workout-30min.mp4",
		position: 3,
		caption: "HIIT 30분 클래스",
	},
	{
		albumName: "클래스 홍보 영상",
		assetStorageKey: "assets/videos/class/strength-training-basics.mp4",
		position: 4,
		caption: "스트렝스 트레이닝 기초",
	},
];
