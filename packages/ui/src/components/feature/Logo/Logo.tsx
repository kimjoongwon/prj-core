"use client";

import { useNavigationStore } from "@cocrepo/store";
import { Button, cn } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { renderLucideIcon } from "../../../utils/iconUtils";

export interface AppLogoProps {
	/** 로고 아이콘 (Lucide 아이콘 이름) */
	icon?: string;
	/** 로고 텍스트 */
	text?: string;
	/** 추가 클래스명 */
	className?: string;
}

/**
 * AppLogo Feature 컴포넌트
 * Header의 left 영역에 사용
 * 클릭 시 첫 번째 아이템으로 이동합니다.
 *
 * @example
 * ```tsx
 * <Header left={<AppLogo icon="LayoutGrid" text="Admin" />} />
 * ```
 */
export const AppLogo = observer(
	({ icon = "LayoutGrid", text = "Admin", className }: AppLogoProps) => {
		const navigationStore = useNavigationStore();

		const handleClickLogo = () => {
			// 첫 번째 아이템으로 이동
			const firstNavItem = navigationStore.items[0];
			if (firstNavItem) {
				navigationStore.selectNavItem(firstNavItem.id);
			}
		};

		return (
			<Button
				variant="light"
				className={cn(
					"flex items-center gap-2 p-0 font-bold text-xl",
					className,
				)}
				onPress={handleClickLogo}
			>
				{icon && renderLucideIcon(icon, "h-5 w-5", 20)}
				<span>{text}</span>
			</Button>
		);
	},
);

AppLogo.displayName = "AppLogo";
