/**
 * Feature 아이템 설정 인터페이스
 *
 * 메뉴 외 UI 기능(버튼, 액션 등)의 가시성을 제어하기 위한 Subject 정의
 */
export interface FeatureItemConfig {
	/** 고유 식별자 */
	id: string;
	/** Feature Subject name (예: feature:export) */
	subject: string;
	/** 표시명 */
	label: string;
	/** 설명 (관리 화면용) */
	description?: string;
	/** 카테고리 (그룹화용) */
	category?: string;
}

/**
 * 어드민 Feature Subject 상수
 *
 * Subject 네이밍 규칙:
 * - feature:{기능명} - 단일 기능
 * - feature:{엔티티}:{기능명} - 엔티티별 기능
 */
export const ADMIN_FEATURE_SUBJECTS = {
	// 공통 기능
	FEATURE_EXPORT: "feature:export",
	FEATURE_IMPORT: "feature:import",
	FEATURE_BULK_DELETE: "feature:bulk-delete",
	FEATURE_BULK_UPDATE: "feature:bulk-update",

	// 사용자 관련 기능
	FEATURE_USER_INVITE: "feature:user:invite",
	FEATURE_USER_RESET_PASSWORD: "feature:user:reset-password",
	FEATURE_USER_DEACTIVATE: "feature:user:deactivate",

	// 파일 관련 기능
	FEATURE_FILE_DOWNLOAD: "feature:file:download",
	FEATURE_FILE_BULK_DOWNLOAD: "feature:file:bulk-download",

	// 지갑 관련 기능
	FEATURE_WALLET_TRANSFER: "feature:wallet:transfer",
	FEATURE_WALLET_APPROVE: "feature:wallet:approve",

	// 시스템 관련 기능
	FEATURE_SYSTEM_BACKUP: "feature:system:backup",
	FEATURE_SYSTEM_RESTORE: "feature:system:restore",
	FEATURE_SYSTEM_AUDIT_LOG: "feature:system:audit-log",
} as const;

/**
 * 어드민 Feature 아이템 설정
 *
 * 관리 화면에서 Feature Subject를 관리할 때 사용됩니다.
 */
export const ADMIN_FEATURE_ITEMS: FeatureItemConfig[] = [
	// 공통 기능
	{
		id: "export",
		subject: ADMIN_FEATURE_SUBJECTS.FEATURE_EXPORT,
		label: "내보내기",
		description: "데이터를 CSV/Excel로 내보내기",
		category: "common",
	},
	{
		id: "import",
		subject: ADMIN_FEATURE_SUBJECTS.FEATURE_IMPORT,
		label: "가져오기",
		description: "CSV/Excel에서 데이터 가져오기",
		category: "common",
	},
	{
		id: "bulk-delete",
		subject: ADMIN_FEATURE_SUBJECTS.FEATURE_BULK_DELETE,
		label: "일괄 삭제",
		description: "선택한 항목 일괄 삭제",
		category: "common",
	},
	{
		id: "bulk-update",
		subject: ADMIN_FEATURE_SUBJECTS.FEATURE_BULK_UPDATE,
		label: "일괄 수정",
		description: "선택한 항목 일괄 수정",
		category: "common",
	},

	// 사용자 관련 기능
	{
		id: "user-invite",
		subject: ADMIN_FEATURE_SUBJECTS.FEATURE_USER_INVITE,
		label: "사용자 초대",
		description: "이메일로 사용자 초대",
		category: "user",
	},
	{
		id: "user-reset-password",
		subject: ADMIN_FEATURE_SUBJECTS.FEATURE_USER_RESET_PASSWORD,
		label: "비밀번호 초기화",
		description: "사용자 비밀번호 초기화",
		category: "user",
	},
	{
		id: "user-deactivate",
		subject: ADMIN_FEATURE_SUBJECTS.FEATURE_USER_DEACTIVATE,
		label: "사용자 비활성화",
		description: "사용자 계정 비활성화",
		category: "user",
	},

	// 파일 관련 기능
	{
		id: "file-download",
		subject: ADMIN_FEATURE_SUBJECTS.FEATURE_FILE_DOWNLOAD,
		label: "파일 다운로드",
		description: "개별 파일 다운로드",
		category: "file",
	},
	{
		id: "file-bulk-download",
		subject: ADMIN_FEATURE_SUBJECTS.FEATURE_FILE_BULK_DOWNLOAD,
		label: "파일 일괄 다운로드",
		description: "선택한 파일 일괄 다운로드",
		category: "file",
	},

	// 지갑 관련 기능
	{
		id: "wallet-transfer",
		subject: ADMIN_FEATURE_SUBJECTS.FEATURE_WALLET_TRANSFER,
		label: "이체",
		description: "지갑 간 자산 이체",
		category: "wallet",
	},
	{
		id: "wallet-approve",
		subject: ADMIN_FEATURE_SUBJECTS.FEATURE_WALLET_APPROVE,
		label: "트랜잭션 승인",
		description: "멀티시그 트랜잭션 승인",
		category: "wallet",
	},

	// 시스템 관련 기능
	{
		id: "system-backup",
		subject: ADMIN_FEATURE_SUBJECTS.FEATURE_SYSTEM_BACKUP,
		label: "백업",
		description: "시스템 데이터 백업",
		category: "system",
	},
	{
		id: "system-restore",
		subject: ADMIN_FEATURE_SUBJECTS.FEATURE_SYSTEM_RESTORE,
		label: "복원",
		description: "백업에서 시스템 복원",
		category: "system",
	},
	{
		id: "system-audit-log",
		subject: ADMIN_FEATURE_SUBJECTS.FEATURE_SYSTEM_AUDIT_LOG,
		label: "감사 로그",
		description: "시스템 감사 로그 조회",
		category: "system",
	},
];
