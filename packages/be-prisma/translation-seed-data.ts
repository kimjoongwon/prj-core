import type { LanguageCode } from "@cocrepo/constant";

/**
 * Translation 시드 데이터 인터페이스
 */
export interface TranslationSeedData {
	languageCode: LanguageCode;
	key: string;
	text: string;
	category: string;
	isTranslated: boolean;
}

/**
 * Translation 시드 데이터
 *
 * 4개 언어 × 5개 카테고리 번역 데이터
 * - common: 공통 메시지
 * - error: 에러 메시지
 * - validation: 검증 메시지
 * - menu: 메뉴 제목
 * - role: 역할 이름
 */
export const translationSeedData: TranslationSeedData[] = [
	// ============================================================================
	// Common Messages (공통 메시지)
	// ============================================================================

	// Korean (ko_KR)
	{ languageCode: "ko_KR", key: "common.success", text: "성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.created", text: "생성 완료", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.updated", text: "수정 완료", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.deleted", text: "삭제 완료", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.notFound", text: "요청한 데이터를 찾을 수 없습니다", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.list.success", text: "목록 조회 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.read.success", text: "조회 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.create.success", text: "생성 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.update.success", text: "수정 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.delete.success", text: "삭제 성공", category: "common", isTranslated: true },

	// Auth
	{ languageCode: "ko_KR", key: "common.auth.login.success", text: "로그인 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.auth.logout.success", text: "로그아웃 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.auth.register.success", text: "회원가입 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.auth.refresh.success", text: "토큰 재발급 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.auth.renew.success", text: "토큰 갱신 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.auth.validate.success", text: "토큰 유효성 검증 완료", category: "common", isTranslated: true },

	// User
	{ languageCode: "ko_KR", key: "common.user.list.success", text: "회원 목록 조회 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.user.read.success", text: "회원 상세 조회 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.user.create.success", text: "회원 등록 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.user.update.success", text: "회원 수정 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.user.delete.success", text: "회원 삭제 성공", category: "common", isTranslated: true },

	// Role
	{ languageCode: "ko_KR", key: "common.role.list.success", text: "역할 목록 조회 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.role.read.success", text: "역할 조회 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.role.create.success", text: "역할 생성 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.role.update.success", text: "역할 수정 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.role.delete.success", text: "역할 삭제 성공", category: "common", isTranslated: true },

	// Ability
	{ languageCode: "ko_KR", key: "common.ability.my.success", text: "내 권한 조회 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.ability.byRole.success", text: "Role별 권한 조회 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.ability.byUser.success", text: "User별 예외 권한 조회 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.ability.read.success", text: "권한 조회 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.ability.create.success", text: "권한 정의 생성 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.ability.update.success", text: "권한 정의 수정 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.ability.delete.success", text: "권한 삭제 성공", category: "common", isTranslated: true },

	// Action
	{ languageCode: "ko_KR", key: "common.action.list.success", text: "Action 목록 조회 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.action.read.success", text: "Action 조회 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.action.create.success", text: "Action 생성 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.action.update.success", text: "Action 수정 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.action.delete.success", text: "Action 삭제 성공", category: "common", isTranslated: true },

	// Subject
	{ languageCode: "ko_KR", key: "common.subject.list.success", text: "Subject 목록 조회 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.subject.fields.success", text: "Subject 필드 목록 조회 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.subject.read.success", text: "Subject 조회 성공", category: "common", isTranslated: true },

	// Ground
	{ languageCode: "ko_KR", key: "common.ground.list.success", text: "Ground 목록 조회 성공", category: "common", isTranslated: true },
	{ languageCode: "ko_KR", key: "common.ground.mySpace.success", text: "내 Space의 Ground 목록 조회 성공", category: "common", isTranslated: true },

	// English (en_US) - Common
	{ languageCode: "en_US", key: "common.success", text: "Success", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.created", text: "Created successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.updated", text: "Updated successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.deleted", text: "Deleted successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.notFound", text: "Requested data not found", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.list.success", text: "List retrieved successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.read.success", text: "Retrieved successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.create.success", text: "Created successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.update.success", text: "Updated successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.delete.success", text: "Deleted successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.auth.login.success", text: "Login successful", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.auth.logout.success", text: "Logout successful", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.auth.register.success", text: "Registration successful", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.auth.refresh.success", text: "Token refreshed successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.auth.renew.success", text: "Token renewed successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.auth.validate.success", text: "Token validated successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.user.list.success", text: "User list retrieved successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.user.read.success", text: "User details retrieved successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.user.create.success", text: "User registered successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.user.update.success", text: "User updated successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.user.delete.success", text: "User deleted successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.role.list.success", text: "Role list retrieved successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.role.read.success", text: "Role retrieved successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.role.create.success", text: "Role created successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.role.update.success", text: "Role updated successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.role.delete.success", text: "Role deleted successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.ability.my.success", text: "My permissions retrieved successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.ability.byRole.success", text: "Permissions by role retrieved successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.ability.byUser.success", text: "Exception permissions by user retrieved successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.ability.read.success", text: "Permission retrieved successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.ability.create.success", text: "Permission definition created successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.ability.update.success", text: "Permission definition updated successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.ability.delete.success", text: "Permission deleted successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.action.list.success", text: "Action list retrieved successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.action.read.success", text: "Action retrieved successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.action.create.success", text: "Action created successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.action.update.success", text: "Action updated successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.action.delete.success", text: "Action deleted successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.subject.list.success", text: "Subject list retrieved successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.subject.fields.success", text: "Subject fields retrieved successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.subject.read.success", text: "Subject retrieved successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.ground.list.success", text: "Ground list retrieved successfully", category: "common", isTranslated: true },
	{ languageCode: "en_US", key: "common.ground.mySpace.success", text: "My space ground list retrieved successfully", category: "common", isTranslated: true },

	// Chinese (zh_CN) - Common (key translations only)
	{ languageCode: "zh_CN", key: "common.success", text: "成功", category: "common", isTranslated: true },
	{ languageCode: "zh_CN", key: "common.created", text: "创建成功", category: "common", isTranslated: true },
	{ languageCode: "zh_CN", key: "common.updated", text: "更新成功", category: "common", isTranslated: true },
	{ languageCode: "zh_CN", key: "common.deleted", text: "删除成功", category: "common", isTranslated: true },
	{ languageCode: "zh_CN", key: "common.auth.login.success", text: "登录成功", category: "common", isTranslated: true },
	{ languageCode: "zh_CN", key: "common.auth.logout.success", text: "登出成功", category: "common", isTranslated: true },

	// Japanese (ja_JP) - Common (key translations only)
	{ languageCode: "ja_JP", key: "common.success", text: "成功", category: "common", isTranslated: true },
	{ languageCode: "ja_JP", key: "common.created", text: "作成完了", category: "common", isTranslated: true },
	{ languageCode: "ja_JP", key: "common.updated", text: "更新完了", category: "common", isTranslated: true },
	{ languageCode: "ja_JP", key: "common.deleted", text: "削除完了", category: "common", isTranslated: true },
	{ languageCode: "ja_JP", key: "common.auth.login.success", text: "ログイン成功", category: "common", isTranslated: true },
	{ languageCode: "ja_JP", key: "common.auth.logout.success", text: "ログアウト成功", category: "common", isTranslated: true },

	// ============================================================================
	// Error Messages (에러 메시지)
	// ============================================================================

	// Prisma Errors - Korean
	{ languageCode: "ko_KR", key: "error.prisma.P2002", text: "중복된 데이터가 존재합니다", category: "error", isTranslated: true },
	{ languageCode: "ko_KR", key: "error.prisma.P2025", text: "요청한 데이터를 찾을 수 없습니다", category: "error", isTranslated: true },
	{ languageCode: "ko_KR", key: "error.prisma.P2003", text: "연관된 데이터가 존재하지 않습니다", category: "error", isTranslated: true },
	{ languageCode: "ko_KR", key: "error.prisma.P2016", text: "데이터베이스 스키마 불일치 오류", category: "error", isTranslated: true },

	// Prisma Errors - English
	{ languageCode: "en_US", key: "error.prisma.P2002", text: "Duplicate data exists", category: "error", isTranslated: true },
	{ languageCode: "en_US", key: "error.prisma.P2025", text: "Requested data not found", category: "error", isTranslated: true },
	{ languageCode: "en_US", key: "error.prisma.P2003", text: "Related data does not exist", category: "error", isTranslated: true },
	{ languageCode: "en_US", key: "error.prisma.P2016", text: "Database schema mismatch error", category: "error", isTranslated: true },

	// Auth Errors - Korean
	{ languageCode: "ko_KR", key: "error.auth.unauthorized", text: "인증이 필요합니다", category: "error", isTranslated: true },
	{ languageCode: "ko_KR", key: "error.auth.forbidden", text: "접근 권한이 없습니다", category: "error", isTranslated: true },
	{ languageCode: "ko_KR", key: "error.auth.invalidToken", text: "유효하지 않은 토큰입니다", category: "error", isTranslated: true },

	// Auth Errors - English
	{ languageCode: "en_US", key: "error.auth.unauthorized", text: "Authentication required", category: "error", isTranslated: true },
	{ languageCode: "en_US", key: "error.auth.forbidden", text: "Access denied", category: "error", isTranslated: true },
	{ languageCode: "en_US", key: "error.auth.invalidToken", text: "Invalid token", category: "error", isTranslated: true },

	// ============================================================================
	// Validation Messages (검증 메시지)
	// ============================================================================

	// Korean
	{ languageCode: "ko_KR", key: "validation.required", text: "필수 입력 항목입니다", category: "validation", isTranslated: true },
	{ languageCode: "ko_KR", key: "validation.emailFormat", text: "유효한 이메일 주소를 입력해주세요", category: "validation", isTranslated: true },
	{ languageCode: "ko_KR", key: "validation.minLength", text: "최소 {{min}}자 이상 입력해주세요", category: "validation", isTranslated: true },
	{ languageCode: "ko_KR", key: "validation.maxLength", text: "최대 {{max}}자까지 입력 가능합니다", category: "validation", isTranslated: true },

	// English
	{ languageCode: "en_US", key: "validation.required", text: "This field is required", category: "validation", isTranslated: true },
	{ languageCode: "en_US", key: "validation.emailFormat", text: "Please enter a valid email address", category: "validation", isTranslated: true },
	{ languageCode: "en_US", key: "validation.minLength", text: "Must be at least {{min}} characters", category: "validation", isTranslated: true },
	{ languageCode: "en_US", key: "validation.maxLength", text: "Must be at most {{max}} characters", category: "validation", isTranslated: true },
];
