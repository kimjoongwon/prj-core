"use client";

import { useMemo } from "react";

// TODO: API가 생성되면 아래 주석 해제
// import { useGetColumnsByEntity } from "@cocrepo/api";

// 임시 타입 정의 - API 생성 전까지 사용
interface ColumnDefinition {
	id: string;
	entity: string;
	field: string;
	label: string;
	sortOrder: number;
	isRequired: boolean;
	visibleOnDesktop: boolean;
	visibleOnTablet: boolean;
	visibleOnMobile: boolean;
	sortable: boolean;
	width?: string;
	minWidth?: string;
}

// 임시 mock - API 생성 전까지 사용
const useGetColumnsByEntity = (
	_entity: string,
	_params?: { deviceType?: string },
) => {
	return {
		data: { data: [] as ColumnDefinition[] },
		isLoading: false,
		isError: false,
	};
};

/**
 * 디바이스 타입 정의
 * - desktop: 1280px 이상
 * - tablet: 768px - 1279px
 * - mobile: 768px 미만
 */
export type DeviceType = "desktop" | "tablet" | "mobile";

/**
 * useColumnVisibility Hook
 *
 * 특정 엔티티의 컬럼 가시성을 디바이스 타입에 따라 관리합니다.
 *
 * @param entity - 엔티티명 (예: "User", "Reservation")
 * @param deviceType - 디바이스 타입 (desktop/tablet/mobile)
 *
 * @example
 * ```tsx
 * function UserTable() {
 *   const deviceType = useDeviceType();
 *   const { columns, isLoading } = useColumnVisibility("User", deviceType);
 *
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <Table>
 *       <thead>
 *         <tr>
 *           {columns.map(col => (
 *             <th key={col.id}>{col.label}</th>
 *           ))}
 *         </tr>
 *       </thead>
 *     </Table>
 *   );
 * }
 * ```
 */
export function useColumnVisibility(entity: string, deviceType: DeviceType) {
	// API 호출 - deviceType을 query parameter로 전달
	const { data, isLoading, isError } = useGetColumnsByEntity(entity, {
		deviceType,
	});

	// 컬럼 정렬 (sortOrder 기준)
	const sortedColumns = useMemo(() => {
		if (!data?.data) return [];
		return [...data.data].sort((a, b) => a.sortOrder - b.sortOrder);
	}, [data?.data]);

	return {
		/** 정렬된 컬럼 목록 */
		columns: sortedColumns,
		/** 로딩 상태 */
		isLoading,
		/** 에러 상태 */
		isError,
		/** 원본 데이터 */
		rawData: data,
	};
}

/**
 * 컬럼 필드명 목록만 추출하는 유틸리티 hook
 *
 * @example
 * ```tsx
 * const { fields } = useColumnFields("User", deviceType);
 * // ["id", "email", "name", "createdAt"]
 * ```
 */
export function useColumnFields(entity: string, deviceType: DeviceType) {
	const { columns, isLoading, isError } = useColumnVisibility(
		entity,
		deviceType,
	);

	const fields = useMemo(() => {
		return columns.map((col) => col.field);
	}, [columns]);

	return {
		/** 필드명 배열 */
		fields,
		/** 로딩 상태 */
		isLoading,
		/** 에러 상태 */
		isError,
	};
}

/**
 * 컬럼 가시성 맵 (field → 가시성) 생성 유틸리티 hook
 *
 * @example
 * ```tsx
 * const { visibilityMap } = useColumnVisibilityMap("User", deviceType);
 * // { email: true, phone: false, ... }
 *
 * {visibilityMap["email"] && <td>{user.email}</td>}
 * ```
 */
export function useColumnVisibilityMap(entity: string, deviceType: DeviceType) {
	const { columns, isLoading, isError } = useColumnVisibility(
		entity,
		deviceType,
	);

	const visibilityMap = useMemo(() => {
		const map: Record<string, boolean> = {};
		for (const col of columns) {
			map[col.field] = true; // API에서 이미 필터링된 컬럼만 옴
		}
		return map;
	}, [columns]);

	return {
		/** 필드명 → 가시성 맵 */
		visibilityMap,
		/** 로딩 상태 */
		isLoading,
		/** 에러 상태 */
		isError,
	};
}
