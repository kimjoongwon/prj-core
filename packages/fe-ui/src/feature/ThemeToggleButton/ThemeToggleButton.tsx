"use client";

import { Button } from "@cocrepo/ui/heroui";
import { Moon, Sun } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useDesignSystemTheme } from "../../design-system/provider";
import { useT } from "../../i18n";

export interface ThemeToggleButtonProps {
	className?: string;
	compact?: boolean;
}

export const ThemeToggleButton = observer(function ThemeToggleButton({
	className,
	compact = false,
}: ThemeToggleButtonProps) {
	const t = useT();
	const { resolvedTheme, toggleTheme } = useDesignSystemTheme();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const isDark = isMounted && resolvedTheme === "dark";
	const nextThemeLabel = isMounted
		? isDark
			? t("라이트 모드")
			: t("다크 모드")
		: t("테마 전환");
	const Icon = isDark ? Sun : Moon;
	const ariaLabel = isMounted
		? t("{{theme}}로 전환").replace("{{theme}}", nextThemeLabel)
		: t("테마 전환");

	if (compact) {
		return (
			<Button
				isIconOnly
				variant="light"
				size="sm"
				radius="full"
				aria-label={ariaLabel}
				onPress={toggleTheme}
				className={className}
			>
				<Icon size={16} />
			</Button>
		);
	}

	return (
		<Button
			variant="bordered"
			size="sm"
			radius="full"
			aria-label={ariaLabel}
			onPress={toggleTheme}
			startContent={<Icon size={16} />}
			className={[
				"border-slate-200/70 bg-white/80 text-slate-700 shadow-lg shadow-slate-900/5 backdrop-blur-md hover:bg-white",
				"dark:border-white/10 dark:bg-slate-950/75 dark:text-slate-100 dark:hover:bg-slate-950",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			{nextThemeLabel}
		</Button>
	);
});
