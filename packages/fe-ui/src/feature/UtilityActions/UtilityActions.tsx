"use client";

import { useLocaleStore } from "@cocrepo/store";
import { observer } from "mobx-react-lite";
import { LanguageSelectButton } from "../LanguageSelectButton";
import { ThemeToggleButton } from "../ThemeToggleButton";

export interface UtilityActionsProps {
	className?: string;
	controlClassName?: string;
}

/**
 * language/theme 같은 전역 utility action을 렌더링합니다.
 */
export const UtilityActions = observer(function UtilityActions({
	className = "absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6",
	controlClassName,
}: UtilityActionsProps) {
	const localeStore = useLocaleStore();

	const onChangeLanguage = (
		languageCode: Parameters<typeof localeStore.setLanguageCode>[0],
	) => {
		localeStore.setLanguageCode(languageCode);
	};

	return (
		<div className={className}>
			<LanguageSelectButton
				value={localeStore.languageCode}
				onChange={onChangeLanguage}
				className={controlClassName}
			/>
			<ThemeToggleButton className={controlClassName} />
		</div>
	);
});
