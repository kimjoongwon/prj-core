/**
 * @cocrepo/api
 * Generated API client and types from OpenAPI specs using orval
 */

// Export all APIs
export * from "./apis";
export * as APIManager from "./apis";
// Export custom axios instance for direct usage if needed
export {
	AXIOS_INSTANCE,
	customInstance,
	setApiPersistStore,
} from "./libs/customAxios";
// Export all types and models
export * from "./model";

// ============================================
// 임시 더미 타입/함수 (staging 서버에 배포 후 제거)
// TODO: 서버에 해당 API 배포 후 이 섹션 제거
// ============================================

/**
 * AbilityResponseDto - 임시 타입
 * AbilityApiResponse와 호환되도록 타입 정의
 */
export interface AbilityResponseDto {
	id: string;
	action: string;
	subject: { id: string; name: string };
	subjectId: string;
	type: "CAN" | "CAN_NOT";
	conditions?: Record<string, unknown> | null;
	description?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt?: string;
}

/**
 * CreateAbilityDto - 임시 타입
 */
export interface CreateAbilityDto {
	action: string | string[];
	subject?: string;
	subjectId: string;
	type?: string;
	conditions?: Record<string, unknown>;
	description?: string;
	isActive?: boolean;
}

/**
 * SubjectResponseDto - 임시 타입
 */
export interface SubjectResponseDto {
	id: string;
	name: string;
	displayName?: string;
	description?: string;
	group?: string;
	parentId?: string;
	order?: number;
	label?: string;
	type?: string;
}

/**
 * UserStatsDto - 임시 타입
 */
export interface UserStatsDto {
	total: number;
	active: number;
	inactive: number;
	newThisMonth: number;
	totalUsers: number;
	activeUsers: number;
	newUsersThisMonth: number;
	newUsersThisWeek: number;
}

/**
 * getMyAbilities - 임시 함수
 */
export const getMyAbilities = async (): Promise<{
	data: AbilityResponseDto[];
}> => {
	console.warn("getMyAbilities: 임시 더미 함수입니다. 서버 배포 후 실제 API로 교체 필요");
	return { data: [] };
};

/**
 * useGetAbilitiesByRoleId - 임시 훅
 */
export const useGetAbilitiesByRoleId = (
	_roleId: string,
	_options?: { query?: { enabled?: boolean } },
) => {
	console.warn("useGetAbilitiesByRoleId: 임시 더미 훅입니다.");
	return {
		data: { data: [] as AbilityResponseDto[] },
		isLoading: false,
		error: null,
		refetch: () => Promise.resolve({ data: { data: [] } }),
	};
};

/**
 * useGetAllSubjects - 임시 훅
 */
export const useGetAllSubjects = () => {
	console.warn("useGetAllSubjects: 임시 더미 훅입니다.");
	return {
		data: { data: [] as SubjectResponseDto[] },
		isLoading: false,
		error: null,
	};
};

/**
 * useUpdateRoleAbilities - 임시 훅
 */
export const useUpdateRoleAbilities = () => {
	console.warn("useUpdateRoleAbilities: 임시 더미 훅입니다.");
	return {
		mutateAsync: async (_params: {
			roleId: string;
			data: { abilities: CreateAbilityDto[] };
		}) => ({ data: [] }),
		isLoading: false,
		error: null,
	};
};
