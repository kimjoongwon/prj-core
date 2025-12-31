"use client";

import { useMemo } from "react";
import { useAbility } from "./AbilityContext";

/**
 * 메뉴 아이템 인터페이스 (adminMenuConfig와 동일)
 */
interface SubMenuItem {
	id: string;
	label: string;
	path: string;
	icon?: string;
	subject: string;
}

interface MenuItem {
	id: string;
	label: string;
	path?: string;
	icon?: string;
	children?: SubMenuItem[];
	subject: string;
}

/**
 * 특정 메뉴에 대한 접근 권한 확인
 * @param menuSubject 메뉴 Subject (예: 'menu:members')
 * @returns 접근 가능 여부
 */
export function useMenuAccess(menuSubject: string): boolean {
	const ability = useAbility();
	return ability.can("ACCESS", menuSubject);
}

/**
 * CASL ability 기반 메뉴 필터링
 * 사용자가 접근 가능한 메뉴만 반환합니다.
 *
 * @param menuItems 전체 메뉴 설정
 * @returns 필터링된 메뉴 목록
 */
export function useFilteredMenuItems<T extends MenuItem>(menuItems: T[]): T[] {
	const ability = useAbility();

	return useMemo(() => {
		return menuItems
			.filter((menu) => ability.can("ACCESS", menu.subject))
			.map((menu) => ({
				...menu,
				children: menu.children?.filter((subMenu) =>
					ability.can("ACCESS", subMenu.subject),
				),
			}))
			.filter((menu) => !menu.children || menu.children.length > 0);
	}, [menuItems, ability]);
}

/**
 * 메뉴 필터링 유틸 함수 (비훅 버전)
 * Provider 외부에서 사용할 때 사용합니다.
 */
export function filterMenuByAbility<T extends MenuItem>(
	menuItems: T[],
	can: (action: string, subject: string) => boolean,
): T[] {
	return menuItems
		.filter((menu) => can("ACCESS", menu.subject))
		.map((menu) => ({
			...menu,
			children: menu.children?.filter((subMenu) =>
				can("ACCESS", subMenu.subject),
			),
		}))
		.filter((menu) => !menu.children || menu.children.length > 0);
}
