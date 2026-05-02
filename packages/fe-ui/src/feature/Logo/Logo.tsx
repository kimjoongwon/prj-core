"use client";

import type { AppIconName } from "@cocrepo/type";
import { useNavigationStore } from "@cocrepo/store";
import { Button, cn } from "@cocrepo/ui/heroui";
import { observer } from "mobx-react-lite";
import { AppIcon } from "../../design-system/icon/AppIcon";

export interface AppLogoProps {
	/** 로고 아이콘 (Lucide 아이콘 이름) */
	icon?: AppIconName;
	/** 로고 텍스트 */
	text?: string;
	/** 로고 서브 타이틀 */
	subtitle?: string;
	/** 텍스트 숨김 여부 */
	compact?: boolean;
	/** 콘솔 shell 전용 스타일 여부 */
	variant?: "plain" | "console";
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
	({
		icon = "LayoutGrid",
		text = "Admin",
		subtitle,
		compact = false,
		variant = "plain",
		className,
	}: AppLogoProps) => {
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
					variant === "console"
						? "group inline-flex min-w-0 items-center gap-3 rounded-2xl p-0 transition-transform hover:-translate-y-0.5 hover:bg-transparent data-[hover=true]:bg-transparent"
						: "flex items-center gap-2 p-0 font-bold text-xl",
					className,
				)}
				onPress={handleClickLogo}
			>
				{icon &&
					(variant === "console" ? (
						<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-slate-950 text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.58)] ring-1 ring-white/60 dark:bg-white dark:text-slate-950 dark:ring-white/10">
							<AppIcon name={icon} className="h-5 w-5" size={20} />
						</span>
					) : (
						<AppIcon name={icon} className="h-5 w-5" size={20} />
					))}
				{!compact &&
					(variant === "console" ? (
						<span className="min-w-0">
							{subtitle && (
								<span className="block truncate text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
									{subtitle}
								</span>
							)}
							<span className="mt-0.5 block truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
								{text}
							</span>
						</span>
					) : (
						<span>{text}</span>
					))}
			</Button>
		);
	},
);

AppLogo.displayName = "AppLogo";
